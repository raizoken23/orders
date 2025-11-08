# python stamp_pdf.py templates/master.pdf coords.json.sample payload.json out.pdf
import sys, json, io, os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

def draw_text(c, x, y, text, font="Helvetica", size=9):
    try:
        # Standard fonts don't need registration
        if font.lower() not in ["courier", "helvetica", "times-roman", "symbol", "zapfdingbats"]:
             # Attempt to register font if it's a path to a .ttf file
            if font.lower().endswith('.ttf') and os.path.exists(font):
                font_name = os.path.basename(font).replace('.ttf', '')
                pdfmetrics.registerFont(TTFont(font_name, font))
                c.setFont(font_name, size)
            else:
                # Fallback to Helvetica if font file is not found or not a ttf
                print(f"[WARN] Font '{font}' not found or not a standard/TTF font. Falling back to Helvetica.")
                c.setFont("Helvetica", size)
        else:
             c.setFont(font, size)

        c.drawString(x * inch, (11 - y) * inch, str(text))
    except Exception as e:
        print(f"[ERROR] draw_text failed: {e}")

def draw_check(c, x, y, size=0.16):
    try:
        x_inch = x * inch
        y_inch = (11 - y) * inch
        size_inch = size * inch
        c.setFont("ZapfDingbats", size_inch * 0.9) # Use a standard font for checkmarks
        c.drawString(x_inch, y_inch - size_inch*0.15, "✔")
    except Exception as e:
        print(f"[ERROR] draw_check failed: {e}")

def render_overlay(coords, payload):
    print("[DEBUG] Rendering full overlay.")
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    
    # Text Fields
    if "text" in coords and "text" in payload:
      for key, spec in coords["text"].items():
          if key in payload and payload[key] not in [None, ""]:
              print(f"[DEBUG] Drawing text for '{key}': '{payload[key]}'")
              draw_text(c, spec["xIn"], spec["yIn"], payload[key], spec.get("font", "Helvetica"), spec.get("sizePt", 9))

    # Checkbox Fields
    if "checks" in coords and "checks" in payload:
      for key, spec_group in coords["checks"].items():
        payload_values = payload.get(key, [])
        if not isinstance(payload_values, list): # Handle single values like radio buttons
            payload_values = [payload_values] if payload_values else []

        for spec in spec_group:
          if spec["val"] in payload_values:
            print(f"[DEBUG] Drawing check for '{key}' with value '{spec['val']}'")
            draw_check(c, spec["xIn"], spec["yIn"], spec.get("sizeIn", 0.16))

    c.showPage()
    c.save()
    buf.seek(0)
    print("[DEBUG] Full overlay rendered successfully.")
    return PdfReader(buf)

def merge(template_pdf, overlay_reader, out_path):
    print(f"[DEBUG] Starting merge. Base: '{template_pdf}', Output: '{out_path}'")
    try:
        base = PdfReader(template_pdf)
        w = PdfWriter()
        
        if len(base.pages) == 0:
            print("[ERROR] Base PDF has 0 pages.")
            return False

        if len(overlay_reader.pages) == 0:
            print("[ERROR] Overlay PDF has 0 pages. Cannot merge.")
            return False

        base.pages[0].merge_page(overlay_reader.pages[0])
        
        for page in base.pages:
            w.add_page(page)
        
        with open(out_path, "wb") as f: w.write(f)
        print(f"[DEBUG] Merge successful. Wrote final PDF to '{out_path}'.")
        return True
    except Exception as e:
        print(f"[ERROR] Exception during merge process: {e}")
        import traceback
        traceback.print_exc(file=sys.stdout)
        return False

def preflight_checks(args):
    print("[DEBUG] Running preflight checks...")
    if len(args) != 5:
        print(f"[ERROR] PREFLIGHT FAILED: Invalid number of arguments. Expected 4, got {len(args)-1}.")
        return False, None
    
    template_path, coords_path, payload_path, _ = args[1:]

    for p, name in [(template_path, "Template"), (coords_path, "Coordinates"), (payload_path, "Payload")]:
        if not os.path.exists(p):
            print(f"[ERROR] PREFLIGHT FAILED: {name} file not found at '{p}'")
            return False, None
    
    print("[DEBUG] All preflight checks passed.")
    return True, args[1:]

if __name__ == "__main__":
    print("[DEBUG] stamp_pdf.py script started.")
    
    passed, checked_args = preflight_checks(sys.argv)
    if not passed:
        sys.exit(1)

    template_path, coords_path, payload_path, output_path = checked_args
    
    try:
        print(f"[DEBUG] Loading coords from: {coords_path}")
        with open(coords_path, 'r') as f:
            coords = json.load(f)
        
        print(f"[DEBUG] Loading payload from: {payload_path}")
        with open(payload_path, 'r') as f:
            payload = json.load(f)

        overlay = render_overlay(coords, payload)
        if merge(template_path, overlay, output_path):
            print(f"[SUCCESS] Wrote final PDF to {output_path}")
        else:
            print("[ERROR] PDF merge failed.")
            sys.exit(1)

    except Exception as e:
        print(f"[ERROR] An unhandled exception occurred during PDF generation: {e}")
        import traceback
        traceback.print_exc(file=sys.stdout)
        sys.exit(1)

    print("[DEBUG] stamp_pdf.py script finished.")
