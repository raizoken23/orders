'use server';
/**
 * @fileOverview A flow that generates a PDF scope sheet by stamping form data onto a template.
 *
 * - generateScopeSheet - The function that handles the PDF generation.
 * - scopeSheetSchema - The Zod schema for the form data input.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const scopeSheetSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required.'),
  policyNumber: z.string().min(1, 'Policy number is required.'),
  clientName: z.string().min(1, 'Client name is required.'),
  clientEmail: z.string().email('Invalid email address.'),
  clientPhone: z.string().min(1, 'Phone number is required.'),
  propertyAddress: z.string().min(1, 'Property address is required.'),
  dateOfLoss: z.string().min(1, 'Date of loss is required.'),
  hailF: z.string().optional(),
  hailR: z.string().optional(),
  hailB: z.string().optional(),
  hailL: z.string().optional(),
  windF: z.string().optional(),
  windR: z.string().optional(),
  windB: z.string().optional(),
  windL: z.string().optional(),
  treeF: z.string().optional(),
  treeR: z.string().optional(),
  treeB: z.string().optional(),
  treeL: z.string().optional(),
  windDate: z.string().optional(),
  ladderNow: z.boolean().optional(),
  inspector: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  eaveLF: z.string().optional(),
  eaveNA: z.boolean().optional(),
  shingleType: z.array(z.string()).optional(),
  otherShingle: z.string().optional(),
  iceWaterShield: z.array(z.string()).optional(),
  dripEdge: z.array(z.string()).optional(),
  dripEdgeRadio: z.string().optional(),
  layers: z.string().optional(),
  pitch: z.string().optional(),
  valleyMetalLF: z.string().optional(),
  valleyMetalNA: z.boolean().optional(),
  shingleMake: z.array(z.string()).optional(),
  calcA: z.string().optional(),
  calcB: z.string().optional(),
  calcC: z.string().optional(),
  calcD: z.string().optional(),
  calcE: z.string().optional(),
  calcF: z.string().optional(),
  calcG: z.string().optional(),
  calcH: z.string().optional(),
  calcK: z.string().optional(),
  calcL: z.string().optional(),
  calcM: z.string().optional(),
  calcI: z.string().optional(),
  calcJ: z.string().optional(),
  rakeLF: z.string().optional(),
  rakeNA: z.boolean().optional(),
  totalSquares: z.string().optional(),
  aerialMeasurements1Story: z.boolean().optional(),
  aerialMeasurements2Story: z.boolean().optional(),
  yesNoEaveRake: z.string().optional(),
  turbineQtyLead: z.string().optional(),
  turbineQtyPlastic: z.string().optional(),
  hvacventQtyLead: z.string().optional(),
  hvacventQtyPlastic: z.string().optional(),
  raindiverterQtyLead: z.string().optional(),
  raindiverterQtyPlastic: z.string().optional(),
  powerVentQtyLead: z.string().optional(),
  powerVentQtyPlastic: z.string().optional(),
  skylightQtyLead: z.string().optional(),
  skylightQtyPlastic: z.string().optional(),
  satQtyLead: z.string().optional(),
  satQtyPlastic: z.string().optional(),
  pipeQty: z.string().optional(),
  pipeLead: z.boolean().optional(),
  pipePlastic: z.boolean().optional(),
  guttersLF: z.string().optional(),
  guttersNA: z.boolean().optional(),
  guttersSize: z.string().optional(),
  downspoutsLF: z.string().optional(),
  downspoutsSize: z.string().optional(),
  fasciaSize: z.string().optional(),
  fasciaLF: z.string().optional(),
  fasciaNA: z.boolean().optional(),
  fasciaType: z.string().optional(),
  chimneyFlashing: z.string().optional(),
  chimneyOther: z.string().optional(),
  maxHailDiameter: z.string().optional(),
  stormDirection: z.string().optional(),
  collateralDamage: z.string().optional(),
  notes: z.string().optional(),
  boxVentsQtyLead: z.string().optional(),
  boxVentsQtyPlastic: z.string().optional(),
  boxVentsMetal: z.boolean().optional(),
  boxVentsPlastic: z.boolean().optional(),
  boxVentsMetalDamaged: z.boolean().optional(),
  ridgeVentMetalDamaged: z.boolean().optional(),
  ridgeVentLF: z.string().optional(),
  ridgeVentPlastic: z.boolean().optional(),
  otherSolar: z.boolean().optional(),
  otherVentE: z.boolean().optional(),
  otherExhaustVent: z.boolean().optional(),
  woodMetal: z.string().optional(),
});

export type ScopeSheetData = z.infer<typeof scopeSheetSchema>;

const stampPdfTool = ai.defineTool(
    {
      name: 'stampPdf',
      description: 'Stamps data onto a PDF template.',
      inputSchema: scopeSheetSchema,
      outputSchema: z.object({
        pdfBase64: z.string(),
      }),
    },
    async (data) => {
      const code = `
import io
import json
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import black
import base64

data_str = '''${JSON.stringify(data)}'''
data = json.loads(data_str)

def draw_text(c, x_in, y_in, text, size=10, align="left"):
    if not text: return
    c.setFont("Helvetica", size)
    x = x_in * inch
    y = y_in * inch
    if align == "center":
        c.drawCentredString(x, y, text)
    elif align == "right":
        c.drawRightString(x, y, text)
    else:
        c.drawString(x, y, text)

def draw_checkbox(c, x_in, y_in, checked=False, size_in=0.12, line_w=1):
    x = x_in * inch
    y = y_in * inch
    s = size_in * inch
    c.setLineWidth(line_w)
    c.rect(x, y, s, s, stroke=1, fill=0)
    if checked:
        c.line(x + 2, y + 2, x + s - 2, y + s - 2)
        c.line(x + s - 2, y + 2, x + 2, y + s - 2)

def draw_fn(c):
    # Header
    draw_text(c, 6.85, 10.4, data.get("windDate", ""), size=11)
    draw_text(c, 6.85, 9.7, data.get("inspector", ""), size=11)
    draw_text(c, 6.85, 9.35, data.get("phone", ""), size=11)
    draw_text(c, 6.85, 9.0, data.get("email", ""), size=11)

    # Damage Matrix
    draw_text(c, 7.3, 10.15, data.get("hailF", ""), size=11, align="center")
    draw_text(c, 8.1, 10.15, data.get("windF", ""), size=11, align="center")
    draw_text(c, 8.9, 10.15, data.get("treeF", ""), size=11, align="center")
    
    draw_text(c, 7.3, 9.80, data.get("hailR", ""), size=11, align="center")
    draw_text(c, 8.1, 9.80, data.get("windR", ""), size=11, align="center")
    draw_text(c, 8.9, 9.80, data.get("treeR", ""), size=11, align="center")

    draw_text(c, 7.3, 9.45, data.get("hailB", ""), size=11, align="center")
    draw_text(c, 8.1, 9.45, data.get("windB", ""), size=11, align="center")
    draw_text(c, 8.9, 9.45, data.get("treeB", ""), size=11, align="center")

    draw_text(c, 7.3, 9.10, data.get("hailL", ""), size=11, align="center")
    draw_text(c, 8.1, 9.10, data.get("windL", ""), size=11, align="center")
    draw_text(c, 8.9, 9.10, data.get("treeL", ""), size=11, align="center")

    # Shingles, Ice/Water, Drip Edge
    shingle_type = data.get("shingleType", [])
    draw_checkbox(c, 0.65, 8.2, '3 Tab' in shingle_type)
    draw_checkbox(c, 1.45, 8.2, 'Laminate' in shingle_type)
    shingle_make = data.get("shingleMake", [])
    draw_checkbox(c, 2.45, 8.4, '20 Y' in shingle_make)
    draw_checkbox(c, 2.45, 8.2, '25 Y' in shingle_make)
    draw_checkbox(c, 2.45, 8.0, '30 Y' in shingle_make)
    draw_checkbox(c, 3.25, 8.4, '40 Y' in shingle_make)
    draw_checkbox(c, 3.25, 8.2, '50 Y' in shingle_make)
    draw_text(c, 4.3, 8.05, data.get("otherShingle", ""), size=10)

    ice_water_shield = data.get("iceWaterShield", [])
    draw_checkbox(c, 0.65, 7.7, 'Valley' in ice_water_shield)
    draw_checkbox(c, 1.45, 7.7, 'Eave' in ice_water_shield)
    draw_checkbox(c, 0.65, 7.5, 'Rake' in ice_water_shield)
    draw_text(c, 2.7, 7.7, data.get("valleyMetalLF", ""), size=10)
    
    drip_edge_radio = data.get("dripEdgeRadio")
    drip_edge = data.get("dripEdge", [])
    draw_checkbox(c, 0.65, 7.15, drip_edge_radio == "Yes")
    draw_checkbox(c, 1.45, 7.15, drip_edge_radio == "No")
    draw_checkbox(c, 2.45, 7.15, 'Eave' in drip_edge)
    draw_checkbox(c, 3.25, 7.15, 'Rake' in drip_edge)

    # Calculations
    draw_text(c, 5.0, 8.4, data.get("calcA", ""), size=10)
    draw_text(c, 5.8, 8.4, data.get("calcB", ""), size=10)
    draw_text(c, 6.6, 8.4, data.get("calcC", ""), size=10)
    draw_text(c, 7.4, 8.4, data.get("calcD", ""), size=10)
    draw_text(c, 5.0, 8.2, data.get("calcE", ""), size=10)
    draw_text(c, 5.8, 8.2, data.get("calcF", ""), size=10)
    draw_text(c, 6.6, 8.2, data.get("calcG", ""), size=10)
    draw_text(c, 7.4, 8.2, data.get("calcH", ""), size=10)
    draw_text(c, 5.0, 8.0, data.get("calcI", ""), size=10)
    draw_text(c, 5.8, 8.0, data.get("calcJ", ""), size=10)
    draw_text(c, 6.6, 8.0, data.get("calcK", ""), size=10)
    draw_text(c, 7.4, 8.0, data.get("calcL", ""), size=10)
    draw_text(c, 5.0, 7.8, data.get("calcM", ""), size=10)

    draw_text(c, 3.8, 7.3, data.get("eaveLF", ""), size=10)
    draw_text(c, 4.8, 7.3, data.get("rakeLF", ""), size=10)
    draw_checkbox(c, 6.0, 7.3, data.get("aerialMeasurements1Story", False))
    draw_checkbox(c, 6.8, 7.3, data.get("aerialMeasurements2Story", False))
    draw_text(c, 7.8, 7.1, data.get("totalSquares", ""), size=10)

    # Left Rail
    draw_text(c, 1.9, 6.55, data.get("layers", ""), size=11)
    draw_text(c, 1.9, 6.20, data.get("pitch", ""), size=11)
    draw_checkbox(c, 1.45, 5.85, data.get("boxVentsMetal", False))
    draw_checkbox(c, 1.85, 5.85, data.get("boxVentsPlastic", False))
    draw_checkbox(c, 2.4, 5.85, data.get("boxVentsMetalDamaged", False))
    draw_text(c, 1.9, 5.50, data.get("ridgeVentLF", ""), size=11)
    draw_text(c, 1.9, 5.15, data.get("turbineQtyLead", ""), size=11)
    draw_text(c, 1.9, 4.80, data.get("hvacventQtyLead", ""), size=11)
    draw_text(c, 1.9, 4.45, data.get("raindiverterQtyLead", ""), size=11)
    draw_text(c, 1.9, 4.10, data.get("powerVentQtyLead", ""), size=11)
    draw_text(c, 1.9, 3.75, data.get("skylightQtyLead", ""), size=11)
    draw_text(c, 1.9, 3.40, data.get("satQtyLead", ""), size=11)
    
    draw_text(c, 1.6, 3.05, data.get("pipeQty", ""), size=11)
    draw_checkbox(c, 2.0, 3.05, data.get("pipeLead", False))
    draw_checkbox(c, 2.4, 3.05, data.get("pipePlastic", False))

    draw_text(c, 1.6, 2.7, data.get("guttersLF", ""), size=11)
    draw_checkbox(c, 2.0, 2.7, data.get("guttersSize") == '5"')
    draw_checkbox(c, 2.4, 2.7, data.get("guttersSize") == '6"')

    draw_checkbox(c, 1.45, 2.35, data.get("downspoutsSize") == '3x4')
    draw_checkbox(c, 2.0, 2.35, data.get("downspoutsSize") == '2x3')

    draw_text(c, 1.9, 2.0, data.get("fasciaSize", ""), size=11)
    draw_checkbox(c, 1.45, 1.65, data.get("woodMetal") == "Wood")
    draw_checkbox(c, 2.0, 1.65, data.get("woodMetal") == "Metal")
    
    draw_text(c, 1.9, 1.3, data.get("chimneyFlashing", ""), size=11)
    
    # Other is just text, not checkboxes
    # draw_checkbox(c, 1.45, 0.95, data.get("otherSolar", False))
    # draw_checkbox(c, 2.0, 0.95, data.get("otherVentE", False))
    # draw_checkbox(c, 2.6, 0.95, data.get("otherExhaustVent", False))
    
    # Footer
    draw_text(c, 1.3, 0.85, data.get("maxHailDiameter", ""), size=10)
    draw_text(c, 3.2, 0.85, data.get("stormDirection", ""), size=10)
    draw_text(c, 5.1, 0.85, data.get("collateralDamage", ""), size=10)
    
    notes = data.get("notes", '')
    if notes:
        max_line_chars = 90
        notes_lines = [notes[i:i+max_line_chars] for i in range(0, len(notes), max_line_chars)]
        for i, line in enumerate(notes_lines):
            draw_text(c, 0.6, 0.6 - i * 0.15, line, size=10)


template_pdf = "public/satellite_base.pdf"
base = PdfReader(template_pdf)
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=letter)
draw_fn(c)
c.save()
buf.seek(0)
overlay_reader = PdfReader(buf)
overlay_page = overlay_reader.pages[0]

writer = PdfWriter()
page = base.pages[0]
page.merge_page(overlay_page)
writer.add_page(page)

output_buf = io.BytesIO()
writer.write(output_buf)
output_buf.seek(0)

pdf_base64 = base64.b64encode(output_buf.read()).decode('utf-8')
print(json.dumps({'pdfBase64': pdf_base64}))
      `;
      const { files } = await ai.run(code, {
        dependencies: ['pypdf', 'reportlab'],
      });
      return JSON.parse(files['stdout.txt'] as string);
    },
  );

export const generateScopeSheet = ai.defineFlow(
    {
        name: 'generateScopeSheet',
        inputSchema: scopeSheetSchema,
        outputSchema: z.object({
            pdfBase64: z.string(),
        }),
    },
    async (data) => {
        return stampPdfTool(data);
    }
);
