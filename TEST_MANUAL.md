# Manual Test Plan

This document provides a set of manual test cases to verify the core functionality of ScopeSheet Pro.

## Test Case 1: Generate a Demo PDF Report

**Objective:** Verify that a user can generate and download a pre-filled PDF scope sheet using the "Demo" feature.

**Steps:**

1.  **Navigate to the App:** Open the application in your browser. You should be on the Dashboard page.
2.  **Go to New Sheet:** In the sidebar, click on the **"New Sheet"** menu item.
3.  **Start Demo:** On the "Start a New Inspection" page, click the large **"Start Demo Inspection"** button.
4.  **Verify Pre-filled Form:** You should be redirected to the "Digital Scope Sheet" page. Verify that the form fields (e.g., Claim Number, Client Name, Roof Info) are automatically populated with sample data.
5.  **Initiate Download:** At the top of the page, click the **"Download Report"** button.
6.  **Check for Download:** The button should show a "Generating..." state. After a few moments, a file download should start in your browser.
7.  **Verify PDF:** Open the downloaded PDF file.
    - The file name should be `ScopeSheet-CLM-12345.pdf`.
    - Open the file and visually inspect it. It should be the branded `satellite_base.pdf` template.
    - Confirm that the sample data (e.g., "John Doe", "123 Main St", "Laminate" shingle type) is correctly stamped onto the PDF in the appropriate fields.
    - Check that checkboxes for items like "Laminate" and "Eave" are marked with an 'X'.

**Expected Result:** A correctly formatted and populated PDF is successfully downloaded and can be opened without errors.

---

## Test Case 2: AI Roof Image Analysis

**Objective:** Verify that the AI Image Analysis tool can process an image and return a coherent analysis.

**Steps:**

1.  **Navigate to Image Analysis:** In the sidebar, click on **"Image Analysis"**.
2.  **Select Example Image:** On the "Upload Image" card, click on one of the three example roof images.
3.  **Run Analysis:** The selected image should appear in the preview area. Click the **"Analyze Image"** button.
4.  **Verify Loading State:** The button should change to "Analyzing...", and the "AI Analysis Report" card on the right should display a loading skeleton UI.
5.  **Check for Results:** After processing, the "AI Analysis Report" card should update to show a text-based description of potential issues detected in the image (e.g., "damaged shingles," "wear and tear," etc.).

**Expected Result:** The AI successfully analyzes the image and displays a relevant textual report.

---

## Test Case 3: Settings and AI Provider Toggle

**Objective:** Verify that the AI provider can be switched in the settings and that the setting persists.

**Steps:**

1.  **Navigate to Settings:** In the sidebar, click on **"Settings"**.
2.  **Switch to OpenAI:** In the "AI Provider" card, click the switch to toggle from "Google Gemini" to "OpenAI".
3.  **Verify UI Change:** An input field for the "OpenAI API Key" should appear.
4.  **Enter Key:** Type a dummy key (e.g., "TEST_KEY") into the input field.
5.  **Refresh Page:** Reload the browser page.
6.  **Verify Persistence:**
    - The switch should still be set to "OpenAI".
    - The input field should still contain "TEST_KEY".
7.  **Switch Back:** Toggle the switch back to "Google Gemini". The API key field should disappear. Refresh the page again and verify it has remained on "Gemini".

**Expected Result:** The selected AI provider and the entered API key (for OpenAI) are correctly saved to local storage and persist across page loads.
