
'use server';
/**
 * @fileOverview An AI flow that diagnoses execution errors.
 *
 * - diagnoseExecutionError - Analyzes stdout/stderr to identify the root cause of a script failure.
 * - DiagnoseErrorInput - The input type for the diagnoseExecutionError function.
 * - DiagnoseErrorOutput - The return type for the diagnoseExecutionError function.
 */

import { ai } from '@/ai/genkit-server';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from '@genkit-ai/compat-oai/openai';


const DiagnoseErrorInputSchema = z.object({
  command: z.string().describe('The command that was executed.'),
  stdout: z.string().describe('The standard output from the command.'),
  stderr: z.string().describe('The standard error from the command.'),
  provider: z.enum(['google', 'openai']).optional().default('google'),
  openAIKey: z.string().optional().describe('The OpenAI API key, if the provider is OpenAI.')
});
export type DiagnoseErrorInput = z.infer<typeof DiagnoseErrorInputSchema>;

const DiagnoseErrorOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the error, explaining the likely cause and suggesting a specific code-level fix.'),
});
export type DiagnoseErrorOutput = z.infer<typeof DiagnoseErrorOutputSchema>;


const prompt = ai.definePrompt({
    name: 'diagnoseErrorPrompt',
    input: { schema: DiagnoseErrorInputSchema },
    output: { schema: DiagnoseErrorOutputSchema },
    prompt: `You are an expert software diagnostician. A user's script failed to execute. Analyze the provided command, stdout, and stderr to determine the root cause.

Your analysis should be clear, concise, and actionable for a developer.

Command executed:
\`\`\`
{{command}}
\`\`\`

Standard Output (stdout):
\`\`\`
{{stdout}}
\`\`\`

Standard Error (stderr):
- If stderr is empty, but the error message is "unable to resolve run function", the primary cause is almost certainly a file path or bundling issue in Next.js. The Python script file or one of its dependencies was not found at runtime. Check the 'outputFileTracingIncludes' in 'next.config.ts' to ensure all required '.py' and asset files from the 'pdfsys' directory are being included in the server build.
- Otherwise, analyze the stderr content below:
\`\`\`
{{stderr}}
\`\`\`

Provide a step-by-step diagnosis and a recommended solution. If the error is a "command not found" issue, explain that it's an environment PATH problem. If it's a Python error, analyze the traceback. If it's a file path issue, point it out.
`,
});


const diagnoseExecutionErrorFlow = ai.defineFlow(
    {
        name: 'diagnoseExecutionErrorFlow',
        inputSchema: DiagnoseErrorInputSchema,
        outputSchema: DiagnoseErrorOutputSchema,
    },
    async (input) => {
        let model;
        if (input.provider === 'openai') {
            if (!input.openAIKey) {
                return { analysis: "The AI provider is set to OpenAI, but no API key was provided. Please add your key in the Settings page." };
            }
            model = openAI({ apiKey: input.openAIKey }).model('gpt-4o-mini');
        } else {
            model = googleAI().model('gemini-pro');
        }

        try {
            const { output } = await prompt(input, { model });
            return output!;
        } catch(e: any) {
            console.error("Diagnosis AI failed:", e);
            let userFriendlyError = "The AI assistant could not analyze the error. This is often due to an invalid or missing API key for the selected provider. Please verify your key in the Settings page.";
            
            if (e.message) {
                 if (e.message.includes("404 Not Found") || e.message.includes("not found")) {
                    userFriendlyError += " The specific model being requested was not found. The model name in the code may be incorrect or outdated.";
                 } else if (e.message.includes("API key") || e.message.includes("authentication")) {
                    userFriendlyError = "The API key for the selected provider is invalid or missing. Please go to the Settings page and enter a valid API key.";
                 }
            }

            return { analysis: userFriendlyError };
        }
    }
);


export async function diagnoseExecutionError(input: DiagnoseErrorInput): Promise<DiagnoseErrorOutput> {
  return diagnoseExecutionErrorFlow(input);
}
