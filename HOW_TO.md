# How to Use ScopeSheet Pro

This guide provides a step-by-step walkthrough of the main features of the ScopeSheet Pro application.

## 1. Starting a New Inspection (AI Data Extraction)

The fastest way to start a new scope sheet is by letting the AI extract information from an existing claim document.

1.  **Navigate to "New Sheet"**: From the main dashboard or the sidebar, click on "New Sheet".
2.  **Upload Your Document**: You will be prompted to upload an image (e.g., a screenshot or photo) of your claim document.
3.  **AI Extraction**: Click the "Extract Information" button. The app will send the image to the AI, which will analyze it and identify key details like the Claim Number, Policy Number, Client Name, Property Address, etc.
4.  **Verify and Proceed**: The extracted information will be displayed on the right. Review it for accuracy. If everything looks correct, click "Create Scope Sheet with this Data".
5.  **Pre-filled Form**: You will be taken to the Scope Sheet page with all the extracted information automatically filled into the correct fields.

## 2. Filling Out the Digital Scope Sheet

The Scope Sheet is the core of the application. It's a comprehensive form designed to capture all necessary details of a property inspection.

- **Sections**: The form is organized into logical cards:
    - `Claim & Property`: Basic information about the claim and client.
    - `Roof & Shingle Information`: Details about the roofing materials.
    - `Calculations & Measurements`: Fields for roof calculations and measurements.
    - `Accessories & Damage`: A detailed checklist for roof accessories like vents, pipes, and gutters.
    - `Notes and Key`: A section for free-text notes and reference keys.
- **Input Fields**: The form uses a variety of inputs, including text fields, checkboxes for multiple selections (e.g., Shingle Type), and radio buttons for single selections (e.g., Drip Edge Yes/No).
- **Auto-Save**: The form is designed to hold its state, but be sure to complete your work before closing the browser tab.

## 3. Generating a PDF Report

Once you have filled out the scope sheet, you can generate a professional, print-perfect PDF report.

1.  **Click "Download Report"**: This button is located at the top of the Scope Sheet page.
2.  **Server-Side Generation**: The application sends all the form data to a secure, server-side Genkit flow.
3.  **PDF Stamping**: The server takes the master PDF template (`satellite_base.pdf`) and programmatically "stamps" your data onto it in the correct positions. This includes filling in text fields and marking checkboxes.
4.  **Automatic Download**: The completed PDF is sent back to your browser and a download will automatically begin. The file will be named based on the claim number (e.g., `ScopeSheet-CLM-12345.pdf`).

The resulting PDF is a high-fidelity, professional document ready to be shared or printed.

## 4. Using the AI Image Analysis

The "Image Analysis" tool helps you identify potential issues on a roof.

1.  **Navigate to "Image Analysis"**: Select this option from the sidebar.
2.  **Upload a Roof Image**: You can upload a picture from your device or select one of the provided examples.
3.  **Analyze Image**: Click the "Analyze Image" button. The AI will process the photo.
4.  **View Report**: The AI's findings, including potential damage, wear, or other concerns, will be displayed in the "AI Analysis Report" card.

## 5. Changing the AI Model (Settings)

You can switch between Google Gemini and OpenAI for the app's generative AI features.

1.  **Navigate to "Settings"**: Click the "Settings" link in the sidebar.
2.  **Find the AI Provider Section**: Locate the card titled "AI Provider".
3.  **Toggle the Provider**: Use the switch to toggle between "Gemini" and "OpenAI".
4.  **Enter API Key**: If you select "OpenAI", you must enter your OpenAI API Key into the provided input field. This key is saved securely in your browser's local storage and is not transmitted anywhere else.
5.  **Save Settings**: The setting is saved automatically. The application will now use the selected model for all generative AI tasks.
