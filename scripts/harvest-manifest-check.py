#!/usr/bin/env python
"""Validate docs/MEDIA_MANIFEST.json.

Checks:
1. Manifest is a JSON array.
2. Every entry has all 8 required keys: file, source_url, author, license,
   credit, section_hint, width, height, kind (9 with kind).
3. kind is one of image|video|logo.
4. Every referenced file exists on disk (relative to project root).
5. width/height are positive integers.

Exit code 0 = pass, 1 = fail.
"""
import json
import os
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(PROJECT_ROOT, "docs", "MEDIA_MANIFEST.json")

REQUIRED_KEYS = ["file", "source_url", "author", "license", "credit",
                 "section_hint", "width", "height", "kind"]
VALID_KINDS = {"image", "video", "logo"}
VALID_LICENSES = {"org-material", "cc0", "cc-by", "cc-by-sa", "public-domain"}

def main():
    errors = []
    if not os.path.isfile(MANIFEST):
        print(f"FAIL: manifest not found: {MANIFEST}")
        return 1
    with open(MANIFEST, encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"FAIL: manifest is not valid JSON: {e}")
            return 1
    if not isinstance(data, list):
        print("FAIL: manifest root is not a JSON array")
        return 1

    print(f"Validating {len(data)} manifest entries...")

    for i, entry in enumerate(data):
        where = f"entry[{i}] ({entry.get('file', '?')})"
        # required keys
        for k in REQUIRED_KEYS:
            if k not in entry:
                errors.append(f"{where}: missing required key '{k}'")
        # kind
        if entry.get("kind") not in VALID_KINDS:
            errors.append(f"{where}: invalid kind '{entry.get('kind')}'")
        # license
        lic = entry.get("license")
        if lic not in VALID_LICENSES:
            errors.append(f"{where}: unexpected license '{lic}'")
        # dimensions
        w, h = entry.get("width"), entry.get("height")
        if not isinstance(w, int) or not isinstance(h, int) or w <= 0 or h <= 0:
            errors.append(f"{where}: invalid width/height {w}x{h}")
        # file exists
        rel = entry.get("file")
        if rel:
            abspath = os.path.join(PROJECT_ROOT, rel)
            if not os.path.isfile(abspath):
                errors.append(f"{where}: file not on disk: {rel}")

    if errors:
        print(f"\nFAIL: {len(errors)} problem(s):")
        for e in errors:
            print("  -", e)
        return 1

    # summary
    kinds = {}
    for e in data:
        kinds[e["kind"]] = kinds.get(e["kind"], 0) + 1
    print(f"\nPASS: all {len(data)} entries valid. kinds={kinds}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
