# ScopeSheet Pro

ScopeSheet Pro is a Next.js web application designed for insurance inspectors to digitize and streamline the process of creating property inspection scope sheets. It leverages AI to extract claim information from documents, analyze roof damage from images, and generate print-perfect PDF reports based on a standardized template.

This project was built in Firebase Studio.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [AI Functionality](#ai-functionality)
- [PDF Generation](#pdf-generation)

## Features

- **Digital Scope Sheet:** A comprehensive web form to input all details of a property inspection.
- **AI-Powered Claim Import:** Upload a screenshot of a claim document, and the app's AI will automatically extract key information like claim number, client name, and address.
- **AI Image Analysis:** Upload photos of a roof, and the AI will analyze them for potential damage, wear, and structural issues.
- **Pixel-Perfect PDF Generation:** Generates a professional, downloadable PDF scope sheet by stamping the collected data onto a master PDF template, ensuring perfect formatting every time.
- **Switchable AI Providers:** Users can choose between Google Gemini and OpenAI models for generative AI tasks by providing their own API key.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Backend:** [Genkit](https://firebase.google.com/docs/genkit)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **PDF Generation:** [pdf-lib](https://pdf-lib.js.org/) (server-side stamping via Genkit)

## Project Structure

A brief overview of the key directories and files:

```
/
├── public/
│   └── satellite_base.pdf      # The master PDF template.
├── src/
│   ├── app/
│   │   ├── (app)/                # Main application routes (dashboard, scope-sheet, etc.).
│   │   └── layout.tsx            # Root layout.
│   ├── ai/
│   │   ├── flows/                # Genkit flows for AI tasks.
│   │   └── genkit.ts             # Genkit plugin configuration.
│   ├── components/
│   │   ├── ui/                   # ShadCN UI components.
│   │   └── app-sidebar.tsx       # Main navigation sidebar.
│   ├── hooks/
│   │   └── use-toast.ts          # Toast notification hook.
│   ├── lib/
│   │   ├── schema/
│   │   │   └── scope-sheet.ts    # Zod schema for the scope sheet form.
│   │   └── placeholder-images.ts # Placeholder image data.
├── HOW_TO.md                     # User guide for the application.
├── FUNCTION_LIST.md              # Technical list of key functions.
└── PDF_SPEC.md                   # Specification for PDF generation.
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add your API keys:
    ```
    GEMINI_API_KEY=your_google_api_key
    # OPENAI_API_KEY=your_openai_api_key (Optional, if you want to use the OpenAI toggle)
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## Usage

1.  **Navigate to "New Sheet"**: Start by uploading a claim document to have the AI pre-fill the form.
2.  **Fill out the Scope Sheet**: Complete or edit the details in the digital scope sheet form. The form is divided into sections like "Claim & Property," "Roof & Shingle," and "Accessories."
3.  **Generate Report**: Click the "Download Report" button. This will send the form data to a server-side Genkit flow.
4.  **Download PDF**: The server will stamp the data onto the master `satellite_base.pdf` template and return the completed PDF to your browser for download.

## AI Functionality

The application's AI capabilities are powered by Genkit flows defined in `src/ai/flows/`.

- **`extract-claim-information.ts`**: Takes an image of a document and returns structured data (claim number, policy number, etc.).
- **`analyze-roof-image-for-issues.ts`**: Takes an image of a roof and returns a text description of detected damage.
- **`generate-scope-sheet.ts`**: This is the core of the PDF generation. It takes the complete form data and uses a Python script to stamp it onto the master PDF template.

## PDF Generation

The PDF generation is handled by a server-side Genkit flow to ensure consistency and reliability.

- **Template**: The visual layout is defined by `public/satellite_base.pdf`.
- **Logic**: The `generateScopeSheetPdf` flow in `src/ai/flows/generate-scope-sheet.ts` receives the form data.
- **Stamping**: The flow executes a Python script using Genkit's code execution tool (`ai.run`). This script uses the `pypdf` and `reportlab` libraries to create an overlay with the form data and merge it onto the base template.
- **Output**: The final, merged PDF is returned to the client as a base64-encoded string, which is then downloaded by the browser.

This server-side approach guarantees that the final PDF is a pixel-perfect match to the template, regardless of the user's browser or device.
