# python stamp_pdf.py templates/master.pdf coords.json.sample payload.json out.pdf
import sys, json, io, os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

def draw_text(c, x, y, txt, size=10, font="Helvetica", align="left", max_w=None):
    if font != "Helvetica" and font not in pdfmetrics.getRegisteredFontNames():
        font_path = f"src/pdf/fonts/{font}.ttf"
        # print(f"[DEBUG] Registering font: {font} from {font_path}")
        if os.path.exists(font_path):
            pdfmetrics.registerFont(TTFont(font, font_path))
            c.setFont(font, size)
        else:
            # print(f"[WARN] Font file not found: {font_path}. Falling back to Helvetica.")
            c.setFont("Helvetica", size)
    else:
        c.setFont(font, size)
    
    if max_w:
        w = pdfmetrics.stringWidth(txt, font, size)
        if w > max_w and len(txt)>1:
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
    print("[DEBUG] Starting render_overlay...")
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    
    # text
    text_items = coords.get("text", {})
    print(f"[DEBUG] Found {len(text_items)} text items in coords.")
    for k, spec in text_items.items():
        val = payload.get(k) or payload.get(k.split(".")[-1]) or spec.get("value") or ""
        if val:
            x = spec["xIn"]*inch; y = spec["yIn"]*inch
            # print(f"[TRACE] Drawing text for '{k}': '{val}' at ({spec['xIn']}, {spec['yIn']})")
            draw_text(c, x, y, str(val), size=spec.get("sizePt",10), font=spec.get("font","Helvetica"), align=spec.get("align","left"), max_w=spec.get("maxWidthPt"))
    
    # checks
    check_items = coords.get("checks", {})
    print(f"[DEBUG] Found {len(check_items)} check items in coords.")
    for k, spec in check_items.items():
        selected = payload.get(k) or False
        if isinstance(selected, list) and spec.get("value"):
            if spec.get("value") in selected:
                # print(f"[TRACE] Drawing check for list-based '{k}' with value '{spec.get('value')}'")
                draw_check(c, spec["xIn"]*inch, spec["yIn"]*inch, size_in=spec.get("sizeIn",0.16))
        elif isinstance(selected, bool) and selected:
            # print(f"[TRACE] Drawing check for boolean-based '{k}'")
            draw_check(c, spec["xIn"]*inch, spec["yIn"]*inch, size_in=spec.get("sizeIn",0.16))

    c.showPage(); c.save(); buf.seek(0)
    print("[DEBUG] render_overlay completed successfully.")
    return PdfReader(buf)

def merge(template_pdf, overlay_reader, out_path):
    print(f"[DEBUG] Starting merge. Base: '{template_pdf}', Output: '{out_path}'")
    try:
        base = PdfReader(template_pdf)
        w = PdfWriter()
        print(f"[DEBUG] Base PDF has {len(base.pages)} pages.")
        
        if len(overlay_reader.pages) == 0:
            print("[ERROR] Overlay PDF has 0 pages. Cannot merge.")
            return

        for i, page in enumerate(base.pages):
            print(f"[DEBUG] Merging page {i+1}...")
            page.merge_page(overlay_reader.pages[0])
            w.add_page(page)
        
        with open(out_path, "wb") as f: w.write(f)
        print(f"[DEBUG] Merge successful. Wrote final PDF to '{out_path}'.")
    except Exception as e:
        print(f"[ERROR] Exception during merge process: {e}")
        raise

if __name__ == "__main__":
    print("[DEBUG] stamp_pdf.py script started.")
    print(f"[DEBUG] Arguments received: {sys.argv}")

    # PREFLIGHT CHECKS
    if len(sys.argv)!=5: 
        print(f"[ERROR] PREFLIGHT FAILED: Invalid number of arguments. Expected 4, got {len(sys.argv)-1}.")
        sys.exit("usage: stamp_pdf.py <template.pdf> <coords.json> <payload.json> <out.pdf>")
    
    template, coords_path, payload_path, outp = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    
    print(f"[DEBUG] Template path: {template}")
    print(f"[DEBUG] Coords path: {coords_path}")
    print(f"[DEBUG] Payload path: {payload_path}")
    print(f"[DEBUG] Output path: {outp}")

    # File existence checks
    if not os.path.exists(template):
        print(f"[ERROR] PREFLIGHT FAILED: Template file not found at '{template}'")
        sys.exit(1)
    if not os.path.exists(coords_path):
        print(f"[ERROR] PREFLIGHT FAILED: Coords file not found at '{coords_path}'")
        sys.exit(1)
    if not os.path.exists(payload_path):
        print(f"[ERROR] PREFLIGHT FAILED: Payload file not found at '{payload_path}'")
        sys.exit(1)

    try:
        with open(coords_path) as f:
            coords = json.load(f)
        print("[DEBUG] Coords JSON loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to load or parse coords JSON: {e}")
        sys.exit(1)

    try:
        with open(payload_path) as f:
            payload = json.load(f)
        print("[DEBUG] Payload JSON loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to load or parse payload JSON: {e}")
        sys.exit(1)
    
    try:
        overlay = render_overlay(coords, payload)
        merge(template, overlay, outp)
        print(f"[SUCCESS] Wrote final PDF to {outp}")
    except Exception as e:
        print(f"[ERROR] An unhandled exception occurred during PDF generation: {e}")
        sys.exit(1)

    print("[DEBUG] stamp_pdf.py script finished.")