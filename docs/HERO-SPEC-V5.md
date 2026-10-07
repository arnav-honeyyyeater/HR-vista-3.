# HERO SPEC v5 — "Opraah Arc Wall" (Honey's approved reference, supersedes Brief v4 §2 hero)

Reference image (Honey's screenshot of the real opraah.in hero): C:\Users\honey\AppData\Local\hermes\cache\images\img_9221e27eef7a.jpg — vision_analyze it if needed.

REPLICATE EXACTLY (content = HR VISTA 3.0, media = /media/flickr/ crops):

1. **Pure black void bg** (#050505–#060606). Nothing else behind the hero.

2. **Arc media wall (the signature)** — upper 55–65% of viewport:
   - 7–9 VERTICAL media cards (aspect ~9:16), on a CYLINDRICAL drum: container `perspective: 1000–1400px`, drum `transform-style: preserve-3d`, each card `transform: rotateY(i * ~9–12deg) translateZ(radius)` so the band curves like the inside of a drum (edge cards rotate inward + get clipped by the viewport edges; the band's bottom edge dips in the middle = gentle bowl curve — get this from the cylinder perspective naturally, or fine-tune with a slight per-card rotateX).
   - Cards: 8–12px radius, thin/no border, `object-cover` media. Slow continuous auto-rotation of the drum (one slot per ~4–6s), pause on hover; individual card hover = scale 1.05 + brighten, 0.35s snappy. Drag/scroll may nudge rotation (optional). `prefers-reduced-motion` = static arc, no rotation.
   - Media: VERTICAL crops of the Flickr event photos (9:16 via object-cover with tuned object-position). Use portraits/people/stage/crowd energy shots — creator-clip vibe like opraah's vertical video cards. Swap in hero-*/story-*/editions-*/room-* crops.

3. **Caption + massive headline** — centered below/inside the arc:
   - Eyebrow caption (small, silver/gray): "HR VISTA 3.0 · 21–22 NOV 2026 · BKC, MUMBAI" (or "The HR Conclave" variant).
   - Headline EXACTLY two lines, huge white display (clamp ~4.5rem–7rem), weight 700–800, tracking -0.03 to -0.05em, line-height 0.9–0.95:
     "The Future of Work." / "The People Who Shape It."
   - No other hero text. No 6-row stacks. No body paragraphs.

4. **Perspective grid floor** — below the headline, the classic synth/retro floor: repeating-gradient grid lines with `rotateX(72–80deg)` under `perspective`, vanishing point at the horizon behind the text; very subtle slow forward drift (reduced-motion = static). Dark-on-dark: grid lines rgba(255,255,255,0.10–0.16).

5. **Nav (like theirs)**: left = logo lockup "HR VISTA 3.0" with a small colored dot glyph (blue #222FFF or warm #ff5722 dot, white text); center = links (Editions, Moments, Brochure, Who Comes, Register — anchor links to page sections); right = white pill CTA "Register" (black text, 100px radius). Sticky, black/blur bg.

Layering: arc wall (z-0) → grid floor (z-0, below text) → caption/headline (z-10, crisp above) → nav (z-50). Text NEVER hidden pre-JS (brief §3 law).

This hero is the page's centerpiece — spend the craft here. Everything else in Brief v4 (gallery spine, declutter, late-text law, motion) stands.

## CORRECTIONS (user verdict on first attempt: "not interactable, looks kind of odd" — non-negotiable)

1. **CURVATURE IS INVERTED** (the main "odd" factor). Opraah = viewer INSIDE the drum: EDGE cards are LARGER and CLOSER, rotated INWARD toward center (left edge rotateY positive-in, right edge negative-in); CENTER cards recede (smaller). A convex carousel (big middle, small edges) is WRONG. The band's bottom edge reads as a gentle bowl.
2. **UNIFORM CARDS**: all cards identical width/height (~9:16), consistent gaps (~12–16px), consistent radius. No varying sizes/widths.
3. **INTERACTIVITY is required** (user: "this is not interactable"): (a) horizontal DRAG rotates the drum with momentum/inertia, grab/grabbing cursor; (b) slow auto-rotate resumes after ~2s idle, pauses on hover; (c) per-card hover: scale 1.05 + brighten + pointer cursor, 0.35s snappy; (d) optional subtle mouse-move drum tilt (±3deg). prefers-reduced-motion: static arc.
4. **GRID FLOOR must be VISIBLE**: fills the bottom third below the headline, white lines rgba(255,255,255,0.12–0.18), rotateX(72–80deg) perspective floor, horizon near headline baseline, subtle slow forward drift (reduced-motion static). A nearly-invisible grid is a defect.
5. Headline slightly BIGGER + tighter tracking (fill ~90% viewport width), exactly 2 lines + eyebrow.
