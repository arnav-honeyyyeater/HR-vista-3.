# DESIGN BRIEF v4 — Gallery-first, decluttered, alive (2026-10-06, Honey-approved direction)

Read these skill references BEFORE designing (they are the design authority):
- C:\Users\honey\AppData\Local\hermes\skills\frontend\scroll-driven-design\SKILL.md (+ its references/patterns.md, references/tooling.md)
- C:\Users\honey\AppData\Local\hermes\skills\creative\popular-web-designs\templates\framer.md (opraah's own design language)
- docs/REFERENCE-SHOTS/ (opraah.in screenshots) + docs/DESIGN_SPEC.md (captured tokens)

## 1. THE PROBLEM (user verdict on current build)
- Text is CLUTTERED (the 6 stacked repeated hero rows = wall of text, not opraah's controlled rhythm)
- Text appears LATE while scrolling (reveal-gated = feels broken)
- Not animated enough / animations feel dead
- Overall feels weird, not gallery-like

## 2. THE DIRECTION: GALLERY-LIKE, MEDIA-FIRST
Opraah's real formula (Framer design system): **the media IS the artwork** — big event photography as the structural centerpiece, text as sparse caption layer. Make it a GALLERY the user scrolls through.

- **Hero**: 2–3 headline lines MAX (e.g. one "HR VISTA 3.0" row + one theme row + date/venue eyebrow). Kill the repeated 6-row stack. Hero media collage = BIG (dominant, 55–65% of hero visual weight), overlapping card composition like opraah's. Register CTA pill.
- **Every section media-forward**: images/video tiles are the structure; words are minimal labels/captions (Framer rule: no decorative filler text). Cut body copy aggressively — short punchy lines only.
- **Gallery spine**: Story → horizontal-scroll gallery strip (vertical scroll drives horizontal movement of 5–6 big event tiles, scroll-driven pattern #4/5, skippable). Past Editions = big media tiles with marquee titles. Statement = full-bleed media. Room panels = photo backgrounds with name marquees. This is the "gallery landing page" feel Honey wants.
- **Declutter rule of thumb**: if a section has >40 words outside headings/captions, cut it. Big type, big images, few words.

## 3. NO LATE TEXT — EVER (hard rule)
- Every text element renders VISIBLE BY DEFAULT (visible in HTML/CSS without JS). Animations ENHANCE (12–32px travel, 400–700ms, expo-out) starting AFTER paint — never gate visibility on IntersectionObserver/whileInView.
- If a reveal is mid-flight when the user scrolls fast, text must still be readable (blur/opacity floors: min opacity 0.6 during travel, snaps to 1).
- Triggers: rootMargin generous (e.g. "0px 0px -10% 0px"), threshold low (0.05–0.15). "Appears late" = defect.

## 4. REALLY ANIMATED (with motive — not everything)
Toolkit already built: components/ui/* (ScrollVelocity, DriftRow, MaskedText, Counter, Marquee, MediaTile, ParallaxStack, StickyStack, FlipBook). Wire them with taste per scroll-driven-design patterns:
- Hero media cards: gentle continuous float/parallax + hover lift (0.35s snappy).
- Gallery tiles: masked wipe-in reveals (clip-path inset), image scale 1.05 hover, subtle velocity skew on the strip.
- Story collage: 3-depth parallax (0.5/1/1.3).
- Stats: count-up + blur snap.
- Marquees (names/titles/logos): 34s loops, pause-on-hover, velocity skew — max 3 marquees page-wide.
- ONE sticky-stack moment max (WhatAwaits or Room) — chunky 0.94^n stack.
- Statement strip: scrub zoom 1→1.08 + slight velocity skew.
- Smooth scroll: Lenis lerp 0.1–0.15, synced with GSAP ticker.
- Reduced motion: complete static page, no hidden content.

## 5. TYPOGRAPHY (Framer-language, from framer.md)
- Display: tight negative tracking (hero ~-0.04em to -0.05em scaled to our sizes), weight 600–700, line-height 0.85–0.95.
- Body: Manrope 400–500, generous line-height for the few sentences that exist.
- Eyebrows: uppercase micro-labels with 0.18em tracking (dates, section tags).
- Palette stays opraah's: void black sections + white sections (their real mix), #222FFF blue accent, #888 gray, tiny #ff5722 warm micro-accent. Blue ring shadows on cards: rgba(34,47,255,0.15) 0 0 0 1px. Pill CTAs.

## 6. PROOF REQUIRED (no claims without these)
docs/QA-SHOTS-V4/: hero.png, gallery-strip.png, mid-scroll.png, room-or-sticky.png, mobile-390.png — real browser screenshots AFTER the build is served. Then npm run build must exit 0. Parent verifies screenshots before user hears anything.

## 7. LENGTH
User noted "site looks too long" — park the big restructure, but do this now: cut empty padding (no 20vh voids), let media tiles carry sections compactly, avoid double-stacked tall text sections. Target: sections feel dense-but-breathing, not stretched.
