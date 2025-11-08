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

const PdfResultSchema = z.union([
  z.object({ pdfBase64: z.string().min(20) }),
  z.object({ error: z.object({
    code: z.string(), message: z.string(), detail: z.string().optional().nullable()
  }) })
]);


export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await trace.getTracer("pdf").startActiveSpan("pdf.generate", async (span) => {
        span.setAttribute("fn","run");
        try {
            const output = await callPythonTool(data);
            
            // Validate the output from the Python tool
            const result = PdfResultSchema.safeParse(output);
            if (!result.success) {
                console.error("PY_BAD_OUTPUT_ERROR", { error: result.error, received: output });
                throw new Error(`PY_BAD_OUTPUT: Python script returned an invalid format.`);
            }

            if ('error' in result.data && result.data.error) {
                console.error(`[generateScopeSheetPdf] Python script returned an error: ${result.data.error.message}`);
                span.setAttribute("result", "error");
                span.recordException(new Error(result.data.error.message));

                return {
                    error: result.data.error.message,
                    stderr: result.data.error.detail || `Python script failed with code: ${result.data.error.code}.`,
                    stdout: `Python script failed.`,
                };
            }
            
            span.setAttribute("result","ok");
            return result.data;

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
