import base64, json, importlib.util, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
STAMP = ROOT / "pdfsys" / "stamp_pdf.py"
TEMPLATE = ROOT / "public" / "satellite_base.pdf"
COORDS = ROOT / "pdfsys" / "coords.json.sample"

def load_module(path):
    spec = importlib.util.spec_from_file_location("pdfsys.stamp_pdf", str(path))
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); return mod

def test_exports_run():
    m = load_module(STAMP)
    assert hasattr(m, "run")

def test_run_returns_pdf():
    m = load_module(STAMP)
    assert TEMPLATE.exists()
    assert COORDS.exists()
    res = m.run({"template": str(TEMPLATE), "coords": str(COORDS), "payload": {"header.date": "2025-11-08"}})
    assert "pdfBase64" in res
    b = base64.b64decode(res["pdfBase64"])
    assert b[:5] == b"%PDF-"
