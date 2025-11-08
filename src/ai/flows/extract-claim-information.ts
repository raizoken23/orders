'use server';
/**
 * @fileOverview AI-powered tool that extracts claim information from an image.
 *
 * - extractClaimInformation - Extracts claim information from an image.
 * - ExtractClaimInformationInput - The input type for the extractClaimInformation function.
 * - ExtractClaimInformationOutput - The return type for the extractClaimInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractClaimInformationInputSchema = z.object({
  claimScreenshotUri: z
    .string()
    .describe(
      "A screenshot of a claim document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractClaimInformationInput = z.infer<typeof ExtractClaimInformationInputSchema>;

const ExtractClaimInformationOutputSchema = z.object({
  claimNumber: z.string().describe('The claim number.'),
  policyNumber: z.string().describe('The policy number.'),
  clientName: z.string().describe('The name of the client or insured.'),
  clientEmail: z.string().describe('The email address of the client.'),
  clientPhone: z.string().describe('The phone number of the client.'),
  propertyAddress: z.string().describe('The full address of the property related to the claim.'),
  dateOfLoss: z.string().describe('The date of loss for the claim.'),
});
export type ExtractClaimInformationOutput = z.infer<typeof ExtractClaimInformationOutputSchema>;

export async function extractClaimInformation(input: ExtractClaimInformationInput): Promise<ExtractClaimInformationOutput> {
  return extractClaimInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractClaimInformationPrompt',
  input: {schema: ExtractClaimInformationInputSchema},
  output: {schema: ExtractClaimInformationOutputSchema},
  prompt: `You are an expert at extracting structured information from documents. Analyze the provided screenshot of a claim document and extract the following fields: claim number, policy number, client name, client email, client phone, property address, and date of loss.

Claim Screenshot: {{media url=claimScreenshotUri}}

Extract the information and return it in the specified JSON format. If a field is not present in the image, return an empty string for that field.`,
});

const extractClaimInformationFlow = ai.defineFlow(
  {
    name: 'extractClaimInformationFlow',
    inputSchema: ExtractClaimInformationInputSchema,
    outputSchema: ExtractClaimInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
