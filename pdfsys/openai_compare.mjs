// node openai_compare.mjs master.png candidate.png report.json
import fs from "node:fs";
import OpenAI from "openai";

const [,, masterPng, candidatePng, reportJson] = process.argv;
if (!masterPng || !candidatePng) {
  console.error("usage: node openai_compare.mjs <master.png> <candidate.png> [report.json]");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function toDataURL(p) {
  const b64 = fs.readFileSync(p).toString("base64");
  return `data:image/png;base64,${b64}`;
}

const system = `You are a precise print QA assistant.
Compare two images of a scope-sheet PDF page.
Flag differences in: placement, rule weights, colors, typography, icons, and grid alignment.
Return strict JSON with fields: summary, issues[], severity("pass"|"warn"|"fail").`;

const user = [
  { type: "input_text", text: "Master (ground truth) on the left, Candidate on the right." },
  { type: "input_image", image_url: toDataURL(masterPng) },
  { type: "input_image", image_url: toDataURL(candidatePng) }
];

const resp = await client.responses.create({
  model: "gpt-4o-mini",
  input: [
    { role: "system", content: [{ type:"input_text", text: system }]},
    { role: "user", content: user }
  ],
  max_output_tokens: 800,
  response_mime_type: "application/json"
});

const out = resp.output_text || "{}";
console.log(out);
if (reportJson) fs.writeFileSync(reportJson, out);
