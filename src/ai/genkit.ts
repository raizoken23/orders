import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import OpenAI from 'openai';

// This is the primary Genkit configuration, used by Next.js in server-side code.
export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// This is a secondary configuration used by standalone scripts like the doctor.
configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
