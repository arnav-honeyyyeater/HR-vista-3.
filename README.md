# HR VISTA 3.0 — web build

A production Next.js build of the HR VISTA 3.0 site. Its **layout, spacing,
radii, type scale and motion are taken 1:1 from the `opraah.in` reference**; its
**palette, fonts and content are HR VISTA's own**.

```
hr-vista-3.0/
├── app/
│   ├── page.tsx              landing page (16 sections)
│   ├── work/page.tsx         editions archive  ← the second page
│   ├── globals.css           the design system (tokens + primitives)
│   └── api/                  brochure · contact · register
├── components/
│   ├── site/                 one file per page section
│   └── ui/                   reusable motion + layout primitives
└── lib/data/content.ts       the single source of all copy
```

## Run it manually or click the Start bat file!

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

---

## Where the design comes from

The reference folder shipped a document called `OPRAAH-HERO-SCRAPE.md` and a
`REFERENCE-SHOTS/` set. **`REFERENCE-SHOTS/00-hero.png` is a broken capture** — it
renders the nav and the headline but *no wall at all*. Building against it is
building against nothing, and an earlier pass of this hero did exactly that: it
grew into a tall draggable drum the reference does not have.

So the reference was measured directly instead, with the scripts in `../scrape/`:

| script | what it answers |
|---|---|
| `mirror.cjs` | mirrors the site's HTML + all 346 assets |
| `style-spec.cjs` | per-section padding, gaps, radii, colours |
| `type-scale.cjs` | the **complete type scale**, read from Framer's own `--framer-*` inline variables on 305 text elements |
| `hero-geometry.cjs` | the hero wall's tile-by-tile geometry on the live page |
| `copy-values.cjs` | layout values from the reference's inline styles |

### The hero wall — the one number that matters

The reference's hero is a real 3D cylinder, and it only works while the radius
stays **below** the CSS perspective distance:

```
scale = PERSPECTIVE / (PERSPECTIVE − RADIUS)
```

Set `RADIUS` to 1250 against a 1100px perspective and the divisor goes negative —
the tiles pass behind the eye and project to garbage, which renders as an empty
hero. The values in `Hero.tsx` (radius 1500) and `Hero.module.css`
(perspective 3600) are chosen together and must be changed together.

Each tile carries three chained transforms, in this order:

```
translateX(arc)  →  translateZ(RADIUS)  →  rotateY(−θ)
```

So the translate happens in the tile's own frame (a pure world-space move) and
the rotation then faces the tile back toward the camera. Tiles are placed on the
cylinder by **arc length**, which is what keeps them touching all the way round
instead of drifting apart at the edges.

**Confirmed working** (`scrape/verify-motion.cjs`): auto-drift, pointer drag,
release momentum, and ← / → keyboard nudge.

### The type scale

`scrape/type-scale.cjs` reads the reference's own typography straight out of its
markup, because Framer writes every text style as `--framer-font-size`,
`--framer-font-weight`, `--framer-line-height` on the element itself. The tiers
in `globals.css` are those measurements:

```
225px w800 · 200px w800 · 120px w500–700 · 103px w700 · 80px w500–600
 52px w800 · 36px w700 · 34px w700 · 28px w700 · 24px w500 · 15px w500 · 12px w500
```

---

## Design system

### Colour — HR VISTA (not the reference)

The reference runs `#060606` + `#ff5e00`. This build deliberately runs ink-navy +
royal blue instead. Opraah's *structure* is copied; its *identity* is not.

| token | value | role |
|---|---|---|
| `--ink-900` | `#0a1220` | page base |
| `--ink-800` | `#101b2e` | raised surface |
| `--royal-500` | `#2e5bff` | signature accent |
| `--paper` | `#ffffff` | light sections |
| `--mist-400` | `#8a97ad` | muted text |
| `--line-dark` / `--line-light` | 16% / 12% | hairlines per surface |

The two hairline tokens exist because light sections previously had to borrow a
mid grey, which made every divider look muddy.

### Radii, spacing, motion — the reference's numbers

`--radius-panel: 20px` (their most-used radius, 103 occurrences), `16px`, `10px`,
`--radius-pill: 100px`, `--radius-nav-cta: 39px`, `--nav-h: 64px`.
Motion eases are `--ease-expo` (Framer's signature) and `--ease-spring`
(their bounce-0.2 spring as an overshooting bezier).

### Type

Display is **Bricolage Grotesque** (`--font-display`), body is **Manrope**
(`--font-body`). The reference uses the paid Nohemi; Bricolage is the free face
with the same eclectic-grotesque character. Because Bricolage runs narrower,
display tracking is set ~0.01em looser than the measured value so the type
occupies the same width.

---

## Motion primitives (`components/ui/`)

| component | what it does |
|---|---|
| `AnimatedLetters` | per-glyph spring entrance, words kept unbroken, announced as one string |
| `HeadingWords` | per-word in-view heading entrance with a blur-in |
| `ScrollRevealText` | words light up as you scroll — the reference's long-statement motion |
| `Marquee` | infinite loop, velocity-reactive skew, pause-on-hover |
| `ScrollVelocity` | scroll velocity → skew / Y motion |
| `Counter`, `MaskedText`, `MediaTile`, `ParallaxStack`, `StickyStack`, `FlipBook` | supporting primitives |

And in `components/site/Sections.tsx`:

- **`SectionOpener`** — the reference's most repeated device: its own name set at
  display size, run as a marquee, with the real heading beneath.
- **`WatermarkBand`** — that band on its own, for sections that already have a heading.
- **`FullWidthTransition`** — the tall, single-sentence statement blocks that give
  the page its editorial pace.

## Rules this build holds to

- **No late text.** Copy is visible in the served HTML; motion only ever
  enhances it. `RevealSafety` may add a pending state *only* below the fold, with
  a 0.6 opacity floor and a 24px travel — never zero, never gated on a timer.
- **Reduced motion is complete.** Every primitive renders its final state; the
  audit asserts that nothing is hidden under `prefers-reduced-motion`.
- **No horizontal overflow** at any width from 360px to 1920px.

## Verification

```bash
node ../scrape/audit.cjs       http://127.0.0.1:3005/ home
node ../scrape/hero-check.cjs  http://127.0.0.1:3005/
node ../scrape/verify-motion.cjs http://127.0.0.1:3005/
```

The audit checks: uncaught exceptions, console errors, broken images, 4xx/5xx,
horizontal overflow across seven widths, a single `<h1>`, invisible text,
reduced-motion completeness, and alt coverage. It reports **10/10 passing** on
both `/` and `/work`.

## Deviations from the reference, and why

1. **Palette and fonts** — HR VISTA's, by instruction.
2. **Hero media** — HR VISTA's own event photography, not the reference's
   creator videos.
3. **The nav is opaque.** The reference is transparent over its dark hero; this
   page alternates dark and *white* sections, and white type on a white section
   is invisible.
4. **The wall's proportions are internally consistent.** The reference's own
   numbers disagree with each other — its tile positions imply one radius while
   its tile heights imply another. This build reproduces the *read* (small centre,
   two steps up either side, edges cropped) with formulas that agree.
5. **`prefers-reduced-motion` is honoured throughout**; the reference does not.

## Known gaps

- `/career` and the individual edition pages are not built. The design system and
  primitives they need are all in place; each is a section file plus a route.
- The reference's marquees and transitions are reproduced as motion; a few of its
  smaller decorative flourishes (the creator ticker, the looping avatar strip)
  have no HR VISTA content equivalent yet.
