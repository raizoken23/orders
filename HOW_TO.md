# How to Use ScopeSheet Pro

This guide provides a step-by-step walkthrough of the main features of the ScopeSheet Pro application.

## 1. Starting a New Inspection (Demo Mode)

The fastest way to see the application's capabilities is to generate a demonstration scope sheet.

1.  **Navigate to "New Sheet"**: From the main dashboard or the sidebar, click on **"New Sheet"**.
2.  **Start the Demo**: You will see a page for "Demonstration Mode". Click the **"Start Demo Inspection"** button.
3.  **View the Pre-filled Form**: You will be taken directly to the Scope Sheet page, which will be automatically populated with a complete set of sample data, including client details, roof measurements, and accessory information.

## 2. Filling Out the Digital Scope Sheet

The Scope Sheet is the core of the application. It's a comprehensive form designed to capture all necessary details of a property inspection.

- **Sections**: The form is organized into logical cards like `Claim & Property`, `Roof & Shingle Information`, and `Accessories & Damage`.
- **Input Fields**: The form uses a variety of inputs, including text fields, checkboxes, and radio buttons.
- **Auto-Save**: The form is designed to hold its state, but be sure to complete your work before closing the browser tab.

## 3. Generating a PDF Report

Once the scope sheet is filled out (or after starting the demo), you can generate a professional, print-perfect PDF report.

1.  **Click "Download Report"**: This button is located at the top right of the Scope Sheet page.
2.  **Server-Side Generation**: The application sends all the form data to a secure, server-side Genkit flow.
3.  **PDF Stamping**: The server takes the master PDF template (`satellite_base.pdf`) and programmatically "stamps" your data onto it in the correct positions.
4.  **Automatic Download**: The completed PDF is sent back to your browser and a download will automatically begin. The file will be named based on the claim number (e.g., `ScopeSheet-CLM-12345.pdf`).

The resulting PDF is a high-fidelity, professional document ready to be shared or printed.

## 4. Using the AI Image Analysis

The "Image Analysis" tool helps you identify potential issues on a roof.

1.  **Navigate to "Image Analysis"**: Select this option from the sidebar.
2.  **Upload or Select Image**: You can upload a picture from your device or, for a quick test, click one of the provided example images.
3.  **Analyze Image**: Click the **"Analyze Image"** button. The AI will process the photo.
4.  **View Report**: The AI's findings, including potential damage or wear, will be displayed in the "AI Analysis Report" card on the right.

## 5. Changing the AI Model (Settings)

You can switch between Google Gemini and OpenAI for the app's generative AI features.

1.  **Navigate to "Settings"**: Click the "Settings" link in the sidebar.
2.  **Toggle the Provider**: Use the switch to toggle between "Gemini" and "OpenAI".
3.  **Enter API Key (if applicable)**: If you select "OpenAI", you must enter your OpenAI API Key into the provided input field. This key is saved securely in your browser's local storage.
4.  **Save Settings**: The setting is saved automatically.
