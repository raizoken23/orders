// Run: tsx scripts/diag/paths.ts
import path from "node:path";
console.log({
  node: process.versions.node,
  cwd: process.cwd(),
  isEdge: process.env.NEXT_RUNTIME === "edge",
  stampPy: path.join(process.cwd(), "pdfsys", "stamp_pdf.py"),
  template: path.join(process.cwd(), "public", "satellite_base.pdf"),
  coords: path.join(process.cwd(), "pdfsys", "coords.json.sample")
});
