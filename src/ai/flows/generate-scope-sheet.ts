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
        // For Stage 1, coords and payload are not used by the python script, but we need paths.
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample'); 
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        // Create a temporary directory for this specific run to avoid conflicts.
        const uniqueId = `pdf-gen-${Date.now()}`;
        const runDir = path.join(os.tmpdir(), uniqueId);
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

        // Write the payload and copy the template into the temporary directory.
        await fs.writeFile(payloadPath, JSON.stringify(data, null, 2));
        await fs.copyFile(masterTemplatePath, templatePath);
        console.log(`[generateScopeSheetFlow] Copied master template to temp location.`);

        try {
            // STAGE 1: Call the python script with minimal arguments.
            const { stdout, stderr } = await ai.run('python', [
                scriptPath,
                templatePath,
                outputPath, // Arg 2 for stage 1
                coordsPath, // Dummy arg 3
                payloadPath, // Dummy arg 4
            ]);

            console.log(`[generateScopeSheetFlow] STDOUT: ${stdout}`);
            if (stderr) {
                console.error(`[generateScopeSheetFlow] STDERR: ${stderr}`);
            }

            // After execution, check if the output file was actually created.
            try {
                const pdfBytes = await fs.readFile(outputPath);
                const pdfBase64 = pdfBytes.toString('base64');
                // If we have a PDF, return success.
                return { pdfBase64, stdout, stderr: stderr || '' };
            } catch (readError: any) {
                // This means the python script ran without crashing but DID NOT produce an output.pdf
                console.error(`[generateScopeSheetFlow] Error reading output file: ${readError.message}`);
                return { error: `Python script ran but failed to create a PDF.`, stdout, stderr: stderr || readError.message };
            }
        } catch (execError: any) {
            // This means the `ai.run()` command itself failed (e.g., command not found).
            console.error(`[generateScopeSheetFlow] Script execution failed: ${execError.message}`);
            return { error: `Python script execution failed.`, stdout: execError.stdout || '', stderr: execError.stderr || execError.message };
        } finally {
            // Cleanup the temporary files
            await fs.rm(runDir, { recursive: true, force: true }).catch((err) => console.log(`[cleanup] Failed to delete temp directory: ${err.message}`));
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
