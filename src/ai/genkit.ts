import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import OpenAI from 'openai';

// This is the primary Genkit configuration, used by Next.js in server-side code.
export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// The configureGenkit function is deprecated in recent versions of Genkit.
// The primary `ai` export above is now used by all parts of the application,
// including standalone scripts.
