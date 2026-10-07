# WAVE 1a — opraah.in 1:1 CLONE (HR VISTA 3.0)

Author: mimo-v2.6-flash subagent · 2026-10-06
Scope owned: `app/**`, `components/site/**` (nothing else touched).

## What was rebuilt

The landing page is now a structural 1:1 replica of https://opraah.in/ with HR VISTA 3.0
content — same section order, same hero composition, same dark/light rhythm, same type
treatment and spacing language.

### Section order (matches the reference exactly)

| # | Section | File | Surface |
|---|---|---|---|
| 1 | Hero — stacked repeated headline rows + media card | `Hero.tsx` | dark `#060606` |
| 2 | Story — "We started in Feb 2025 / With One belief" + parallax collage | `StoryJourney.tsx` | light `#ffffff` |
| 3 | Stats counters + floating media band | `StatsCounters.tsx` | dark |
| 4 | Brand logo marquee (2 rows, opposite directions) | `PartnerMarquee.tsx` | light |
| 5 | "Things we're **Magnificent** At Doing" | `WhatAwaits.tsx` | dark |
| 6 | "THINGS WE'RE… AH… NOT SO GREAT AT…" alternating-type list | `FlavorList.tsx` | light |
| 7 | Big statement + full-bleed scrubbed media | `StatementStrip.tsx` | dark |
| 8 | "Our Work" case cards (marquee titles + hover media) | `PastEditions.tsx` | light |
| 9 | "Our IPs" carousel + "We don't just run a conclave…" | `SignatureMoments.tsx` | dark |
| 10 | Magazine flip — "Flip through it. Trust us." | `BrochureFlip.tsx` | light |
| 11 | Founders → organisers (monogram cards) | `Organisers.tsx` | dark |
| 12 | "There's a seat for everyone" sticky panels | `WhoIsInTheRoom.tsx` | light |
| 13 | Hiring cards → "Get involved" | `GetInvolved.tsx` | dark |
| 14 | Reviews slider | `ReviewsSlider.tsx` | light |
| 15 | Footer — "Let's make something worth talking about." | `SiteFooter.tsx` | dark |

Plus `SiteHeader.tsx` (fixed bar: lockup / centred nav / white "Register" pill — the
reference's exact header geometry) and `Reveal.tsx` (shared entrance primitives).

### Hero composition (the part that had to match)

- **6 stacked repeated rows**: 3 × `The Future of Work — The People Who Shape It`
  (white / gray / blue) over 3 × `HR VISTA 3.0` (solid / outline / solid).
- Each row repeats its phrase horizontally to fill the width and **drifts left/right
  against scroll** (±90px, alternating direction), clipped by `overflow: hidden`.
- Perspective floor grid (CSS, `pointer-events: none`, own layer) behind it — the
  reference's hero graphic, rebuilt instead of hotlinked.
- Date / venue / institution + `Register now` + `View brochure` pills and the
  **hero media card** (wide `hero-1` + portrait `hero-2`) sit in their **own grid row
  below the text block** — structurally impossible to overlap the headline.

### Palette — opraah's own values (no navy, not all-dark)

`--ink-900 #060606` · `--ink-800 #101010` · `--ink-700 #1f1f1f` · `--royal-500 #222fff`
· `--royal-400 #4b52ff` · `--royal-300 #9ba0ff` · `--sky-100 #f4f4f4` · `--paper #ffffff`
· `--mist-400 #888888` · `--mist-200 #d8d8d8` · `--signal #ff5722` (tiny accent only).

Sections alternate dark → light exactly as the reference does; every surface is opaque.

## Bug rules (plan §2) — how they're enforced

- **Zero text-on-text**: measured, not assumed — see verification below.
- **Sticky panels can't ghost**: every panel in `WhoIsInTheRoom` carries an explicit
  opaque `backgroundColor` (alternating `#ffffff` / `#f4f4f4`), **no opacity animation
  on panels**, and increasing `z-index`, so panels cover each other cleanly. The section
  also had `overflow: hidden` removed (it would have silently broken `position: sticky`).
- **Decorative lockups**: all giant type (`HR VISTA`, `3.0`, `CPCG`, `•`) lives in a
  `.deco` layer — `position:absolute; inset:0; z-index:0; pointer-events:none;
  user-select:none` — while content sits in `.sec-layer { z-index: 1 }`.
- **Marquees**: every one wrapped in `.bleed { overflow: hidden; width: 100% }`.
- **Parallax**: bounded to its own band (≥64px gutters, travel capped at ±32–36px) so
  media can never travel into copy.
- **`z-index`**: header 50, panels 1..4 inside their own section, deco 0, content 1.
- **390px**: no horizontal scroll (`document.scrollWidth === clientWidth`), mobile
  hamburger panel is opaque and full-height.

## Verification (real runs)

- `npm run build` → **exit 0** (Next 15.5.27, `/` prerendered, `/icon.svg` route added).
- Live page (`localhost:3000`) DOM audit:
  - **215 text-bearing elements → 0 visual overlaps** (clip-aware: each element's box
    intersected with every `overflow:hidden` ancestor first).
  - **0 hidden reveals, 0 clipped mask lines, 0 horizontal overflow.**
  - Stats render `500+ / 2 / 50+ / 3` (never stuck at `0`).
- Screenshots reviewed at hero and at the sticky-room section: no ghosting, no
  text-over-text, no broken media, strong contrast.
- All 21 `/media/flickr/*.jpg` files verified **HTTP 200**; brochure pages `/brochure/page-01…10.png` present.
- Remote-asset grep across `app/**` + `components/site/**`: **zero** `http(s)://` and
  zero `/media/raw/` references.

### One real defect found & fixed

IntersectionObserver **never fires in a hidden/background document** (headless screenshot
tooling, restored background tabs). Because every entrance used `whileInView`, the whole
page sat at its initial state — masked lines clipped away, reveal blocks at `opacity 0`,
counters at `0`. Fixed with a two-part safety net:

1. `RevealSafety` (mounted in `app/layout.tsx`) probes IO after mount; if no entry
   arrives within 1.2s it adds `force-reveal` to `<html>`, and removes it again if the
   document later becomes visible.
2. `html.force-reveal [data-reveal] { opacity:1 !important; transform:none !important }`
   in `app/globals.css` pins every reveal target to its final state.
3. `StatNumber` (in `StatsCounters.tsx`) has its own 1.5s fallback that jumps straight
   to the final value instead of waiting for rAF (also paused in hidden documents).

Normal visitors still get the full scroll-triggered motion; broken environments get a
correct static page instead of a blank one.

## Files changed

**New**
- `components/site/Reveal.tsx` — `Reveal`, `RiseLine` (masked rise), `RevealSafety`
- `app/icon.svg` — brand favicon (kills the `/favicon.ico` 404)

**Rewritten**
- `app/globals.css`, `app/page.tsx`
- `app/layout.tsx` (mounts `RevealSafety`, refreshed metadata)
- `components/site/`: `SiteHeader`, `Hero`, `StoryJourney`, `StatsCounters`,
  `PartnerMarquee`, `WhatAwaits`, `FlavorList`, `StatementStrip`, `PastEditions`,
  `SignatureMoments`, `BrochureFlip`, `Organisers`, `WhoIsInTheRoom`, `GetInvolved`,
  `ReviewsSlider`, `SiteFooter`

**Untouched (ownership respected)**
- `components/ui/*` (used `Marquee` + `FlipBook` only, prop interfaces unchanged)
- `components/providers/*`, `lib/data/*`, `public/media/*`, `public/brochure/*`

## Notes / deviations

- **Image slot reuse**: the manifest has no `moments-*` files, so `SignatureMoments`
  borrows `story-4`, `story-5`, `editions-2`, `editions-4`. `hero-3.jpg` is currently
  unused. Every reference is a canonical `/media/flickr/<name>` path.
- **Fonts** stay Bricolage Grotesque + Manrope (standing in for Nohemi/Manrope), per plan.
- **"Get involved" cards** use the brochure's own participation routes
  (`content.getInvolved`, verbatim) with the Volunteer / Partner / Speak framing the
  directive asked for — no invented facts.
- **Organisers** are typographic monogram cards (no portraits exist in the sources).
- **Reviews** are the three attributed HR VISTA 2.0 quotes from `content.reviews`.
- Marquee count kept to 3 systems (brand rows, edition titles, review dots/slider) —
  no opacity flicker or looping jitter anywhere.
