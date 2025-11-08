
'use server';
export const runtime = 'nodejs'; // Required: specify Node.js runtime for Python execution.

/**
 * @fileOverview A flow that generates a PDF scope sheet by stamping form data onto a template using a Python script.
 *
 * - generateScopeSheetPdf - The function that handles the PDF generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scopeSheetSchema } from '@/lib/schema/scope-sheet';
import path from 'node:path';
import fs from 'node:fs';

// Define the output schema to expect a base64 string or a structured error from Python
const PythonOutputSchema = z.union([
    z.object({
        pdfBase64: z.string(),
    }),
    z.object({
        error: z.object({
            code: z.string(),
            message: z.string(),
            detail: z.string().optional().nullable(),
        }),
    }),
]);


export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    const root = process.cwd();
    const file = path.join(root, 'pdfsys', 'stamp_pdf.py');
    const template = path.join(root, 'public', 'satellite_base.pdf');
    const coordsPath = path.join(root, 'pdfsys', 'coords.json.sample');

    try {
        console.log(`[generateScopeSheetPdf] Invoking Genkit Python runner...`);
        console.log(`[generateScopeSheetPdf] Script: ${file}`);
        console.log(`[generateScopeSheetPdf] Template: ${template}`);
        console.log(`[generateScopeSheetPdf] Coords: ${coordsPath}`);

        const coords = JSON.parse(fs.readFileSync(coordsPath,'utf8'));

        const { output, error: executionError } = await ai.run({
            runtime: 'python',
            file,
            fn: 'run', // This MUST match the function name in the Python script
            input: {
                template,
                coords,
                payload: data,
            },
        });

        if (executionError) {
             console.error('[generateScopeSheetPdf] ai.run reported a tool execution error:', executionError);
             return { 
                error: 'TOOL_EXECUTION_FAILURE', 
                stderr: executionError.stack || 'No stack trace', 
                stdout: `Genkit failed to execute the Python tool. Message: ${executionError.message}`
            };
        }
        
        const result = output as z.infer<typeof PythonOutputSchema>;
        
        if (result && 'error' in result && result.error) {
             console.error(`[generateScopeSheetPdf] Python script returned an error: ${result.error.message}`);
             console.error(`[generateScopeSheetPdf] Python Traceback: ${result.error.detail}`);
             return {
                error: result.error.message,
                stderr: result.error.detail || `Python script failed. See error message.`,
                stdout: `Python script failed with code: ${result.error.code}.`,
            };
        }

        if (result && 'pdfBase64' in result) {
            return {
                pdfBase64: result.pdfBase64,
            };
        }
        
        // Fallback for unexpected output format
        throw new Error(`PY_BAD_OUTPUT: Python script returned an unexpected format. Output: ${JSON.stringify(result)}`);


    } catch (e: any) {
        console.error('PDF_TOOL_INVOKE_FAIL', {
            file: 'pdfsys/stamp_pdf.py',
            fn: 'run',
            cwd: process.cwd(),
            err: String(e),
            stack: e.stack,
        });

        // Adapt the structured error for the frontend
        return {
            error: e.message || 'An unexpected error occurred in the Genkit flow.',
            stderr: e.stack || 'No stack trace available.',
            stdout: 'The TypeScript flow failed before or after the Python script execution.',
        };
    }
}
