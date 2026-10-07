# TYPE — Nohemi for display, Manrope for body

Status: **shipped.** `app/layout.tsx`, `app/fonts/`, `app/globals.css`.

Replaces **Bricolage Grotesque** as the display face.

---

## Why Nohemi

It is the face `opraah.in` sets its entire site in, and it is the single biggest
reason their type reads the way it does. Its own name table settles the licence
question — verbatim, nameID 13:

> By downloading/installing NOHEMI free typeface you agree to this license. This
> typeface is **freeware, you can use it freely for personal and commercial
> projects**. The typeface files may not be modified without written permission
> from Rajesh Rajput.

Typeface: NOHEMI · Designer: Rajesh Rajput · Version 1.000 (2023)
Full terms reproduced in [`app/fonts/Nohemi-LICENSE.txt`](../app/fonts/Nohemi-LICENSE.txt).

So this is not a lookalike or a compromise. We ship the real thing, unmodified,
under its own freeware terms.

## Why not Bricolage

Rendered side by side at the hero's own setting (62px / 500 / −0.025em):

| | Nohemi Medium | Bricolage Grotesque 500 |
|---|---|---|
| Width | tight; the reference's own proportions | **~20% wider** at the same nominal size |
| Terminals | flat, even | angled, cut in places |
| `t` `f` `g` | neutral grotesque | deliberately eccentric, a single-storey `g` |
| Reads as | institution, confident, quiet | designer portfolio |

Bricolage is a good display face, but it is *wide* and it is *quirky*. At the
hero's size it pushed the headline roughly 20% longer than the reference's, and
its eccentric letterforms fought the "premium corporate conclave" register the
rest of the page is written in.

## What moved with it

`--font-display` now points at Nohemi, which is what `font-display`, `display-1`,
`display-2` and `display-3` all resolve through — so every display heading across
the landing page and `/work` switched at once. Manrope still carries the body and
the eyebrows, which is the reference's own pairing (its eyebrow is Manrope 400).

**Tracking was opened up.** The three display classes were set at
−0.045 / −0.035 / −0.03em to compensate for Bricolage's width. Nohemi is already
a tight grotesque — the reference sets its own bold section headings at just
−0.02em and its 80px hero at normal — so those values closed the counters and
made the type look cramped rather than *set*. Now −0.03 / −0.025 / −0.018em, with
line-height relaxed from 0.85 / 0.95 / 1.06 to 0.9 / 0.98 / 1.12 for the same
reason.

## Files

```
app/fonts/Nohemi-Light.woff2      300
app/fonts/Nohemi-Regular.woff2    400
app/fonts/Nohemi-Medium.woff2     500
app/fonts/Nohemi-SemiBold.woff2   600
app/fonts/Nohemi-Bold.woff2       700
app/fonts/Nohemi-LICENSE.txt
```

Loaded with `next/font/local`, so they are self-hosted, hashed and served from
our own origin — no render-blocking third-party request. **Do not add font
subsetting to the build:** the licence forbids modifying the files, and
`next/font/local` only copies and hashes them, which is why the current setup is
compatible.

## Checking it

```bash
node _shots/cdp.mjs shot \
  'file:///C:/Users/honey/Downloads/Opaarh%20copy/_shots/specimen/index.html' \
  _shots/specimen/specimen.png 1480 1700 6000
```

Renders Nohemi against Bricolage and Manrope at the hero's own setting, at
section-heading size, across all five weights, on both surfaces, over Manrope
body copy. `_shots/specimen/fonts/` holds a copy of the files for it to load.
