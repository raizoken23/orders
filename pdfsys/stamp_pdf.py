# pdfsys/stamp_pdf.py
# pip deps: pypdf>=5, reportlab>=4
import io, json, base64, os
from typing import Any, Dict, Union
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from pypdf import PdfReader, PdfWriter

def _overlay(coords: Dict[str,Any], payload: Dict[str,Any]) -> PdfReader:
    from reportlab.pdfgen import canvas
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=letter)
    
    # Adjust origin to bottom-left
    c.translate(0, 11*inch)
    c.scale(1, -1)

    for k,s_list in coords.get("text",{}).items():
        # Ensure s_list is always a list for consistent processing
        if not isinstance(s_list, list):
            s_list = [s_list]
        for s in s_list:
            x, y = s["xIn"]*inch, s["yIn"]*inch
            v = payload.get(k, payload.get(k.split(".")[-1], s.get("value","")))
            c.setFont("Helvetica", s.get("sizePt",10)); c.drawString(x, y, str(v))

    for k,s_list in coords.get("checks",{}).items():
        if not isinstance(s_list, list):
            s_list = [s_list]
        for s in s_list:
            v = payload.get(k, False)
            if isinstance(v, list): v = s.get("val") in v
            if v: 
                x, y, s_in = s["xIn"]*inch, s["yIn"]*inch, s.get("sizeIn",0.16)*inch
                # Don't draw the box, it's on the template
                # c.rect(x, y, s_in, s_in, stroke=1, fill=0)
                c.setFont("Helvetica-Bold", s_in * 0.9)
                c.drawString(x + s_in * 0.1, y - s_in * 0.15, "X")

    c.showPage(); c.save(); buf.seek(0)
    return PdfReader(buf)

def _merge(template_path: str, overlay: PdfReader) -> bytes:
    base = PdfReader(template_path); w = PdfWriter()
    page = base.pages[0]
    page.merge_page(overlay.pages[0])
    w.add_page(page)
    # Add other pages from the template if they exist
    for p in base.pages[1:]:
        w.add_page(p)
    out = io.BytesIO(); w.write(out); return out.getvalue()

def run(event: Dict[str,Any]) -> Dict[str,str]:
    try:
        template = event["template"]
        coords_arg: Union[str,Dict[str,Any]] = event["coords"]
        payload: Dict[str,Any] = event.get("payload", {})
        
        coords = None
        if isinstance(coords_arg, str):
            if not os.path.exists(coords_arg):
                return {"error": f"Coordinates file not found at {coords_arg}"}
            with open(coords_arg, "r", encoding="utf-8") as f:
                coords = json.load(f)
        else:
            coords = coords_arg

        if not coords:
            return {"error": "Coordinates data is empty or invalid."}

        overlay = _overlay(coords, payload)
        pdf_bytes = _merge(template, overlay)
        return {"pdfBase64": base64.b64encode(pdf_bytes).decode("ascii")}
    except Exception as e:
        import traceback
        return {"error": "PDF generation failed in Python script.", "detail": traceback.format_exc()}


# common aliases some runners try
handler = run
main = run

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--template", required=True)
    parser.add_argument("--coords", required=True)
    parser.add_argument("--payload", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    with open(args.payload, "r", encoding="utf-8") as f:
        payload_data = json.load(f)

    result = run({
        "template": args.template,
        "coords": args.coords,
        "payload": payload_data
    })

    if "pdfBase64" in result:
        with open(args.out, "wb") as f:
            f.write(base64.b64decode(result["pdfBase64"]))
        print(f"OK: Wrote PDF to {args.out}")
    else:
        print(json.dumps(result, indent=2))
        sys.exit(1)
