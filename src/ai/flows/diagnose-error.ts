'use server';
/**
 * @fileOverview An AI flow that diagnoses execution errors.
 *
 * - diagnoseExecutionError - Analyzes stdout/stderr to identify the root cause of a script failure.
 * - DiagnoseErrorInput - The input type for the diagnoseExecutionError function.
 * - DiagnoseErrorOutput - The return type for the diagnoseExecutionError function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DiagnoseErrorInputSchema = z.object({
  command: z.string().describe('The command that was executed.'),
  stdout: z.string().describe('The standard output from the command.'),
  stderr: z.string().describe('The standard error from the command.'),
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
        const { output } = await prompt(input);
        return output!;
    }
);


export async function diagnoseExecutionError(input: DiagnoseErrorInput): Promise<DiagnoseErrorOutput> {
  return diagnoseExecutionErrorFlow(input);
}
