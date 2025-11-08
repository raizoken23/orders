import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("coords.json contract", () => {
  it("exists and has meta + sections", () => {
    const p = path.join(process.cwd(), "pdfsys", "coords.json.sample");
    expect(fs.existsSync(p)).toBe(true);
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    expect(j).toHaveProperty("text");
    expect(j).toHaveProperty("checks");
  });
});
