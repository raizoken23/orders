# python clone_template.py public/satellite_base.pdf templates/master.pdf
import sys, json, hashlib
from pypdf import PdfReader, PdfWriter

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1<<20), b""):
            h.update(b)
    return h.hexdigest()

def main(src, dst):
    r = PdfReader(src)
    w = PdfWriter()
    for p in r.pages: w.add_page(p)
    with open(dst, "wb") as f: w.write(f)
    h = sha256(dst)
    meta = {
        "templatePath": dst,
        "templateSha256": h,
        "numPages": len(r.pages),
        "mediabox": list(map(float, r.pages[0].mediabox)),
        "version": "1.0.0"
    }
    with open("template_meta.json", "w") as f: json.dump(meta, f, indent=2)
    print(json.dumps(meta, indent=2))

if __name__ == "__main__":
    if len(sys.argv)!=3: sys.exit("usage: clone_template.py <src> <dst>")
    main(sys.argv[1], sys.argv[2])
