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

const GenerateScopeSheetOutputSchema = z.object({
    pdfBase64: z.string().optional(),
    error: z.string().optional(),
    stdout: z.string().optional(),
    stderr: z.string().optional(),
});

// Define a specific tool for running the PDF stamping script
const stampPdfTool = ai.defineTool(
    {
        name: 'stampPdfTool',
        description: 'Runs a python script to stamp data onto a PDF template.',
        inputSchema: scopeSheetSchema,
        outputSchema: GenerateScopeSheetOutputSchema,
    },
    async (data) => {
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const templatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        const tempDir = os.tmpdir();
        const uniqueId = Date.now();
        const payloadPath = path.join(tempDir, `payload-${uniqueId}.json`);
        const outputPath = path.join(tempDir, `output-${uniqueId}.pdf`);

        await fs.writeFile(payloadPath, JSON.stringify(data, null, 2));

        const command = `python ${scriptPath} ${templatePath} ${coordsPath} ${payloadPath} ${outputPath}`;
        
        console.log(`[stampPdfTool] Executing command: ${command}`);
        
        try {
            const exec = require('child_process').exec;
            return await new Promise((resolve) => {
                 exec(command, async (error: any, stdout: string, stderr: string) => {
                    console.log(`[stampPdfTool] STDOUT: ${stdout}`);
                    if (stderr) {
                        console.error(`[stampPdfTool] STDERR: ${stderr}`);
                    }
                    if (error) {
                        console.error(`[stampPdfTool] Execution failed: ${error.message}`);
                        resolve({ error: `Python script execution failed: ${error.message}`, stdout, stderr });
                        return;
                    }

                    try {
                        const pdfBytes = await fs.readFile(outputPath);
                        const pdfBase64 = pdfBytes.toString('base64');
                        resolve({ pdfBase64, stdout, stderr: stderr || '' });
                    } catch (readError: any) {
                        console.error(`[stampPdfTool] Error reading output file: ${readError.message}`);
                        resolve({ error: `Failed to read PDF output file. STDERR: ${stderr}`, stdout, stderr });
                    } finally {
                        await fs.unlink(payloadPath).catch((err) => console.log(`[cleanup] Failed to delete payload file: ${err.message}`));
                        await fs.unlink(outputPath).catch((err) => console.log(`[cleanup] Failed to delete output file: ${err.message}`));
                    }
                });
            });

        } catch (execError: any) {
            console.error(`[stampPdfTool] Top-level execution failed: ${execError.message}`);
            return { error: `Tool execution wrapper failed: ${execError.message}` };
        }
    }
);


const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: GenerateScopeSheetOutputSchema,
        tools: [stampPdfTool],
    },
    async (data) => {
        return await stampPdfTool(data);
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
