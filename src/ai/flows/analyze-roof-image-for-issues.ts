'use server';
/**
 * @fileOverview AI-powered tool that analyzes roof images to detect potential issues.
 *
 * - analyzeRoofImage - Analyzes an uploaded roof image for potential issues.
 * - AnalyzeRoofImageInput - The input type for the analyzeRoofImage function.
 * - AnalyzeRoofImageOutput - The return type for the analyzeRoofImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRoofImageInputSchema = z.object({
  roofImageDataUri: z
    .string()
    .describe(
      "A photo of a roof, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeRoofImageInput = z.infer<typeof AnalyzeRoofImageInputSchema>;

const AnalyzeRoofImageOutputSchema = z.object({
  detectedIssues: z
    .string()
    .describe('A detailed description of potential issues detected in the roof image.'),
});
export type AnalyzeRoofImageOutput = z.infer<typeof AnalyzeRoofImageOutputSchema>;

export async function analyzeRoofImage(input: AnalyzeRoofImageInput): Promise<AnalyzeRoofImageOutput> {
  return analyzeRoofImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRoofImagePrompt',
  input: {schema: AnalyzeRoofImageInputSchema},
  output: {schema: AnalyzeRoofImageOutputSchema},
  prompt: `You are an expert roof inspector. Analyze the provided roof image and identify any potential issues, such as damage, wear, or structural concerns.\n\nRoof Image: {{media url=roofImageDataUri}}\n\nProvide a detailed description of the detected issues:`,
});

const analyzeRoofImageFlow = ai.defineFlow(
  {
    name: 'analyzeRoofImageFlow',
    inputSchema: AnalyzeRoofImageInputSchema,
    outputSchema: AnalyzeRoofImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
