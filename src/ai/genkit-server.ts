import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openAI} from '@genkit-ai/compat-oai/openai';

// This is the primary Genkit configuration, used by Next.js in server-side code.
// The key is dynamically read from localStorage on the client and passed to the server action.
export const ai = genkit({
  plugins: [
    googleAI(),
    openAI({
      apiKey:
        (typeof window !== 'undefined' && localStorage.getItem('openAIKey')) ||
        process.env.OPENAI_API_KEY ||
        'YOUR_API_KEY',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
