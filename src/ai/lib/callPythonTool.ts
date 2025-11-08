
import path from "node:path";
import fs from "node:fs";
import { z } from "zod";
import { ai } from "@/ai/genkit";

export const PdfResult = z.union([
  z.object({ pdfBase64: z.string().min(20) }),
  z.object({ error: z.object({
    code: z.string(), message: z.string(), detail: z.string().optional().nullable()
  }) })
]);

export async function callPythonTool(payload: any) {
  const root = process.cwd();
  const file = path.join(root, "pdfsys", "stamp_pdf.py");
  const template = path.join(root, "public", "satellite_base.pdf");
  const coordsPath = path.join(root, "pdfsys", "coords.json.sample");

  if (!fs.existsSync(file)) throw new Error("PY_FILE_NOT_FOUND: pdfsys/stamp_pdf.py missing");
  if (!fs.existsSync(template)) throw new Error("TEMPLATE_NOT_FOUND: public/satellite_base.pdf missing");
  if (!fs.existsSync(coordsPath)) throw new Error("COORDS_NOT_FOUND: pdfsys/coords.json.sample missing");

  const coords = JSON.parse(fs.readFileSync(coordsPath, "utf8"));

  // This is the critical fix: specifying `fn: "run"` tells Genkit which function to execute.
  const { output, error } = await ai.run({
    runtime: "python",
    file,
    fn: "run",
    input: { template, coords, payload }
  });

  if (error) {
    throw error;
  }

  const parsed = PdfResult.safeParse(output);
  if (!parsed.success) {
    console.error("PY_BAD_OUTPUT_ERROR", parsed.error);
    throw new Error(`PY_BAD_OUTPUT: Python script returned an invalid format. Raw: ${JSON.stringify(output)}`);
  }
  return parsed.data;
}
