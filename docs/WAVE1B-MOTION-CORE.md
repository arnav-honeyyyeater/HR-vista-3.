# WAVE 1b — MOTION CORE (`components/ui/*`)

Rebuild of the animation primitives for OVERHAUL-PLAN §3 ("hit harder, make
sense, less annoying"). Owner: Wave 1b. Files touched: **only** `components/ui/*`
(7 rebuilt + 2 new). No edits in `app/**`, `components/site/**` or `public/**`.

## Files

| File | Status |
|---|---|
| `components/ui/ScrollVelocity.tsx` | **NEW** — velocity utilities |
| `components/ui/DriftRow.tsx` | **NEW** — hero headline row drift |
| `components/ui/MaskedText.tsx` | rebuilt (in-view masked line rise) |
| `components/ui/Counter.tsx` | rebuilt (overshoot + blur→0 snap) |
| `components/ui/Marquee.tsx` | rebuilt (30–40s loop, optional velocity skew) |
| `components/ui/MediaTile.tsx` | rebuilt (1.05 / 0.35s hover, optional entrance) |
| `components/ui/ParallaxStack.tsx` | rebuilt (GSAP ScrollTrigger scrub) |
| `components/ui/StickyStack.tsx` | rebuilt (0.94ⁿ physical stack, scrubbed) |
| `components/ui/FlipBook.tsx` | kept interaction + entrance polish |

Every existing prop is unchanged and backward-compatible; all new props are
optional with defaults that reproduce the old behaviour where it matters.

## Motion primitives

### ScrollVelocity (new) — velocity source for the whole page
- `useScrollVelocity({ enabled }) → MotionValue<number>` in **[-1, 1]**
  (1 ≈ fast scroll ≈ 60px per 60fps frame). Own rAF loop on native
  `scroll` — Lenis scrolls the real window, so no Lenis instance access is
  needed; loop stops and resets to 0 when the scroll settles.
  Attack 0.35 / release 0.10 → fast while scrolling, calm at rest.
  `prefers-reduced-motion` ⇒ constant 0, zero listeners.
- `useVelocitySkew(maxDeg = 6, enabled) → MotionValue<number>` — springy
  skewX (overdamped, no bounce): scrolling down leans text forward.
- `useVelocitySkewStyle(max)`, `useVelocityY(amplitude)` — style fragment /
  vertical velocity nudge for media layers.
- `<ScrollVelocitySkew max={6}>…</ScrollVelocitySkew>` — wrapper that skews
  its children and settles flat. Reduced motion renders it statically.
- Exports: `MAX_VELOCITY_SKEW = 6`, `SUBTLE_VELOCITY_SKEW = 4`.

### DriftRow (new) — opraah hero choreography
Scroll-scrubbed horizontal drift for headline rows, alternating directions.

```tsx
<DriftRow index={0} distance={90} skew><MaskedText as="h1" …/></DriftRow>
<DriftRow index={1} distance={90}><MaskedText …/></DriftRow>
```

- `progress = clamp(-sectionRect.top / sectionHeight, 0, 1)`,
  `x = progress * direction * distance` — identical range to the old Hero.tsx
  `useScroll(target, ["start start","end start"])` scrub.
- Measured in a rAF-throttled scroll/resize listener (section resolved in a
  ref callback during commit → no target-tracking race; listeners cleaned up).
- Props: `distance` (default 80), `direction` / `index` (alternation),
  `skew` (velocity skewX ≤4deg), `desktopOnly` (default **true** — no drift
  frame on 390px), `targetRef`, `className`, `style`.
- Hook form: `useDriftX({ … }) → { ref, x, skewX }` for custom markup.
- Reduced motion ⇒ x = 0 and skew = 0.

### MaskedText — masked line rise
- Expo-out `cubic-bezier(0.16, 1, 0.3, 1)`, **0.9s/line**, stagger
  **75ms** (plan range 60–90ms), now revealed **on in-view (once)** instead
  of on mount, so below-fold headings actually animate.
- New props: `stagger`, `duration`, `blur` (blur(4px)→0 per line),
  `once`, `viewportMargin`, `onMount` (old fire-immediately behaviour).
- `MaskedLine` still exported (same contract + optional `blur`/`duration`).
- Reduced motion ⇒ variants start at the final state (instant, no blur).

### Counter — count-up with overshoot
- Fires once (IntersectionObserver, threshold 0.4), duration default 1400ms.
- Ease-out-back (~6% overshoot) + **blur(4px) → 0** snapping clear over the
  first 60% of the run, written imperatively so the digits land hard.
- New props: `delay` (s, for staggered grids), `className`.
- Reduced motion ⇒ final value immediately, no blur.

### Marquee — loop discipline
- Default loop **34s** (plan: 30–40s), `pauseOnHover` (default true —
  `.marquee-hover-pause`), no opacity/flicker animation anywhere.
- New props: `velocitySkew` (leans the strip with scroll velocity ≤ `maxSkew`),
  `maxSkew`, `pauseOnHover`. `items` / `speed` / `reverse` / `className`
  unchanged (callers passing `speed={18|22|30}` keep their values).
- Skew lives on its own wrapper so the `marquee-x` keyframe (translateX −50%)
  is never overridden; `app/globals.css` already kills the animation under
  `prefers-reduced-motion`.

### MediaTile — hover + optional entrance
- Hover zoom now **scale 1.05 / 0.35s** expo (was 1.06 / 0.6s), applied to an
  inner wrapper so **video and image both zoom**.
- New prop `entrance` (default false): scroll-in `scale 0.94 + blur(4px) → 1`,
  0.8s expo-out, once. `video` / `poster` / `aspect` / `hoverScale` unchanged.
- Reduced motion ⇒ no zoom, video does not autoplay.

### ParallaxStack — multi-depth scrub (GSAP ScrollTrigger)
- One ScrollTrigger per layer, container `start "top top"` → `end "bottom top"`,
  **`scrub: 1.1`**, y = `speed * distance` (`distance` prop, default **200px** —
  matches the old `speed * 200` behaviour, so existing `0.2 / 0.45 / 0.7`
  layers are unchanged; the new choreography can pass 0.5 / 1 / 1.3).
- Lazy-image `load` → debounced `ScrollTrigger.refresh()` so the scrub range
  never goes stale; `ctx.revert()` on cleanup removes triggers + transforms.
- Gates: md+ only (mobile stays in-flow/static) and reduced motion off.
- Plugin registered inside the effect (client-only); the module import was
  verified SSR-safe against plain-node import.

### StickyStack — chunky physical stack
- Pin: CSS `sticky` at `calc(stickyTop + i * step)` (defaults `12vh`, step
  **16px**) so every stacked card keeps a visible edge. Deliberately *not*
  ScrollTrigger `pin` — pin-spacers injected into React's DOM are the
  teardown bug the project already dropped GSAP pin for (see
  `docs/EXECUTION-PHASE1.md`); visuals are identical.
- Stack motion: one ScrollTrigger spans the container
  (`"top bottom"` → `"bottom top"`) and on every update each card's live
  coverage is measured from its rect:
  - `depth = Σ coverage of the cards above` → `scale = 0.94^depth`
  - `rotate = ±1.5deg` (alternating per card), saturating at full tilt
  - shadow deepens as cards stack beneath the top card
- Progress-linked ⇒ scrubbing back up restores the stack; geometry-derived
  values ⇒ no lag, no jank.
- New props: `stickyTop`, `step`, `shrink`, `rotate`.
- Reduced motion ⇒ no sticky, no transforms, no shadows — plain static flow.

### FlipBook
- Interaction untouched (3D rotateY, tap halves, dots, counter).
- New `entrance` prop (default **true**): rises in `y 40 → 0`,
  `scale 0.97 → 1`, 0.9s expo-out, once; disabled under reduced motion.
- Arrow keys now only act while the book is on screen (IntersectionObserver
  gate), so they no longer hijack the whole page.

## Reduced motion — one rule everywhere
Every primitive checks `prefers-reducedMotion` (framer's `useReducedMotion`)
and lands on the **static final state**: MaskedText at final position, Counter
at its final value, velocity/skew = 0, DriftRow x = 0, Marquee animation off
(via `app/globals.css`), MediaTile no zoom/autoplay, ParallaxStack and
StickyStack create no ScrollTriggers, FlipBook swaps pages instantly.

## Verification
- `npx tsc --noEmit` → **zero errors in `components/ui/*`**; the only errors
  in the repo are `app/page.tsx` "Cannot find module '@/components/site/…'"
  caused by Wave 1a's in-flight rewrite (site files were being deleted and
  re-created while this ran).
- `npm run build` → failed **only** on missing `@/components/site/*` modules
  (`ReviewsSlider`, `SiteFooter` at the last attempt) — nothing from
  `components/ui/*`. The rest of the ui graph (gsap/ScrollTrigger, framer,
  all imports) resolved and compiled through webpack without error.
- SSR smoke test: all 9 components compiled with `tsc` and rendered through
  `react-dom/server` in plain Node → `SSR_OK`, no `window is not defined`,
  no NaN (temp test file removed afterwards).
- gsap ESM/SSR import probe: `import("gsap/ScrollTrigger")` +
  `registerPlugin` succeeds in plain Node (v3.15.0).

## Notes for Wave 2 (integration)
- Hero rows: replace the hand-rolled `useScroll`/`useTransform` row drift with
  `<DriftRow index={n} distance={90}>` (alternating `index` gives ±direction),
  keep `MaskedText` inside it.
- Stats: `<Counter>` now overshoots and blur-snaps on its own — no wrapper
  needed; add `delay={i * 0.08}` for the staggered grid.
- Statement strip / editions titles: `<Marquee velocitySkew>` or wrap media in
  `<ScrollVelocitySkew max={6}>`.
- Story collage: pass `distance` and speeds 0.5 / 1 / 1.3 to ParallaxStack.
- WhatAwaits: `<StickyStack cards={…} />` works unchanged; tune with
  `shrink` / `rotate` / `step` if the chunkiness needs adjusting.
