
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

// Define the output schema to expect a base64 string or a structured error
const PythonOutputSchema = z.object({
    pdfBase64: z.string().optional(),
    error: z.object({
        code: z.string(),
        message: z.string(),
        detail: z.string().optional().nullable(),
    }).optional(),
});


const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: PythonOutputSchema,
    },
    async (data) => {
        // Define absolute paths for reliability
        const templatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        try {
            console.log(`[generateScopeSheetFlow] Executing Python script: ${scriptPath}`);
            console.log(`[generateScopeSheetFlow] Using template: ${templatePath}`);
            console.log(`[generateScopeSheetFlow] Using coords: ${coordsPath}`);

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
                 console.error('[generateScopeSheetFlow] ai.run reported an execution error:', error);
                 return { error: { code: 'AI_RUN_EXECUTION_ERROR', message: error.message, detail: error.stack || 'No stack trace' }};
            }
            
            const result = output as z.infer<typeof PythonOutputSchema>;

            if (result.error) {
                 console.error(`[generateScopeSheetFlow] Python script returned an error: ${result.error.message}`);
                 console.error(`[generateScopeSheetFlow] Python Traceback: ${result.error.detail}`);
                 return { error: result.error };
            }

            return { pdfBase64: result.pdfBase64 };

        } catch (execError: any) {
            console.error(`[generateScopeSheetFlow] An unexpected exception occurred: ${execError.message}`);
            return {
                error: {
                    code: 'UNEXPECTED_FLOW_EXCEPTION',
                    message: execError.message,
                    detail: execError.stack || 'No stack trace available',
                }
            };
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    const result = await generateScopeSheetFlow(data);
    
    // Adapt the structured error for the frontend
    if (result.error) {
        return {
            error: result.error.message,
            stderr: result.error.detail || `Error Code: ${result.error.code}`,
            stdout: `Python script failed with code: ${result.error.code}. See stderr for details.`,
        };
    }

    return {
        pdfBase64: result.pdfBase64,
    };
}

    