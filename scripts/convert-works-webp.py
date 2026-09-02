#!/usr/bin/env python3
"""
One-off asset migration for TreeHouse Studio.

- Moves the 4000px PNG masters out of public/ into master-assets/works/
  (kept as untouchable originals).
- Re-encodes each as WebP (max long edge 2560px, quality 82) into
  public/works/ so the site serves ~150-500KB images instead of 6-25MB.

Run once; re-run only if masters change.
"""
import os
import sys
from PIL import Image

ROOT = "/home/z/my-project"
SRC = os.path.join(ROOT, "master-assets", "works")
DST = os.path.join(ROOT, "public", "works")

MAX_EDGE = 2560
QUALITY = 82


def convert(name: str) -> None:
    src_path = os.path.join(SRC, name)
    out_name = os.path.splitext(name)[0] + ".webp"
    dst_path = os.path.join(DST, out_name)

    img = Image.open(src_path)
    # Preserve EXIF orientation if present.
    try:
        from PIL import ImageOps
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    w, h = img.size
    scale = MAX_EDGE / max(w, h)
    if scale < 1:
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    img.save(dst_path, "WEBP", quality=QUALITY, method=6)

    src_mb = os.path.getsize(src_path) / 1024 / 1024
    dst_kb = os.path.getsize(dst_path) / 1024
    print(f"{name} {w}x{h} -> {out_name} {img.size[0]}x{img.size[1]}  "
          f"{src_mb:.1f}MB -> {dst_kb:.0f}KB")


def main() -> None:
    os.makedirs(DST, exist_ok=True)
    pngs = sorted(f for f in os.listdir(SRC) if f.lower().endswith(".png"))
    if not pngs:
        print("No PNG masters found in", SRC)
        sys.exit(1)
    for name in pngs:
        convert(name)
    total = sum(
        os.path.getsize(os.path.join(DST, f)) for f in os.listdir(DST)
    ) / 1024
    print(f"\nTotal in public/works: {total:.0f} KB")


if __name__ == "__main__":
    main()
