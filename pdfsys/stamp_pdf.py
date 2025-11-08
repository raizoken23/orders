# python stamp_pdf.py templates/master.pdf coords.json.sample payload.json out.pdf
import sys, json, io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

def draw_text(c, x, y, txt, size=10, font="Helvetica", align="left", max_w=None):
    if font != "Helvetica" and font not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(font, f"src/pdf/fonts/{font}.ttf"))
    c.setFont(font, size)
    if max_w:
        w = pdfmetrics.stringWidth(txt, font, size)
        if w > max_w:  # simple truncate with ellipsis
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
    c.rect(x, y, s, s, stroke=1, fill=0)
    if mark.upper()=="X":
        c.line(x+2, y+2, x+s-2, y+s-2)
        c.line(x+s-2, y+2, x+2, y+s-2)

def render_overlay(coords, payload):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    # text
    for k, spec in coords.get("text", {}).items():
        val = payload.get(k) or payload.get(k.split(".")[-1]) or spec.get("value") or ""
        x = spec["xIn"]*inch; y = spec["yIn"]*inch
        draw_text(c, x, y, str(val), size=spec.get("sizePt",10), font=spec.get("font","Helvetica"), align=spec.get("align","left"), max_w=spec.get("maxWidthPt"))
    # checks
    for k, spec in coords.get("checks", {}).items():
        selected = payload.get(k) or False
        if isinstance(selected, list):
            selected = spec.get("value") in selected
        if selected:
            draw_check(c, spec["xIn"]*inch, spec["yIn"]*inch, size_in=spec.get("sizeIn",0.16))
    c.showPage(); c.save(); buf.seek(0)
    return PdfReader(buf)

def merge(template_pdf, overlay_reader, out_path):
    base = PdfReader(template_pdf); w = PdfWriter()
    for i, page in enumerate(base.pages):
        page.merge_page(overlay_reader.pages[0])
        w.add_page(page)
    with open(out_path, "wb") as f: w.write(f)

if __name__ == "__main__":
    if len(sys.argv)!=5: sys.exit("usage: stamp_pdf.py <template.pdf> <coords.json> <payload.json> <out.pdf>")
    template, coords_path, payload_path, outp = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    coords = json.load(open(coords_path))
    payload = json.load(open(payload_path))
    overlay = render_overlay(coords, payload)
    merge(template, overlay, outp)
    print(f"wrote {outp}")
