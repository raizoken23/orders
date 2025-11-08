'use server';
/**
 * @fileOverview A flow that generates a PDF scope sheet by stamping form data onto a template.
 *
 * - generateScopeSheetPdf - The function that handles the PDF generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scopeSheetSchema } from '@/lib/schema/scope-sheet';

const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
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
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
