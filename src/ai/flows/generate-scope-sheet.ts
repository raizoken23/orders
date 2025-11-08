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
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const templatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        // Create temporary files for payload and output
        const tempDir = os.tmpdir();
        const uniqueId = Date.now();
        const payloadPath = path.join(tempDir, `payload-${uniqueId}.json`);
        const outputPath = path.join(tempDir, `output-${uniqueId}.pdf`);

        await fs.writeFile(payloadPath, JSON.stringify(data, null, 2));

        const command = `python3 ${scriptPath} ${templatePath} ${coordsPath} ${payloadPath} ${outputPath}`;
        
        console.log(`[generateScopeSheetFlow] Executing command: ${command}`);

        try {
            const { stdout, stderr } = await ai.run(command, {});
            
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
                 return { error: `Failed to read PDF output file. STDERR: ${stderr}`, stdout, stderr };
            }

        } catch (execError: any) {
            console.error(`[generateScopeSheetFlow] Execution failed: ${execError.message}`);
            return { error: `Python script execution failed: ${execError.message}`, stdout: execError.stdout || '', stderr: execError.stderr || '' };
        } finally {
            // Clean up temporary files
            await fs.unlink(payloadPath).catch((err) => console.log(`[cleanup] Failed to delete payload file: ${err.message}`));
            await fs.unlink(outputPath).catch((err) => console.log(`[cleanup] Failed to delete output file: ${err.message}`));
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
