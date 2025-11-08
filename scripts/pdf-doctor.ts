
// Run with: tsx scripts/pdf-doctor.ts
import fs from "node:fs";
import path from "node:path";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const ai = genkit({
    plugins: [googleAI()],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});

const root = process.cwd();
const file = path.join(root,"pdfsys","stamp_pdf.py");
const template = path.join(root,"public","satellite_base.pdf");
const coordsPath = path.join(root,"pdfsys","coords.json.sample");

(async () => {
  const report:any = { cwd:root, file, template, coordsPath, steps:[] };

  console.log("🩺 Running PDF Doctor...");

  // 1. paths
  const pathsOk = fs.existsSync(file)&&fs.existsSync(template)&&fs.existsSync(coordsPath);
  report.steps.push({ step:"paths", ok: pathsOk, details: { file, template, coordsPath } });
  console.log(`[1/3] Path check... ${pathsOk ? '✅' : '❌'}`);


  // 2. python export check
  const diag = require("child_process").spawnSync("python3", ["pdfsys/runner_diag.py", file, "run"], { encoding:"utf8" });
  const pyExportOk = diag.status===0;
  report.steps.push({ step:"py_export", ok: pyExportOk, out: diag.stdout || diag.stderr });
  console.log(`[2/3] Python entrypoint check... ${pyExportOk ? '✅' : '❌'}`);


  // 3. ai.run dry call
  let aiRunOk = false;
  try {
    const coords = JSON.parse(fs.readFileSync(coordsPath,"utf8"));
    const { output } = await ai.run({ runtime:"python", file, fn:"run", input:{ template, coords, payload:{ "claimNumber": "DOCTOR-TEST" } }});
    aiRunOk = !!(output && (output as any).pdfBase64 && (output as any).pdfBase64.startsWith("JVBERi0"));
    report.steps.push({ step:"ai.run", ok:aiRunOk, shape:Object.keys(output||{}) });
  } catch (e:any) {
    report.steps.push({ step:"ai.run", ok:false, err:String(e) });
  }
  console.log(`[3/3] Genkit ai.run check... ${aiRunOk ? '✅' : '❌'}`);


  console.log("\n📋 Full Report:");
  console.log(JSON.stringify(report,null,2));
  
  const allOk = report.steps.every((s:any)=>s.ok);
  console.log(`\n${allOk ? '✅ All checks passed!' : '❌ Some checks failed.'}`);
  
  process.exit(allOk ? 0 : 2);
})();
