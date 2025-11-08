# ScopeSheet Pro: Function and Component List

This document provides a technical overview of the key functions, components, and AI flows within the ScopeSheet Pro application.

## AI Flows (Server-Side Logic)

Located in `src/ai/flows/`. These are server-side functions that orchestrate business logic.

| Function/Flow Name        | File Location                    | Description                                                                                                                                                             |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analyzeRoofImage`        | `analyze-roof-image-for-issues.ts`| Takes a data URI of a roof image and uses an AI model to identify and describe potential damage or wear.                                                                  |
| `extractClaimInformation` | `extract-claim-information.ts`   | (Demo) Takes a data URI of a claim document screenshot and extracts structured data like claim number, client name, etc.                                                 |
| `generateScopeSheetPdf`   | `generate-scope-sheet.ts`        | **Core PDF Generation.** Takes all form data, calls the Python tool via `callPythonTool`, handles errors, and returns the final PDF or a structured error object.       |
| `diagnoseExecutionError`  | `diagnose-error.ts`              | An internal AI agent that takes `stdout`/`stderr` from a failed script and returns a plain-English analysis and recommended fix for display in the frontend error dialog. |

## Key React Components

| Component Name            | File Location                               | Description                                                                                                                                                           |
| ------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardPage`           | `(app)/dashboard/page.tsx`                  | The main landing page after login, providing an overview and navigation.                                                                                              |
| `ImportClaimPage`         | `(app)/import-claim/page.tsx`               | **Demo Starter.** Contains the button to start a new inspection using pre-filled sample data.                                                                         |
| `ScopeSheetPage`          | `(app)/scope-sheet/page.tsx`                | The main form for inputting inspection data. It uses `react-hook-form` and handles the call to the PDF generation flow, including displaying a diagnostic error dialog. |
| `ImageAnalysisClient`     | `(app)/image-analysis/image-analysis-client.tsx` | Provides the UI for uploading a roof image, calling the analysis AI, and displaying the report.                                                                       |
| `AppSidebar`              | `components/app-sidebar.tsx`                | The main navigation component for the application.                                                                                                                    |

## Helper Functions & Core Logic

| Name             | File Location               | Description                                                                                                                                            |
| ---------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `callPythonTool` | `ai/lib/callPythonTool.ts`  | A crucial wrapper around `ai.run`. It resolves absolute paths to the Python script and its assets, invokes the tool, and validates the output with Zod.    |
| `pdfPreflight`   | `ai/preflight/pdfPreflight.ts`| **Startup Check.** A function called on server boot (`layout.tsx`) that runs a quick check to ensure the Python entrypoint is valid, preventing runtime errors. |
| `scopeSheetSchema`| `lib/schema/scope-sheet.ts` | The Zod schema that defines the data structure and validation rules for the entire scope sheet form.                                                    |
| `cn`             | `lib/utils.ts`              | A utility function to merge Tailwind CSS classes.                                                                                                      |

## Diagnostic & Testing Scripts

| Script Name        | File Location              | Description                                                                                                 |
| ------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pdf-doctor.ts`    | `scripts/pdf-doctor.ts`    | **One-Shot Doctor.** The primary debugging tool. Runs a full-stack check of the PDF system and prints a report. |
| `runner_diag.py`   | `pdfsys/runner_diag.py`    | A Python script used by the preflight and doctor checks to verify that a given Python module has a valid `run` export. |
| `paths.ts`         | `scripts/diag/paths.ts`    | A simple probe to check file path resolution from the current working directory.                               |
| `genkit_probe.ts`  | `scripts/diag/genkit_probe.ts`| A probe to test the `ai.run` call in isolation.                                                             |
| `test_stamp_pdf.py`| `tests_py/test_stamp_pdf.py`| Pytest tests for the core PDF stamping Python script.                                                       |
