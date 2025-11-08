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


const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: GenerateScopeSheetOutputSchema,
    },
    async (data) => {
        const masterTemplatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        const tempDir = os.tmpdir();
        const uniqueId = `pdf-gen-${Date.now()}`;
        const runDir = path.join(tempDir, uniqueId);
        await fs.mkdir(runDir, { recursive: true });

        const templatePath = path.join(runDir, 'template.pdf');
        const payloadPath = path.join(runDir, 'payload.json');
        const outputPath = path.join(runDir, 'output.pdf');
        
        console.log(`[generateScopeSheetFlow] Temp Dir: ${runDir}`);
        console.log(`[generateScopeSheetFlow] Coords Path: ${coordsPath}`);
        console.log(`[generateScopeSheetFlow] Script Path: ${scriptPath}`);
        console.log(`[generateScopeSheetFlow] Payload Path: ${payloadPath}`);
        console.log(`[generateScopeSheetFlow] Output Path: ${outputPath}`);
        console.log(`[generateScopeSheetFlow] Master Template Path: ${masterTemplatePath}`);


        await fs.writeFile(payloadPath, JSON.stringify(data, null, 2));
        await fs.copyFile(masterTemplatePath, templatePath);


        try {
            const { stdout, stderr } = await ai.run('python', [
                scriptPath,
                templatePath,
                coordsPath,
                payloadPath,
                outputPath,
            ]);

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
                return { error: `Failed to read PDF output file.`, stdout, stderr: stderr || readError.message };
            }
        } catch (execError: any) {
            console.error(`[generateScopeSheetFlow] Script execution failed: ${execError.message}`);
            return { error: `Python script execution failed.`, stdout: execError.stdout, stderr: execError.stderr };
        } finally {
            await fs.unlink(payloadPath).catch((err) => console.log(`[cleanup] Failed to delete payload file: ${err.message}`));
            await fs.unlink(templatePath).catch((err) => console.log(`[cleanup] Failed to delete template file: ${err.message}`));
            await fs.unlink(outputPath).catch((err) => console.log(`[cleanup] Failed to delete output file: ${err.message}`));
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
