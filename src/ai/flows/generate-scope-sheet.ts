'use server';
/**
 * @fileOverview A flow that generates a PDF scope sheet by stamping form data onto a template using a Python script.
 *
 * - generateScopeSheetPdf - The function that handles the PDF generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scopeSheetSchema } from '@/lib/schema/scope-sheet';
import path from 'path';

const generateScopeSheetFlow = ai.defineFlow(
    {
        name: 'generateScopeSheetFlow',
        inputSchema: scopeSheetSchema,
        outputSchema: z.object({
            pdfBase64: z.string(),
        }),
    },
    async (data) => {
        const payload = JSON.stringify(data);
        const coordsPath = path.resolve(process.cwd(), 'pdfsys/coords.json.sample');
        const templatePath = path.resolve(process.cwd(), 'public/satellite_base.pdf');
        
        // This is a temporary path for the output file within the tool's isolated filesystem.
        const tempOutputPath = '/tmp/output.pdf';

        const code = `
import sys
import json
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter
import base64

def draw_text(c, x, y, txt, size=10, font="Helvetica", align="left", max_w=None):
    if font != "Helvetica" and font not in pdfmetrics.getRegisteredFontNames():
        try:
            # Assuming fonts are in a path accessible to the script, e.g., 'src/pdf/fonts/'
            pdfmetrics.registerFont(TTFont(font, f"src/pdf/fonts/{font}.ttf"))
        except: # Simple fallback
            font = "Helvetica"
    c.setFont(font, size)
    if max_w:
        w = pdfmetrics.stringWidth(txt, font, size)
        if w > max_w:
            while w > max_w and len(txt)>1:
                txt = txt[:-1]
                w = pdfmetrics.stringWidth(txt + "…", font, size)
            txt = txt + "…"
    if align == "center":
        c.drawCentredString(x, y, txt)
    elif align == "right":
        c.drawRightString(x, y, txt)
    else:
        c.drawString(x, y, txt)

def draw_check(c, x, y, size_in=0.16, mark="X"):
    s = size_in*inch
    # c.rect(x, y, s, s, stroke=1, fill=0) # Don't draw the box, it's on the template
    if mark.upper()=="X":
        c.line(x+2, y+2, x+s-2, y+s-2)
        c.line(x+s-2, y+2, x+2, y+s-2)

def render_overlay(coords, payload):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    
    # Text Fields
    for k, spec in coords.get("text", {}).items():
        # Handle nested keys like "header.date" vs simple keys "dateOfLoss"
        key_parts = k.split('.')
        val = payload.get(k) or payload.get(key_parts[-1])
        if val is None: val = spec.get("value", "")

        x = spec["xIn"]*inch
        y = spec["yIn"]*inch
        draw_text(c, x, y, str(val), size=spec.get("sizePt",10), font=spec.get("font","Helvetica"), align=spec.get("align","left"), max_w=spec.get("maxWidthPt"))
        
    # Checkbox Fields
    for k, spec in coords.get("checks", {}).items():
        key_parts = k.split('.')
        payload_key = key_parts[-1] # e.g., 'laminate' from 'shingle.laminate'
        
        # Check direct boolean or if value is in an array
        selected = payload.get(payload_key)
        if isinstance(selected, list):
            selected = spec.get("value") in selected
        
        if selected:
            draw_check(c, spec["xIn"]*inch, spec["yIn"]*inch, size_in=spec.get("sizeIn",0.16))

    c.showPage()
    c.save()
    buf.seek(0)
    return PdfReader(buf)

def merge(template_stream, overlay_reader):
    base = PdfReader(template_stream)
    w = PdfWriter()
    # Assuming a single page PDF for now
    page = base.pages[0]
    page.merge_page(overlay_reader.pages[0])
    w.add_page(page)
    
    output_buf = io.BytesIO()
    w.write(output_buf)
    output_buf.seek(0)
    return output_buf

# Main script execution
coords = json.loads('''${await ai.run('cat ' + coordsPath, { return: 'stdout' })}''')
payload = json.loads('''${payload}''')

with open("${templatePath}", "rb") as f:
    template_bytes = f.read()

template_stream = io.BytesIO(template_bytes)
overlay = render_overlay(coords, payload)
output_pdf_bytes = merge(template_stream, overlay).read()

pdf_base64 = base64.b64encode(output_pdf_bytes).decode('utf-8')
print(json.dumps({'pdfBase64': pdf_base64}))
`;
        const { files } = await ai.run(code, {
            dependencies: [
                'pypdf==5.0.0',
                'reportlab==4.2.0',
                'pymupdf==1.24.6',
                'Pillow==10.4.0'
            ],
        });
        return JSON.parse(files['stdout.txt'] as string);
    }
);

export async function generateScopeSheetPdf(data: z.infer<typeof scopeSheetSchema>) {
    return await generateScopeSheetFlow(data);
}
