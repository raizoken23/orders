'use client';
import {genkit} from 'genkit';
// This is the client-safe wrapper for Genkit.
// It does not contain any server-side plugins or configurations.
// The actual configuration is in genkit-server.ts.
export const ai = genkit();
