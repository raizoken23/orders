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

const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: z.object({
            pdfBase64: z.string(),
        }),
    },
    async (data) => {
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const templatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        const scriptPath = path.resolve(process.cwd(), 'pdfsys/stamp_pdf.py');

        // Create temporary files for payload and output
        const tempDir = os.tmpdir();
        const payloadPath = path.join(tempDir, `payload-${Date.now()}.json`);
        const outputPath = path.join(tempDir, `output-${Date.now()}.pdf`);

        await fs.writeFile(payloadPath, JSON.stringify(data));

        const command = `python ${scriptPath} ${templatePath} ${coordsPath} ${payloadPath} ${outputPath}`;

        try {
            await ai.run(command, {});
            
            const pdfBytes = await fs.readFile(outputPath);
            const pdfBase64 = pdfBytes.toString('base64');
            
            return { pdfBase64 };
        } finally {
            // Clean up temporary files
            await fs.unlink(payloadPath).catch(() => {});
            await fs.unlink(outputPath).catch(() => {});
        }
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
