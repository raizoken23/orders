# ScopeSheet Pro: Function and Component List

This document provides a technical overview of the key functions, components, and AI flows within the ScopeSheet Pro application.

## AI Flows (Server-Side Logic)

All Genkit flows are located in `src/ai/flows/`. These are server-side functions that handle the core business logic.

| Function/Flow Name        | File Location                                 | Description                                                                                                                                                             |
| ------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analyzeRoofImage`        | `analyze-roof-image-for-issues.ts`            | Takes a data URI of a roof image and uses an AI model to identify and describe potential damage or wear.                                                                  |
| `extractClaimInformation` | `extract-claim-information.ts`                | Takes a data URI of a claim document screenshot and extracts structured data like claim number, client name, address, etc.                                               |
| `generateScopeSheetPdf`   | `generate-scope-sheet.ts`                     | **Core PDF Generation.** Takes all form data, executes a Python script to stamp the data onto a master PDF template (`satellite_base.pdf`), and returns the final PDF. |

## Key React Components

These are the primary components that make up the user interface.

| Component Name            | File Location                               | Description                                                                                                                                                           |
| ------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardPage`           | `(app)/dashboard/page.tsx`                  | The main landing page after login, providing an overview and navigation to key features.                                                                              |
| `ImportClaimClient`       | `(app)/import-claim/import-claim-client.tsx`| Handles the UI for uploading a claim document, calling the extraction AI, and displaying the results before creating a new scope sheet.                                 |
| `ScopeSheetPage`          | `(app)/scope-sheet/page.tsx`                | The main form for inputting inspection data. It uses `react-hook-form` for state management and Zod for validation. Contains the logic to call the PDF generation flow. |
| `ImageAnalysisClient`     | `(app)/image-analysis/image-analysis-client.tsx` | Provides the UI for uploading a roof image, calling the analysis AI, and displaying the report.                                                                   |
| `SettingsPage`            | `(app)/settings/page.tsx`                   | Contains user profile settings and the UI for toggling between Google Gemini and OpenAI models.                                                                       |
| `AppSidebar`              | `components/app-sidebar.tsx`                | The main navigation component for the application, with links to all major pages.                                                                                     |

## Data Schema

| Schema Name        | File Location                   | Description                                                                  |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------- |
| `scopeSheetSchema` | `lib/schema/scope-sheet.ts` | The Zod schema that defines the data structure and validation rules for the entire scope sheet form. This schema is used by both the frontend form and the server-side PDF generation flow. |

## Helper Functions & Hooks

| Name             | File Location           | Description                                                                                             |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `cn`             | `lib/utils.ts`          | A utility function to merge Tailwind CSS classes, handling conflicts gracefully.                        |
| `useToast`       | `hooks/use-toast.ts`    | A custom hook for dispatching toast notifications (e.g., for success or error messages).                 |
| `useIsMobile`    | `hooks/use-mobile.tsx`  | A custom hook to detect if the application is being viewed on a mobile-sized screen.                      |
| `genkit` config  | `ai/genkit.ts`            | The central Genkit configuration file. It initializes and configures the AI plugins (Google, OpenAI) and dynamically selects the model based on user settings. |
