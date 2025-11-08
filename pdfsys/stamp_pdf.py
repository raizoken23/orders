
# pdfsys/stamp_pdf.py
# pip deps: pypdf>=5, reportlab>=4
import io, os, json, base64, traceback
from typing import Dict, Any, Union
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

def _err(code, msg, detail=None):
    return {"error": {"code": code, "message": msg, "detail": detail}}

def _draw_text(c, x_in, y_in, txt, size=10, font="Helvetica", align="left", max_w_pt=None):
    try:
        if font != "Helvetica" and font not in pdfmetrics.getRegisteredFontNames():
            fp = os.path.join(os.path.dirname(__file__), "fonts", f"{font}.ttf")
            if os.path.exists(fp):
                pdfmetrics.registerFont(TTFont(font, fp))
            else:
                font = "Helvetica"
        c.setFont(font, size)
    except Exception:
        c.setFont("Helvetica", size)
    s = "" if txt is None else str(txt)
    if max_w_pt:
        w = pdfmetrics.stringWidth(s, font, size)
        while len(s)>1 and w>max_w_pt:
            s = s[:-1]; w = pdfmetrics.stringWidth(s+"…", font, size)
        if w>max_w_pt: s = s[:1]  # extreme
    x = x_in*inch; y = y_in*inch
    if align=="center": c.drawCentredString(x,y,s)
    elif align=="right": c.drawRightString(x,y,s)
    else: c.drawString(x,y,s)

def _draw_check(c, x_in, y_in, size_in=0.16, mark="X"):
    x = x_in*inch; y = y_in*inch; s = size_in*inch
    # The box is already on the template, we just draw the mark.
    if str(mark).upper()=="X":
        # Draw a simple 'X'
        c.setFont("Helvetica-Bold", s * 0.9)
        c.drawString(x + s * 0.1, y - s * 0.15, "X")


def _render_overlay(coords: Dict[str,Any], payload: Dict[str,Any]) -> PdfReader:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    
    # Invert Y-axis for ReportLab (origin bottom-left)
    c.translate(0, 11*inch)
    c.scale(1, -1)

    for k,spec_list in coords.get("text",{}).items():
        if not isinstance(spec_list, list):
            spec_list = [spec_list]
        for spec in spec_list:
            val = payload.get(k, payload.get(k.split(".")[-1], spec.get("value","")))
            _draw_text(c, spec["xIn"], spec["yIn"], val, size=spec.get("sizePt",10),
                       font=spec.get("font","Helvetica"), align=spec.get("align","left"),
                       max_w_pt=spec.get("maxWidthPt"))

    for k,spec_list in coords.get("checks",{}).items():
        if not isinstance(spec_list, list):
            spec_list = [spec_list]
        for spec in spec_list:
            sel = payload.get(k, False)
            if isinstance(sel, list): sel = spec.get("val") in sel
            if sel: _draw_check(c, spec["xIn"], spec["yIn"], size_in=spec.get("sizeIn",0.16), mark=spec.get("mark","X"))
            
    c.showPage(); c.save(); buf.seek(0)
    return PdfReader(buf)

def _merge(template: str, overlay: PdfReader) -> bytes:
    base = PdfReader(template); w = PdfWriter()
    page = base.pages[0]
    page.merge_page(overlay.pages[0])
    w.add_page(page)
    # Add other pages from the template if they exist
    for p in base.pages[1:]:
        w.add_page(p)
    out = io.BytesIO(); w.write(out); return out.getvalue()

def run(event: Dict[str,Any]) -> Dict[str,str]:
    # contract check
    try:
        template = event["template"]
        coords_arg: Union[str,Dict[str,Any]] = event["coords"]
        payload: Dict[str,Any] = event.get("payload", {})
    except Exception as e:
        return _err("CONTRACT_ERROR", "Missing required keys template|coords|payload", str(e))
    
    if not os.path.exists(template):
        return _err("TEMPLATE_NOT_FOUND", template)
        
    coords = None
    if isinstance(coords_arg, str):
        if not os.path.exists(coords_arg): return _err("COORDS_NOT_FOUND", coords_arg)
        with open(coords_arg,"r",encoding="utf-8") as f:
            coords = json.load(f)
    else:
        coords = coords_arg

    try:
        overlay = _render_overlay(coords, payload)
        pdf_bytes = _merge(template, overlay)
        return {"pdfBase64": base64.b64encode(pdf_bytes).decode("ascii")}
    except Exception:
        return _err("RENDER_FAILURE", "Exception during render", traceback.format_exc())

# common aliases some runners expect
handler = run
main = run
execute = run
execute_tool = run

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--template", required=True)
    ap.add_argument("--coords", required=True)
    ap.add_argument("--payload", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    with open(a.payload, "r", encoding="utf-8") as f:
        payload_data = json.load(f)
    res = run({"template": a.template, "coords": a.coords, "payload": payload_data})
    if "pdfBase64" in res:
        with open(a.out,"wb") as f:
            f.write(base64.b64decode(res["pdfBase64"]))
        print(f"OK: Wrote PDF to {a.out}")
    else:
        print(json.dumps(res, indent=2)); raise SystemExit(2)
