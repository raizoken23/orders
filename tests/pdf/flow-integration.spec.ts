import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import { generateScopeSheetPdf } from "../../src/ai/flows/generate-scope-sheet";

describe("PDF e2e stub", () => {
  it("returns a decodable PDF base64", async () => {
    const out = await generateScopeSheetPdf({ "header.date": "2025-11-08" });
    expect(out.pdfBase64).toBeDefined();
    const buf = Buffer.from(out.pdfBase64, "base64");
    // PDF header check
    expect(buf.slice(0, 5).toString()).toBe("%PDF-");
    const outPath = path.join(process.cwd(), "out.pdf");
    fs.writeFileSync(outPath, buf);
    expect(fs.existsSync(outPath)).toBe(true);
  }, 30000); // 30-second timeout for potentially slow python execution
});
