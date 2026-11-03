#!/usr/bin/env python3
"""Prepare the genuine shipped-app screenshots for the NDM site.

Crops the GTK proof-run captures (~/workspace/ndm220-run/shots/) to the
regions the design uses, encodes them as WebP and writes a JSON map of
placeholder -> data URI. build_site.py inlines them into index.html
(the deploy route is text-only, so the pictures travel inside the page).
"""
import base64
import io
import json
from PIL import Image

SHOTS = "/home/hatch/workspace/ndm220-run/shots"

# name -> (source file, crop box (l, t, r, b) in native 1400x900, max width, quality)
JOBS = {
    # the progress dialog at true size — the hero fragment
    "hero":    ("07-progressdlg.png", (4, 0, 628, 722), None, 88),
    # how-it-works states
    "how1":    ("01-main.png",        (0, 0, 1112, 718), 880, 84),
    "how2":    ("02-addurl.png",      (330, 250, 790, 480), None, 86),
    "how3":    ("07-progressdlg.png", (8, 262, 626, 566), None, 86),
    "how4":    ("06-complete.png",    (0, 0, 640, 318), None, 86),
    # engine proof panels, true-size crops
    "f_journal": ("11-main2.png",           (735, 96, 1095, 276), None, 86),
    "f_limit":   ("07-progressdlg.png",     (8, 2, 368, 152), None, 86),
    "f_queue":   ("15-scheduler.png",       (450, 118, 810, 298), None, 86),
    "f_grab":    ("14-options-categories.png", (250, 203, 610, 383), None, 86),
    # showcase flanks
    "flank_l": ("01-main.png", (0, 0, 1112, 718), 560, 80),
    "flank_r": ("11-main2.png", (0, 0, 1112, 718), 560, 80),
}


def encode(img, quality):
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=quality, method=6)
    return buf.getvalue()


def main():
    out = {}
    total = 0
    for name, (src, box, maxw, q) in JOBS.items():
        im = Image.open(f"{SHOTS}/{src}").convert("RGB").crop(box)
        if maxw and im.width > maxw:
            im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
        data = encode(im, q)
        total += len(data)
        out[name] = {
            "uri": "data:image/webp;base64," + base64.b64encode(data).decode(),
            "w": im.width,
            "h": im.height,
            "bytes": len(data),
        }
        print(f"{name:10s} {im.width}x{im.height}  {len(data)/1024:.1f} KB")
    print(f"TOTAL webp {total/1024:.0f} KB -> base64 ~{total*4/3/1024:.0f} KB")
    with open("/home/hatch/workspace/ndm-website-taste/tools/shots.json", "w") as f:
        json.dump(out, f)


if __name__ == "__main__":
    main()
