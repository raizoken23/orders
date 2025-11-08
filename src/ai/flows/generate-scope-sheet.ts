
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
import fs from 'fs';

// Define the output schema to expect a base64 string or an error
const GenerateScopeSheetOutputSchema = z.object({
    pdfBase64: z.string().optional(),
    error: z.string().optional(),
    traceback: z.string().optional(),
});

const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: GenerateScopeSheetOutputSchema,
    },
    async (data) => {
        // Resolve paths relative to the project root
        const templatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        try {
            // Log the paths for debugging
            console.log(`[generateScopeSheetFlow] Template Path: ${templatePath}`);
            console.log(`[generateScopeSheetFlow] Coords Path: ${coordsPath}`);
            console.log(`[generateScopeSheetFlow] Script Path: ${scriptPath}`);

            // The Genkit Python runner needs the function name `run` to be specified
            const { output, error } = await ai.run({
                runtime: 'python',
                file: scriptPath,
                fn: 'run',
                input: {
                    template: templatePath,
                    coords: coordsPath,
                    payload: data,
                },
            });

            if (error) {
                console.error('[generateScopeSheetFlow] ai.run reported an error:', error);
                return { error: error.message, stdout: '', stderr: error.stack || '' };
            }
            
            // The python script now returns a JSON object with either `pdfBase64` or `error`
            const result = output as z.infer<typeof GenerateScopeSheetOutputSchema>;

            if (result.error) {
                 console.error(`[generateScopeSheetFlow] Python script returned an error: ${result.error}`);
                 console.error(`[generateScopeSheetFlow] Python Traceback: ${result.traceback}`);
                 return { error: result.error, stderr: result.traceback, stdout: '' };
            }

            return { pdfBase64: result.pdfBase64 };

        } catch (execError: any) {
            console.error(`[generateScopeSheetFlow] Tool execution failed: ${execError.message}`);
            // Provide a structured error response
            return {
                error: `Tool execution failed: ${execError.message}`,
                stdout: execError.stdout || '',
                stderr: execError.stderr || execError.stack || 'No stack trace available',
            };
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    const result = await generateScopeSheetFlow(data);
    // Ensure the return type matches what the frontend expects
    return {
        pdfBase64: result.pdfBase64,
        error: result.error,
        stdout: '', // stdout is less relevant now as logic is in python script
        stderr: result.error ? (result.traceback || result.error) : undefined
    };
}

    