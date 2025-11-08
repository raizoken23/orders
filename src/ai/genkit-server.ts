import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This is the primary Genkit configuration, used by Next.js in server-side code.
// It only contains the server-side plugins that don't rely on dynamic client-side keys.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
