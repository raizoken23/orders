# ScopeSheet Pro

ScopeSheet Pro is a Next.js web application designed for insurance inspectors to digitize and streamline the process of creating property inspection scope sheets. It leverages AI to extract claim information from documents, analyze roof damage from images, and generate print-perfect PDF reports based on a standardized template.

This project was built in Firebase Studio.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
  - [AI Functionality](#ai-functionality)
  - [PDF Generation Architecture](#pdf-generation-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Diagnostics & Testing](#diagnostics--testing)

## Features

- **Digital Scope Sheet:** A comprehensive web form to input all details of a property inspection.
- **AI-Powered Claim Import:** Start a new inspection with a pre-filled demo sheet to see the app's capabilities.
- **AI Image Analysis:** Upload photos of a roof, and the AI will analyze them for potential damage, wear, and structural issues.
- **Pixel-Perfect PDF Generation:** Generates a professional, downloadable PDF scope sheet by stamping the collected data onto a master PDF template, ensuring perfect formatting every time.
- **Built-in Diagnostics:** Comes with a full suite of diagnostic tools and preflight checks to ensure the PDF generation subsystem is operational.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Backend:** [Genkit](https://firebase.google.com/docs/genkit)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **PDF Generation:** Server-side execution of a Python script using `pypdf` and `reportlab`.
- **Testing:** [Vitest](https://vitest.dev/) for TypeScript tests and [Pytest](https://pytest.org/) for Python tests.

## How It Works

### AI Functionality

The application's AI capabilities are powered by Genkit flows defined in `src/ai/flows/`.

- **`extract-claim-information.ts`**: (Demonstration) Takes an image of a document and returns structured data (claim number, policy number, etc.).
- **`analyze-roof-image-for-issues.ts`**: Takes an image of a roof and returns a text description of detected damage.
- **`generate-scope-sheet.ts`**: The core of the PDF generation. It orchestrates the data collection and calls the Python backend.
- **`diagnose-error.ts`**: An internal AI flow that analyzes Python execution errors and provides a plain-English diagnosis and fix.

### PDF Generation Architecture

The PDF generation is a robust, multi-step, server-side process designed for reliability.

1.  **Client-Side:** The user fills out the form in the Next.js frontend.
2.  **Server Action:** On submission, the form data is sent to the `generateScopeSheetPdf` server action (`src/ai/flows/generate-scope-sheet.ts`).
3.  **Genkit Tool Call:** The flow uses Genkit's `ai.run()` function to execute a Python script (`pdfsys/stamp_pdf.py`).
4.  **Bundling:** Next.js is configured via `next.config.ts` to bundle the Python script and all necessary assets (`satellite_base.pdf`, `coords.json.sample`) into the serverless function, ensuring they are available at runtime.
5.  **Python Stamping:** The Python script uses the `pypdf` library to read the master `satellite_base.pdf` template and `reportlab` to create a new, temporary PDF overlay. It draws the user's data (text and checkboxes) onto this overlay at precise coordinates defined in `coords.json.sample`.
6.  **Merge & Return:** The script merges the data overlay onto the master template and returns the final PDF as a base64-encoded string.
7.  **Download:** The server action sends the base64 string back to the client, where it's converted into a Blob and triggered as a file download.

This server-centric approach guarantees that the final PDF is a pixel-perfect match to the template, regardless of the user's browser or device.

## Project Structure

```
/
├── public/
│   └── satellite_base.pdf      # Master PDF template.
├── pdfsys/
│   ├── stamp_pdf.py            # The core Python script for PDF stamping.
│   ├── coords.json.sample      # Defines XY coordinates for all data points.
│   └── runner_diag.py          # Diagnostic script to check Python entrypoints.
├── scripts/
│   ├── diag/                   # Diagnostic scripts for path and wiring checks.
│   └── pdf-doctor.ts           # One-shot "doctor" to check the full PDF pipeline.
├── src/
│   ├── app/                    # Main application routes.
│   ├── ai/
│   │   ├── flows/              # Genkit flows for AI tasks.
│   │   └── preflight/          # Server boot preflight checks.
│   ├── lib/
│   │   └── schema/
│   │       └── scope-sheet.ts  # Zod schema for the scope sheet form.
├── tests/
│   └── pdf/                    # Vitest tests for flow wiring and contracts.
├── tests_py/
│   └── test_stamp_pdf.py       # Pytest tests for the Python script.
├── HOW_TO.md                     # User guide for the application.
├── FUNCTION_LIST.md              # Technical list of key functions.
├── PDF_SPEC.md                   # Specification for PDF generation.
├── DEBUG_OPS.md                  # Guide to debugging and operations.
└── TEST_MANUAL.md                # Manual testing plan.
```

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables. Create a `.env` file in the root and add your API key:
    ```
    GEMINI_API_KEY=your_google_api_key
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## Diagnostics & Testing

The project is equipped with a comprehensive suite for testing and diagnostics.

- **Run the Doctor Script:** To get a full health check of the PDF subsystem, run the one-shot doctor script:
  ```bash
  tsx scripts/pdf-doctor.ts
  ```

- **Run TypeScript Tests:** To run all TypeScript unit and integration tests with Vitest:
  ```bash
  npm test
  ```

- **Run Python Tests:** To run all Python tests with Pytest:
  ```bash
  npm run test:py
  ```

Refer to `DEBUG_OPS.md` for a complete guide on how to use these tools to troubleshoot issues.
