# python feature_scan.py templates/master.pdf master_features.json master_preview.png
import sys, json
import fitz  # PyMuPDF
from PIL import Image, ImageChops, ImageStat

def page_preview(doc, pno=0, zoom=2.0):
    page = doc.load_page(pno)
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

def scan_pdf(path):
    doc = fitz.open(path)
    page = doc.load_page(0)

    # text blocks
    text_items = []
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            for s in l.get("spans", []):
                text_items.append({
                    "text": s["text"],
                    "font": s.get("font"),
                    "size": round(s.get("size", 0), 2),
                    "bbox": [round(x,2) for x in s["bbox"]],
                    "color": s.get("color", 0)
                })

    # drawings (lines, rects, beziers)
    draw_items = []
    for d in page.get_drawings():
        item = {
            "type": d["type"],  # 'rect','line','curve','polyline','path'
            "stroke": d.get("color"),
            "fill": d.get("fill"),
            "width": round(d.get("width", 0), 3),
            "items": []
        }
        for p in d["items"]:
            if p[0] == "l":  # line
                item["items"].append({"l":[round(x,2) for x in p[1]]})
            elif p[0] == "re":  # rect
                item["items"].append({"re":[round(x,2) for x in p[1]]})
            else:
                item["items"].append({"op":p[0]})
        draw_items.append(item)

    # images
    img_items = []
    for xref, *_ in page.get_images(full=True):
        rect = page.get_image_bbox(xref)
        img_items.append({"xref": xref, "bbox":[round(rect.x0,2),round(rect.y0,2),round(rect.x1,2),round(rect.y1,2)]})

    return {
        "pageSizePt": [page.rect.width, page.rect.height],
        "text": text_items,
        "drawings": draw_items,
        "images": img_items
    }

if __name__ == "__main__":
    if len(sys.argv)<4: sys.exit("usage: feature_scan.py <pdf> <out_json> <preview_png>")
    pdf, outj, outimg = sys.argv[1], sys.argv[2], sys.argv[3]
    doc = fitz.open(pdf)
    features = scan_pdf(pdf)
    with open(outj, "w") as f: json.dump(features, f, indent=2, ensure_ascii=False)
    page_preview(doc).save(outimg)
    print(f"wrote {outj} and {outimg}")
