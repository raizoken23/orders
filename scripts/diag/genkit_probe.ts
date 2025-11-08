// Run: tsx scripts/diag/genkit_probe.ts
import path from "node:path";
import fs from "node:fs";
import { ai } from "@/ai/genkit";
import { generateScopeSheetPdf } from "@/ai/flows/generate-scope-sheet";


async function main() {
  const root = process.cwd();
  const file = path.join(root, "pdfsys", "stamp_pdf.py");
  const template = path.join(root, "public", "satellite_base.pdf");
  const coordsPath = path.join(root, "pdfsys", "coords.json.sample");

  console.log("probe.cwd", root);
  console.log("probe.file.exists", fs.existsSync(file));
  console.log("probe.template.exists", fs.existsSync(template));
  console.log("probe.coords.exists", fs.existsSync(coordsPath));

  try {
    const output  = await generateScopeSheetPdf({ "header.date": "2025-11-08" });
    console.log("ai.run.ok", Boolean(output && (output as any).pdfBase64));
  } catch (e: any) {
    console.error("ai.run.error", String(e));
    // Strong signals for the common failure
    console.error("hint.fn.expected", "run");
    console.error("hint.ensure", "export const runtime = 'nodejs' in server action");
  }
}
main();
