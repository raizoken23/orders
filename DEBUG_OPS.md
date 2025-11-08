# Debugging & Operations Guide

This document outlines the diagnostic tools and procedures for troubleshooting the ScopeSheet Pro application, with a focus on the PDF generation subsystem.

## 1. Core Philosophy: Fail Fast, Clear Signals

The system is designed to identify failures as early as possible.
- **Preflight Check:** On server boot, a preflight check (`pdfPreflight`) validates the Python environment and entrypoint. If this fails, the server will not start, preventing runtime errors for users.
- **Structured Errors:** The PDF generation flow returns structured JSON errors, which are displayed in a diagnostic dialog on the frontend. This provides immediate, actionable feedback.

## 2. The One-Shot "Doctor" Script

The most important diagnostic tool is the `pdf-doctor.ts` script. It runs a sequence of checks to validate the entire PDF generation chain from end to end.

**How to Run:**
```bash
tsx scripts/pdf-doctor.ts
```

**What it Checks:**
1.  **File Paths:** Verifies that the Python script (`stamp_pdf.py`), the PDF template (`satellite_base.pdf`), and the coordinates file (`coords.json.sample`) all exist at their expected locations.
2.  **Python Entrypoint:** Executes the `runner_diag.py` script to confirm that the `stamp_pdf.py` module can be imported and that it correctly exports a `run` function.
3.  **Genkit `ai.run` Call:** Performs a dry run of the `ai.run()` command to ensure Genkit can successfully invoke the Python script and receive a valid response.
4.  **PDF Output:** Checks that the `pdfBase64` string returned by the script starts with `JVBERi0=`, the Base64 encoding for `%PDF-`.

**How to Interpret Results:**
- If any step fails, the script will exit with a non-zero status code and print a detailed JSON report.
- The first failing step in the report is the root cause. For example, if `py_export` is `false`, the problem is in the Python script's exports. If `ai.run` is `false`, the issue is in the Genkit wiring or Next.js bundling.

---

## 3. Manual Diagnostic Steps

If the doctor script doesn't pinpoint the issue, you can run the probes individually.

### Step A: Path & Runtime Sanity Check

This script confirms that your file paths are resolving correctly from the current working directory and that the Node.js environment is not running in an Edge runtime.

**Run:** `tsx scripts/diag/paths.ts`
**Success:** Prints a JSON object with absolute paths to all critical files.
**Failure:** Incorrect paths indicate a problem with the file structure or the working directory.

### Step B: Python Entrypoint Check

This directly tests the Python script's interface.

**Run:** `python3 pdfsys/runner_diag.py pdfsys/stamp_pdf.py run`
**Success:** Prints `{"ok": true, ...}`.
**Failure:** Prints `{"ok": false, ...}`. This means `stamp_pdf.py` is missing `def run(event):` or has a syntax error preventing it from being imported.

### Step C: Genkit Wiring Probe

This tests the `ai.run` call in isolation.

**Run:** `tsx scripts/diag/genkit_probe.ts`
**Success:** Prints `ai.run.ok true`.
**Failure:** An error message like "unable to resolve run function" points to a problem with Next.js's bundling (`outputFileTracingIncludes` in `next.config.ts`) or Genkit's ability to find the Python function.

---

## 4. Frontend Diagnostic Dialog

When a PDF generation fails in the app, a "Backend Diagnostic Report" dialog will appear. This dialog contains three key pieces of information:

1.  **AI Analysis & Fix:** An AI-powered diagnosis of the error with a suggested solution.
2.  **Operational Trace (stdout):** The standard output from the Python script.
3.  **Raw Error (stderr):** The standard error, including any Python tracebacks.

Always check `stderr` first, as it usually contains the specific Python error that caused the failure.

---

## 5. Golden File Regression Testing

The project includes a Pytest suite (`tests_py/`) that can be extended for visual regression testing. The `pdfsys/audit_compare.py` script can compare two PDFs and generate a visual diff and a JSON report of pixel and structural differences. This is useful for CI environments to automatically catch unintended changes to the PDF output.
