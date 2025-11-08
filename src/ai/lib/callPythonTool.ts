'use server';

import path from "node:path";
import fs from "node:fs";
import { ai } from "@/ai/genkit-server";

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
  
  return output;
}
