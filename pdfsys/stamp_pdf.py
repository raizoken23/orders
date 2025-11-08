# pdfsys/stamp_pdf.py
# pip deps: pypdf>=5, reportlab>=4
import io, json, base64, os
from typing import Any, Dict, Union
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

# ---------- drawing helpers ----------
def _draw_text(c, x_in, y_in, txt, size=10, font="Helvetica", align="left", max_w_pt=None):
    if font != "Helvetica" and font not in pdfmetrics.getRegisteredFontNames():
        # optional: register fallback font if present
        font_path = os.path.join(os.path.dirname(__file__), "fonts", f"{font}.ttf")
        if os.path.exists(font_path):
            pdfmetrics.registerFont(TTFont(font, font_path))
        else:
            font = "Helvetica"
    c.setFont(font, size)
    text = "" if txt is None else str(txt)
    if max_w_pt:
        w = pdfmetrics.stringWidth(text, font, size)
        if w > max_w_pt:
            while len(text) > 1 and w > max_w_pt:
                text = text[:-1]
                w = pdfmetrics.stringWidth(text + "…", font, size)
            text = text + "…"
    x = x_in * inch
    y = (11 - y_in) * inch
    if align == "center":
        c.drawCentredString(x, y, text)
    elif align == "right":
        c.drawRightString(x, y, text)
    else:
        c.drawString(x, y, text)

def _draw_check(c, x_in, y_in, size_in=0.16, mark="X"):
    x = x_in * inch; y = (11-y_in) * inch - (size_in*inch); s = size_in * inch
    # c.rect(x, y, s, s, stroke=1, fill=0) # Don't draw the box, it's on the template
    if str(mark).upper() == "X":
      c.setFont("Helvetica-Bold", s * 0.9)
      c.drawString(x + s*0.1, y + s*0.15, "X")


# ---------- render + merge ----------
def _render_overlay(coords: Dict[str, Any], payload: Dict[str, Any]) -> PdfReader:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    # text
    for key, spec in coords.get("text", {}).items():
        src_keys = [key, key.split(".")[-1]]
        val = next((payload.get(k) for k in src_keys if k in payload and payload.get(k) not in [None, ""]), spec.get("value", ""))
        if val:
            _draw_text(
                c,
                spec["xIn"], spec["yIn"], val,
                size=spec.get("sizePt", 10),
                font=spec.get("font", "Helvetica"),
                align=spec.get("align", "left"),
                max_w_pt=spec.get("maxWidthPt")
            )
    # checks
    for key, spec_group in coords.get("checks", {}).items():
        payload_values = payload.get(key, [])
        if not isinstance(payload_values, list): # Handle single values like radio buttons
            payload_values = [payload_values] if payload_values else []
        
        for spec in spec_group:
          if spec["val"] in payload_values:
            _draw_check(c, spec["xIn"], spec["yIn"], size_in=spec.get("sizeIn", 0.16), mark=spec.get("mark", "X"))

    c.showPage(); c.save(); buf.seek(0)
    return PdfReader(buf)

def _merge_bytes(template_pdf_path: str, overlay_reader: PdfReader) -> bytes:
    base = PdfReader(template_pdf_path)
    w = PdfWriter()
    
    # Ensure there's a page to merge onto
    if not base.pages:
        raise ValueError("Template PDF has no pages.")
    
    base.pages[0].merge_page(overlay_reader.pages[0])

    for page in base.pages:
        w.add_page(page)

    out = io.BytesIO(); w.write(out); return out.getvalue()

# ---------- REQUIRED ENTRYPOINT ----------
def run(event: Dict[str, Any]) -> Dict[str, Union[str, None]]:
    """
    Required entrypoint for your runner.

    event = {
      "template": "public/satellite_base.pdf" | absolute path,
      "coords": { ... } | path to JSON file,
      "payload": { ... }                      # form data
    }
    Returns: {"pdfBase64": "<base64 string>"}
    """
    try:
        template = event["template"]
        coords_arg: Union[str, Dict[str, Any]] = event["coords"]
        payload: Dict[str, Any] = event.get("payload", {})

        if isinstance(coords_arg, str):
            with open(coords_arg, "r", encoding="utf-8") as f:
                coords = json.load(f)
        else:
            coords = coords_arg

        overlay = _render_overlay(coords, payload)
        pdf_bytes = _merge_bytes(template, overlay)
        b64_string = base64.b64encode(pdf_bytes).decode("ascii")
        return {"pdfBase64": b64_string}
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}


# Optional aliases for other platforms
handler = run  # AWS-style
main = run     # some tools expect 'main'

# ---------- CLI for local testing ----------
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--template", required=True)
    ap.add_argument("--coords", required=True)
    ap.add_argument("--payload", required=True, help="JSON file with data")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    with open(a.payload, "r", encoding="utf-8") as f:
        payload = json.load(f)
    res = run({"template": a.template, "coords": a.coords, "payload": payload})
    if res.get("pdfBase64"):
      with open(a.out, "wb") as f:
          f.write(base64.b64decode(res["pdfBase64"]))
      print(f"Wrote {a.out}")
    else:
      print("Failed to generate PDF.")
      print(res)

    