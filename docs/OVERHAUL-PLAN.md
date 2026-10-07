# HR VISTA 3.0 — OVERHAUL PLAN v2 (theme flip + bug kill + motion upgrade)

## DIRECTIVE v3 (Honey, 2026-10-06 — supersedes conflicting parts of v2)

**The landing page must be an EXACT 1:1 replica of https://opraah.in/** — same hero card and everything: same section order, same hero composition (the stacked headline rows + media card/collage), same layouts, same type treatment, same spacing, same motion choreography. The truth sources: `docs/REFERENCE-SHOTS/` (opraah.in screenshots), `docs/DESIGN_SPEC.md` (captured tokens/specs), and the live https://opraah.in/ when needed. Where this plan's earlier "reinvention" advice conflicts with what opraah.in actually does, the REFERENCE WINS.

- **Palette = opraah's own exactly** (their system is near-black `#060606` + electric blue `#222FFF` + white sections + gray `#888` + orange accent — a MIX of dark and light sections, not all-dark). Use their values and their dark/light section distribution. The earlier "too dark" complaint was because v1 made EVERYTHING dark navy; opraah itself alternates — replicate that distribution exactly.
- **Images: ALL from Flickr** (the only substitution). Use Flickr-sourced HR Vista / Christ Lavasa / BeingHR event photos into `public/media/flickr/` (see manifest). No framerusercontent assets, no other stock sources. If Flickr coverage is thin for a slot, pick the closest Flickr event photo — do not silently fall back to non-Flickr sources.
- Fonts: Bricolage Grotesque (display) + Manrope (body) stand in for their Nohemi/Manrope pairing (already in place).
- **Keep from v2:** the bug rules (§2: zero text overlap, opaque panels, no ghosting — non-negotiable) and the motion QUALITY bar (§3: scroll-scrubbed, hits hard, less annoying, reduced-motion safe) — but the choreography itself now copies opraah.in's exactly.
- Layout fidelity bar: someone comparing both sites side by side should see the same page. Structure, hero card, everything.

Author: main model (design authority). Execution: mimo-v2.6-flash + Space Bunny Alpha subagents.
Honey's feedback (2026-10-06 morning): site too dark, animations underwhelming, text-overlap bugs visible in the "Who's in the room" area. Direction: hit harder, make sense, less annoying.

---

## 1. THEME — flip to LIGHT "Daylight Paper"

The old build read dark-navy everywhere. New base is white/paper with royal blue as the signature.

Token replacement in `app/globals.css` (`:root`) and every color reference across `components/site/*`:

| Token | Old (dark) | New (light) | Use |
|---|---|---|---|
| `--paper` | #ffffff | **#fafbff** | page base (soft white-blue) |
| `--sky-100` | #e8f0ff | **#eef3ff** | alt section bg / panels |
| `--ink-900` | page base | **#0a1220** | display text, headings |
| `--ink-600` | (new) | **#3b4a63** | body text |
| `--ink-800` | section bg | **#f3f6fc** | card bg alt |
| `--mist-400` | #8a97ad | **#6b7a94** | muted text |
| `--mist-200` | #c7d2e0 | **#d5deed** | hairlines/borders on light |
| `--royal-500` | #2e5bff | **#2e5bff** | PRIMARY accent (unchanged — the signature) |
| `--royal-400` | #5b82ff | **#5b82ff** | hover/links |
| `--royal-300` | #9dbcff | **#9dbcff** | tints, decorative text |
| `--royal-50` | (new) | **#e8f0ff** | washes, badge bg |
| `--signal` | #ffb454 | **#ff9f1c** | tiny warm highlight only |

Rules:
- body bg = `--paper`, body text = `--ink-600`, headings = `--ink-900`.
- Cards: white bg, border `1px solid rgba(10,18,32,0.08)`, shadow `0 12px 40px rgba(46,91,255,0.08)`.
- `.text-outline` becomes ink stroke (`-webkit-text-stroke: 1.5px var(--ink-900)`).
- Marquee alternating text: `--ink-900` / `--royal-500`.
- Header: white/blur bg, ink text, royal CTA button (white text on `--royal-500`).
- Footer can go dark ONE time (ink-900 bg) as a closing anchor — everything above is light.
- Contrast AA min for all text. No pure black.

## 2. BUGS — kill the ghosting/overlap (seen in screenshot)

Root causes found in code:
1. **Sticky panel bleed-through**: `WhoIsInTheRoom.tsx` uses `h-svh sticky top-0` panels with inactive `opacity-40` — stacked sticky panels overlap and semi-transparent ones show the ones beneath = doubled headlines, ghost lists. FIX: every panel gets an OPAQUE background (`bg-[var(--paper)]` or alternating `--sky-100`), NO opacity fade on panels. Panel change = content-side transforms only (label/description fade+slide inside the panel).
2. **Giant "HR" lockup colliding with copy**: decorative lockup sits in the same layer as text. FIX: decorative element `select-none pointer-events-none`, absolutely positioned, low contrast (`--royal-50` on light), text column in its own grid column with higher z-index. Zero text-on-text allowed.
3. **List labels overlapping** ("1 — HR LEADERS" over "2 — ACADEMICIANS") = same bleed-through (#1). Fixed by opaque panels.
4. **Global audit pass** in the same wave: every section — no text-over-text, marquees wrapped in `overflow-hidden`, z-index sanity (header 50, modals 60, decorative -1), mobile 390px no horizontal scroll.

## 3. MOTION — "hit harder, make sense, less annoying"

Principles:
- ONE signature scroll move per section (not scattered fidgets). Progress-linked (scroll-scrubbed), so it feels physical and controllable.
- Bigger amplitude: travel 80–120px, scale 0.92→1, blur(4px)→0. Fast scroll = more skew (velocity-driven, max ~6deg), settles calm at rest.
- Entrances: expo-out `cubic-bezier(0.16,1,0.3,1)`, 0.7–1.0s, stagger 60–90ms. Hover: 0.35s, snappy.
- LESS ANNOYING: max 3 marquees on the page (Partners, names, editions title), 30–40s loops, pause on hover, NO opacity flicker/loops/jitter anywhere. `prefers-reduced-motion` kills all of it (static finals).

Per-section signature moves:
- **Hero**: masked line rise (big, deliberate) + slow media parallax (0.6x). Headline drift on scroll-velocity (subtle skewX ≤4deg).
- **Stats**: count-up with overshoot + blur→0 snap on the numbers, decorative media parallax 1.4x.
- **Story**: scrubbed parallax stack (3 depths: 0.5x / 1x / 1.3x), lines reveal on enter.
- **WhatAwaits (sticky stack)**: real physical stack — cards scale 0.94^n, rotate ±1.5deg, deepening shadows. This must feel CHUNKY.
- **WhoIsInTheRoom**: opaque slide-up covers (pinned), names marquee inside at 35s.
- **StatementStrip**: full-bleed media with scroll-velocity skew + slow zoom (scale 1→1.08 scrub).
- **PastEditions**: marquee titles with velocity skew; hover = media scale 1.05.
- **BrochureFlip / Reviews**: unchanged interaction, add entrance polish only.
- **Counters/Marquee/MaskedText/ParallaxStack/StickyStack primitives** get rebuilt to support the above.

## 4. AGENT WAVES (strict file ownership — no overlaps)

- **Wave 1a — THEME + BUGS** (mimo-v2.6-flash): owns `app/globals.css`, `app/layout.tsx`, `components/site/*`. Section 1 + 2 above. Do NOT touch `components/ui/*` internals (imports only).
- **Wave 1b — MOTION CORE** (mimo-v2.6-flash): owns `components/ui/*` ONLY. Rebuild primitives (Counter, Marquee, MaskedText, MediaTile, ParallaxStack, StickyStack + new `ScrollVelocity.tsx` util). Keep prop interfaces backward-compatible. No edits in `components/site/*`.
- **Wave 2 — INTEGRATION** (mimo-v2.6-flash, after 1a+1b): wire new primitives into `components/site/*`, implement per-section signature moves (section 3), full visual check.
- **Wave 3 — QA SWEEP** (Space Bunny Alpha): screenshot sweep 1440/390 every viewport, defect list, verify: light theme everywhere, zero text overlap, motion spec honored, reduced-motion static, `npm run build` 0, console clean. Fix round for anything found.

Definition of done: light daylight theme, zero ghosting/overlap, motion that hits hard on scroll and calms at rest, build green, all media local+credited.
