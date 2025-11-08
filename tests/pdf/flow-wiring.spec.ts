import { describe, it, expect, vi } from "vitest";

// mock ai.run so we only verify wiring
vi.mock("@/ai/genkit", () => ({
  ai: { run: vi.fn(async (args: any) => ({ output: { pdfBase64: "Zg==" }, args })) }
}));

import path from "node:path";
import fs from "node:fs";

// import your flow after the mock
import { generateScopeSheetPdf } from "../../src/ai/flows/generate-scope-sheet";

describe("generateScopeSheetPdf wiring", () => {
  it("calls ai.run with python runtime, correct file and fn", async () => {
    const data = { "header.date": "2025-11-08" };
    await generateScopeSheetPdf(data);

    const { ai } = await import("@/ai/genkit");
    const call = (ai.run as any).mock.calls[0][0];

    expect(call.runtime).toBe("python");
    expect(call.fn).toBe("run");
    expect(call.file.endsWith(path.join("pdfsys","stamp_pdf.py"))).toBe(true);

    const coords = path.join(process.cwd(), "pdfsys", "coords.json.sample");
    expect(fs.existsSync(coords)).toBe(true);
  });
});
