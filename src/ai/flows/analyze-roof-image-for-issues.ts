'use server';
/**
 * @fileOverview AI-powered tool that analyzes roof images to detect potential issues.
 *
 * - analyzeRoofImage - Analyzes an uploaded roof image for potential issues.
 * - AnalyzeRoofImageInput - The input type for the analyzeRoofImage function.
 * - AnalyzeRoofImageOutput - The return type for the analyzeRoofImage function.
 */

import {ai} from '@/ai/genkit-server';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from '@genkit-ai/compat-oai/openai';

const AnalyzeRoofImageInputSchema = z.object({
  roofImageDataUri: z
    .string()
    .describe(
      "A photo of a roof, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  provider: z.enum(['google', 'openai']).optional().default('google'),
  openAIKey: z.string().optional().describe('The OpenAI API key, if the provider is OpenAI.')
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
    let model;
    if (input.provider === 'openai') {
        if (!input.openAIKey) {
            throw new Error("The AI provider is set to OpenAI, but no API key was provided. Please add your key in the Settings page.");
        }
        model = openAI({ apiKey: input.openAIKey }).model('gpt-4o-mini');
    } else {
        model = googleAI().model('gemini-pro-vision');
    }

    const {output} = await prompt(input, { model });
    return output!;
  }
);
