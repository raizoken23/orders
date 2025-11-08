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
import traceback

def _err(code, msg, detail=None):
    return {"error": {"code": code, "message": msg, "detail": detail}}

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

def _merge(template: str, overlay: PdfReader) -> bytes:
    base = PdfReader(template); w = PdfWriter()
    if not base.pages:
        raise ValueError("Template PDF has no pages.")
    base.pages[0].merge_page(overlay.pages[0])
    for p in base.pages:
        w.add_page(p)
    out = io.BytesIO(); w.write(out); return out.getvalue()

# ---------- REQUIRED ENTRYPOINT ----------
def run(event: Dict[str,Any]) -> Dict[str,str]:
    # contract check
    try:
        template = event["template"]
        coords_arg: Union[str,Dict[str,Any]] = event["coords"]
        payload: Dict[str,Any] = event.get("payload", {})
    except Exception as e:
        return _err("CONTRACT_ERROR", "Missing required keys template|coords|payload", str(e))
    
    if not os.path.exists(template):
        return _err("TEMPLATE_NOT_FOUND", f"Template file not found at path: {template}")
    
    coords = None
    if isinstance(coords_arg, str):
        if not os.path.exists(coords_arg): 
            return _err("COORDS_NOT_FOUND", f"Coordinates file not found at path: {coords_arg}")
        with open(coords_arg,"r",encoding="utf-8") as f:
            coords = json.load(f)
    else:
        coords = coords_arg
        
    if not coords:
        return _err("COORDS_INVALID", "Coordinates were not loaded or provided.")

    try:
        overlay = _render_overlay(coords, payload)
        pdf_bytes = _merge(template, overlay)
        return {"pdfBase64": base64.b64encode(pdf_bytes).decode("ascii")}
    except Exception as e:
        return _err("RENDER_FAILURE", "Exception during PDF render/merge", traceback.format_exc())

# common aliases some platforms look for
handler = run
main = run

# ---------- CLI for local testing ----------
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--template", required=True)
    ap.add_argument("--coords", required=True)
    ap.add_argument("--payload", required=True, help="JSON file with data")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    
    payload = {}
    with open(a.payload, "r", encoding="utf-8") as f:
        payload = json.load(f)
        
    res = run({"template": a.template, "coords": a.coords, "payload": payload})
    
    if "pdfBase64" in res:
        with open(a.out, "wb") as f:
            f.write(base64.b64decode(res["pdfBase64"]))
        print(f"[SUCCESS] Wrote stamped PDF to {a.out}")
    else:
        print("[ERROR] PDF generation failed.")
        print(json.dumps(res, indent=2))
        raise SystemExit(1)
