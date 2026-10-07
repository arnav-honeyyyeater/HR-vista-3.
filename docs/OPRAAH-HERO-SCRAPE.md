# OPRAAH HERO — LIVE SCRAPE (2026-10-06, from opraah.in directly)

Authoritative structure — scraped from the live site (HTML + computed styles + DOM geometry).

## Hero composition (exact)
1. **Wide panoramic banner image** — 1487×689 rendered (~2.16:1), src `edFQXgv8MBp5GLNti0beZsW5jw.png` (3016×1075 original). This is the hero's dominant visual — a wide "wall" of photos. object-fit cover, position 50% 50%.
2. **Massive white headline** — h1 "India's Only Creator - First Agency", Manrope, white (rgb 255,255,255), responsive scaling (base 24px → huge on desktop), line-height 88.8px at base. Appear animation: opacity 0.001→1, spring, bounce 0.2, duration 0.4s. Headline sits OVER/above the banner.
3. **Nearly-square secondary image** — 584×568, src `8YPz1O4DQ72bpLDOBuyQUiKHfQ.png` (1832×2043 original).
4. **Logo row** — small brand logos (~50×38, ~207×150) under the hero.
5. Nav: Work / IP's / Creator / What we do / Career + CTA.

## Other opraah facts (from scrape)
- Vertical 9:16 cards (168×300, 1200×1600, 1290×2796) live in the WORK/IPs sections — that's where the "arc wall" look actually belongs.
- Stats: "10,0000+ Campaigns Delivered", "10,0000+ Creators in Network", "1,0000+ Brand Partners Annually", "90+ years Building the Creator Economy".
- Footer: "Let's make something worth talking about." + Have a project in mind? + address/email block.
- All their animations: spring, bounce 0.2, duration 0.4–1.2s, opacity 0.001→1, y -150→0 for some elements.

## OUR HERO TARGET (HR VISTA 3.0)
Match opraah's hero EXACTLY in structure, with HR VISTA content:
1. Wide panoramic "wall" image (2.16:1) — dominant hero visual. Use the widest/most cinematic Flickr event photo, object-cover. KEEP the interactive 3D drum wall here (our upgrade over opraah's static image) but tune it to this panoramic proportion: wider band, cards ~4:5 to 3:4 aspect (NOT tall 9:16), more slots, so the band reads as a wide curved wall like their banner. FIXED curvature: viewer INSIDE the drum — edge cards larger/closer, rotated inward, center recedes (the convex big-middle version was wrong and looked odd).
2. Massive white headline, Manrope, tight tracking, huge display scale: "The Future of Work." / "The People Who Shape It." — 2 lines, ~90% viewport width.
3. Secondary image (nearly square) — Flickr crop, placed like theirs.
4. Logo row (partners/sponsors) under hero.
5. Retro perspective grid floor (user loves it — keep, visible, bottom third).
6. Eyebrow caption: "HR VISTA 3.0 · 21–22 NOV 2026 · BKC, MUMBAI".

## Interactivity (our upgrade — opraah's hero is static, ours must be alive)
- Drag the wall to rotate, momentum/flick on release (apply transform IMMEDIATELY in the pointer handler, not only in rAF — rAF is throttled in background tabs, which made the wall feel dead in testing).
- Slow auto-rotate, pause on hover, resume after ~2s idle.
- Per-card hover: scale 1.05 + brighten, 0.35s.
- Mouse-follow subtle tilt (±3deg).
- Keyboard arrows nudge a slot.
- prefers-reduced-motion: static.

## KNOWN BUG to fix
Hero.tsx onKeyDown sets an ABSOLUTE transform (rotateY(±13deg)) instead of nudging baseAngle — arrow keys snap to a fixed angle. Route keyboard through the same baseAngle/flick system as drag.
