'use server';

/**
 * @fileOverview A flow that generates a PDF scope sheet by stamping form data onto a template using a Python script.
 *
 * - generateScopeSheetPdf - The function that handles the PDF generation.
 */

import { z } from 'zod';
import { scopeSheetSchema } from '@/lib/schema/scope-sheet';
import { callPythonTool } from '@/ai/lib/callPythonTool';
import { trace } from "@opentelemetry/api";

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await trace.getTracer("pdf").startActiveSpan("pdf.generate", async (span) => {
        span.setAttribute("fn","run");
        try {
            const result = await callPythonTool(data);

            if ('error' in result && result.error) {
                console.error(`[generateScopeSheetPdf] Python script returned an error: ${result.error.message}`);
                span.setAttribute("result", "error");
                span.recordException(new Error(result.error.message));

                return {
                    error: result.error.message,
                    stderr: result.error.detail || `Python script failed with code: ${result.error.code}.`,
                    stdout: `Python script failed.`,
                };
            }
            
            span.setAttribute("result","ok");
            return result;

        } catch (e: any) {
             const errorDetails = {
                error: e.message || 'An unexpected error occurred in the Genkit flow.',
                stderr: e.stack || 'No stack trace available.',
                stdout: 'The TypeScript flow failed before or after the Python script execution.',
            };
            console.error('PDF_TOOL_INVOKE_FAIL', { ...errorDetails, cwd: process.cwd() });
            span.recordException(e);
            span.setAttribute("result","fail");
            return errorDetails;
        } finally {
            span.end();
        }
  });
}
