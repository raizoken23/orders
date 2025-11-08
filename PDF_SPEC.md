# PDF Generation Specification

This document outlines the technical specification for how PDF reports are generated in the ScopeSheet Pro application.

## 1. Core Strategy: Server-Side PDF Stamping

To ensure pixel-perfect consistency and reliability, the application does **not** generate the PDF in the user's browser. Instead, it uses a server-side stamping method.

1.  **Master Template**: The entire visual layout, including branding, static text, lines, and colored boxes, is defined in a master PDF template file located at `public/satellite_base.pdf`.
2.  **Data Submission**: When the user clicks "Download Report," the client-side form data (validated against a Zod schema) is sent to a server-side Genkit flow.
3.  **Stamping Flow**: The `generateScopeSheetPdf` flow (`src/ai/flows/generate-scope-sheet.ts`) receives the data.
4.  **Python Execution**: This flow uses Genkit's `ai.run()` tool to execute a Python script. This script leverages the `pypdf` and `reportlab` libraries.
5.  **Overlay Creation**: The Python script creates a new, temporary PDF overlay in memory. All the dynamic data from the form (e.g., Claim Number, Client Name, checkbox statuses) is drawn as text or symbols (like an 'X' for checkboxes) at precise inch-based coordinates on this overlay.
6.  **Merging**: The script then merges the data overlay on top of the master `satellite_base.pdf` template.
7.  **Return and Download**: The final, merged PDF is returned to the client as a base64-encoded string. The client-side code then decodes this string into a Blob and triggers a browser download.

This approach guarantees that the final output is always an exact match to the master template, with the user's data perfectly placed.

## 2. Coordinate System

The Python stamping script uses an inch-based coordinate system, with the origin `(0, 0)` at the **bottom-left corner** of the US Letter (8.5" x 11") page.

- All text `(x, y)` placements are defined in inches.
- All checkbox `(x, y)` placements are defined in inches.

## 3. Data-to-PDF Mapping

The following outlines how form data is represented on the PDF:

- **Text Fields**: Data from text inputs (e.g., `claimNumber`, `clientName`) is drawn as plain text strings at their specified coordinates.
- **Checkbox Fields**:
    - The application uses multi-select checkboxes for fields like `shingleType` and `iceWaterShield`.
    - The Python script iterates through the array of selected values (e.g., `['Laminate', '30 Y']`).
    - For each selected value, an 'X' is drawn inside the corresponding box on the PDF template at its pre-defined coordinates.
- **Radio Buttons**: Values from radio groups (e.g., `dripEdgeRadio`) are checked, and an 'X' is drawn in the box for the selected option (e.g., "Yes" or "No").

## 4. Key Function: `generateScopeSheetPdf`

- **File**: `src/ai/flows/generate-scope-sheet.ts`
- **Input**: `data: z.infer<typeof scopeSheetSchema>` - A JSON object containing all the form data.
- **Output**: An object `{ pdfBase64: string }` containing the base64-encoded final PDF.
- **Dependencies (for the Python script)**:
    - `pypdf`: For reading the base template and merging the overlay.
    - `reportlab`: For creating the overlay canvas and drawing text/shapes.

This server-centric architecture ensures that the complex task of PDF creation is handled in a robust, controlled environment, delivering a consistent, high-quality result to the end-user.
