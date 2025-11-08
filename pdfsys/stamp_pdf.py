# python stamp_pdf.py templates/master.pdf coords.json.sample payload.json out.pdf
import sys, json, io, os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

def render_stage_1_test_overlay():
    """
    A barebones overlay generator for Stage 1 testing.
    It ignores all input data and just draws a single text string.
    """
    print("[DEBUG] STAGE 1: Rendering test overlay.")
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    
    # Draw a single, hardcoded string at a known coordinate.
    c.setFont("Helvetica", 12)
    c.drawString(1 * inch, 10 * inch, "STAGE 1 TEST: PDF GENERATION ENGINE IS WORKING.")
    
    c.showPage()
    c.save()
    buf.seek(0)
    print("[DEBUG] STAGE 1: Test overlay rendered successfully.")
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

        # Merge the overlay onto the first page of the base template.
        base.pages[0].merge_page(overlay_reader.pages[0])
        
        # Add all pages from the (now modified) base to the writer
        for page in base.pages:
            w.add_page(page)
        
        with open(out_path, "wb") as f: w.write(f)
        print(f"[DEBUG] Merge successful. Wrote final PDF to '{out_path}'.")
    except Exception as e:
        print(f"[ERROR] Exception during merge process: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    print("[DEBUG] stamp_pdf.py STAGE 1 TEST script started.")
    
    if len(sys.argv) < 3: 
        print(f"[ERROR] PREFLIGHT FAILED: Invalid arguments for Stage 1. Need template_path and output_path.")
        sys.exit("usage: stamp_pdf.py <template.pdf> <out.pdf> [dummy_coords] [dummy_payload]")

    template, outp = sys.argv[1], sys.argv[2]
    print(f"[DEBUG] Template path: {template}")
    print(f"[DEBUG] Output path: {outp}")

    if not os.path.exists(template):
        print(f"[ERROR] PREFLIGHT FAILED: Template file not found at '{template}'")
        sys.exit(1)

    try:
        # For Stage 1, we don't need coords or payload, just generate the test overlay
        overlay = render_stage_1_test_overlay()
        merge(template, overlay, outp)
        print(f"[SUCCESS] Wrote STAGE 1 TEST PDF to {outp}")
    except Exception as e:
        print(f"[ERROR] An unhandled exception occurred during PDF generation: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    print("[DEBUG] stamp_pdf.py STAGE 1 TEST script finished.")
