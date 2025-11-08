
import { spawnSync } from "node:child_process";
import path from "node:path";

export function pdfPreflight() {
    console.log("[PDF Preflight] Running PDF subsystem preflight check...");
    const scriptPath = path.join(process.cwd(), "pdfsys", "runner_diag.py");
    const targetPath = path.join(process.cwd(), "pdfsys", "stamp_pdf.py");

    const r = spawnSync("python3", [scriptPath, targetPath, "run"], { encoding: "utf8" });

    if (r.status !== 0 || r.stderr) {
        console.error("[PDF Preflight] Preflight check FAILED.");
        console.error(`[PDF Preflight] STDOUT: ${r.stdout}`);
        console.error(`[PDF Preflight] STDERR: ${r.stderr}`);
        // In a real scenario, you might want to throw to prevent startup,
        // but for a dev environment, logging is safer.
        throw new Error(`PDF_PREFLIGHT_FAIL: ${r.stdout || r.stderr}`);
    } else {
        const result = JSON.parse(r.stdout);
        if (result.ok) {
            console.log("[PDF Preflight] PDF subsystem check PASSED. 'run' entrypoint is available.");
        } else {
            console.error("[PDF Preflight] Preflight check FAILED. 'run' entrypoint not found or script is invalid.");
            console.error(`[PDF Preflight] Details: ${JSON.stringify(result, null, 2)}`);
            throw new Error("PDF_PREFLIGHT_FAIL: 'run' entrypoint not found in Python script.");
        }
    }
}
