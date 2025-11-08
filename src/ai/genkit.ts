import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openai} from '@genkit-ai/openai';

// Check if the OPENAI_API_KEY is available in the environment
const openAIKey = process.env.OPENAI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI(),
    // Only include the OpenAI plugin if the API key is present
    openAIKey ? openai({apiKey: openAIKey}) : undefined,
  ].filter(p => p), // Filter out any undefined plugins
  model: 'googleai/gemini-2.5-flash',
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
