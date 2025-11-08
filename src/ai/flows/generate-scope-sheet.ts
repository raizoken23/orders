'use server';
/**
 * @fileOverview A flow that generates a PDF scope sheet by stamping form data onto a template using a Python script.
 *
 * - generateScopeSheetPdf - The function that handles the PDF generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scopeSheetSchema } from '@/lib/schema/scope-sheet';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const GenerateScopeSheetOutputSchema = z.object({
    pdfBase64: z.string().optional(),
    error: z.string().optional(),
    stdout: z.string().optional(),
    stderr: z.string().optional(),
});

const stampPdfTool = ai.defineTool(
  {
    name: 'stampPdfTool',
    description: 'Runs the python script to stamp data onto the PDF template.',
    inputSchema: z.object({
      scriptPath: z.string(),
      templatePath: z.string(),
      coordsPath: z.string(),
      payloadPath: z.string(),
      outputPath: z.string(),
    }),
    outputSchema: z.object({
      stdout: z.string(),
      stderr: z.string(),
    }),
  },
  async (input) => {
    // Always use 'python'. The Genkit environment ensures this is available.
    const command = `python ${input.scriptPath} ${input.templatePath} ${input.coordsPath} ${input.payloadPath} ${input.outputPath}`;
    console.log(`[stampPdfTool] Executing command: ${command}`);
    const { stdout, stderr } = await execAsync(command);
    return { stdout, stderr };
  }
);


const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: GenerateScopeSheetOutputSchema,
        tools: [stampPdfTool]
    },
    async (data) => {
        const masterTemplatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample'); 
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        const uniqueId = `pdf-gen-${Date.now()}`;
        const runDir = path.join(os.tmpdir(), uniqueId);
        await fs.mkdir(runDir, { recursive: true });

        const templatePath = path.join(runDir, 'template.pdf');
        const payloadPath = path.join(runDir, 'payload.json');
        const outputPath = path.join(runDir, 'output.pdf');
        
        console.log(`[generateScopeSheetFlow] Temp Dir: ${runDir}`);
        console.log(`[generateScopeSheetFlow] Script Path: ${scriptPath}`);
        console.log(`[generateScopeSheetFlow] Output Path: ${outputPath}`);
        console.log(`[generateScopeSheetFlow] Master Template Path: ${masterTemplatePath}`);

        try {
            await fs.writeFile(payloadPath, JSON.stringify(data, null, 2));
            await fs.copyFile(masterTemplatePath, templatePath);
            console.log(`[generateScopeSheetFlow] Copied master template to temp location.`);

            const { stdout, stderr } = await stampPdfTool({
                scriptPath,
                templatePath,
                coordsPath, 
                payloadPath,
                outputPath,
            });

            console.log(`[generateScopeSheetFlow] STDOUT: ${stdout}`);
            if (stderr) {
                console.error(`[generateScopeSheetFlow] STDERR: ${stderr}`);
            }

            try {
                const pdfBytes = await fs.readFile(outputPath);
                const pdfBase64 = pdfBytes.toString('base64');
                return { pdfBase64, stdout, stderr: stderr || '' };
            } catch (readError: any) {
                console.error(`[generateScopeSheetFlow] Error reading output file: ${readError.message}`);
                return { error: `Python script ran but failed to create a PDF.`, stdout, stderr: stderr || readError.message };
            }
        } catch (execError: any) {
            console.error(`[generateScopeSheetFlow] Tool execution failed: ${execError.message}`);
            return { error: `Tool execution failed.`, stdout: execError.stdout || '', stderr: execError.stderr || execError.message };
        } finally {
            await fs.rm(runDir, { recursive: true, force: true }).catch((err) => console.log(`[cleanup] Failed to delete temp directory: ${err.message}`));
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
