# python audit_compare.py templates/master.pdf out.pdf coords.json report.json diff_master.png diff_out.png
import sys, json, math
import fitz
from PIL import Image, ImageChops, ImageStat, ImageDraw

def render_png(pdf_path, zoom=2.0):
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom,zoom), alpha=False)
    return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

def mask_dynamic(img, coords, zoom=2.0):
    # optional: mask known dynamic regions around text/checks
    draw = ImageDraw.Draw(img)
    for spec in coords.get("text", {}).values():
        x = int(spec["xIn"]*72*zoom) - 12
        y = int(spec["yIn"]*72*zoom) - 12
        draw.rectangle([x, y-14, x+400, y+20], fill=(255,255,255))
    for spec in coords.get("checks", {}).values():
        x = int(spec["xIn"]*72*zoom) - 6
        y = int(spec["yIn"]*72*zoom) - 6
        s = int(spec.get("sizeIn",0.16)*72*zoom)+12
        draw.rectangle([x, y, x+s, y+s], fill=(255,255,255))
    return img

def pixel_metrics(a, b):
    diff = ImageChops.difference(a, b)
    stat = ImageStat.Stat(diff)
    mae = sum(stat.mean)/3.0
    bbox = diff.getbbox()
    changed = 0
    if bbox:
        # count non-white pixels
        changed = sum(1 for p in diff.getdata() if p != (0,0,0))
    return {"mae": round(mae,3), "bbox": bbox if bbox else [0,0,0,0], "changed_pixels": changed}, diff

def structural_counts(pdf_path):
    doc = fitz.open(pdf_path); page = doc.load_page(0)
    draws = page.get_drawings()
    rects = sum(1 for d in draws for it in d["items"] if isinstance(it, tuple) and it[0]=="re")
    lines = sum(1 for d in draws for it in d["items"] if isinstance(it, tuple) and it[0]=="l")
    images = len(page.get_images(full=True))
    # static text count (rough): ignore pure whitespace-only spans
    spans = 0
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            for s in l.get("spans", []):
                if s["text"].strip(): spans += 1
    return {"rects": rects, "lines": lines, "images": images, "spans": spans}

if __name__ == "__main__":
    if len(sys.argv)!=7:
        sys.exit("usage: audit_compare.py <master.pdf> <candidate.pdf> <coords.json> <report.json> <diff_master.png> <diff_candidate.png>")
    master, cand, coords_path, out_json, out_png_m, out_png_c = sys.argv[1:]
    coords = json.load(open(coords_path))

    # RENDER
    m_img = render_png(master); c_img = render_png(cand)
    m_mask = mask_dynamic(m_img.copy(), coords); c_mask = mask_dynamic(c_img.copy(), coords)
    pix_metrics, diff_img = pixel_metrics(m_mask, c_mask)

    # STRUCTURE
    m_counts = structural_counts(master); c_counts = structural_counts(cand)
    struct_delta = {k: c_counts[k]-m_counts[k] for k in m_counts.keys()}

    # SAVE visual aids
    diff_img.save(out_png_m)  # diff image
    c_mask.save(out_png_c)    # masked candidate preview

    report = {
        "pixel": pix_metrics,
        "structure": {"master": m_counts, "candidate": c_counts, "delta": struct_delta},
        "pass": pix_metrics["mae"] < 1.0 and abs(struct_delta["rects"])<=1 and abs(struct_delta["lines"])<=3
    }
    with open(out_json,"w") as f: json.dump(report, f, indent=2)
    print(json.dumps(report, indent=2))
