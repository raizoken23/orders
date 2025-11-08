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

  if (!fs.existsSync(file)) throw new Error(`PY_FILE_NOT_FOUND: ${file} missing`);
  if (!fs.existsSync(template)) throw new Error(`TEMPLATE_NOT_FOUND: ${template} missing`);
  if (!fs.existsSync(coordsPath)) throw new Error(`COORDS_NOT_FOUND: ${coordsPath} missing`);

  const coords = JSON.parse(fs.readFileSync(coordsPath, "utf8"));

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
    console.error("PY_BAD_OUTPUT_ERROR", { error: parsed.error, received: output });
    throw new Error(`PY_BAD_OUTPUT: Python script returned an invalid format.`);
  }
  return parsed.data;
}
