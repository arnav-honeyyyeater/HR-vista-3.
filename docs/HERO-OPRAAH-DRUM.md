# HERO — the opraah.in drum, ported

Status: **shipped.** `components/site/Hero.tsx` + `components/site/Hero.module.css`.

This replaces the previous hero, whose tiles sat on a flat plane
(`translateX · translateZ(R)` with no per-tile rotation about the drum) and so
rendered as a straight, full-height band with no curvature, no fan and no
perspective. The measurements below are what fixed it.

---

## 1. Where the numbers came from

Nothing here is estimated. Three independent sources, all reproducible:

| Source | What it gave |
|---|---|
| `scrape/site/html/index.html` | the SSR markup: every panel's inline `transform`, the container size, the grid plate |
| `_shots/…` CDP probe of the **live** site | computed geometry — panel bounding quads, layer stack, type metrics |
| `Q_Nd6DKaPslVI401AUHTGdCMKkqROqtvqmpI6oXYvC4.nVqqpBdJ.mjs` (in `opraah-clone/`) | the carousel component's **own source** — props, defaults, spring constants, drag ratio |

The component source is the important one; it settles questions that measuring
the DOM cannot (see §4).

### The reference component, decompiled

```js
rotation = useMotionValue(180)
rotateY   = useSpring(rotation, { stiffness: 100, damping: 30 })

// drag
onMouseDown:  startX = e.clientX; startRotation = rotation.get()
onMouseMove:  rotation.set(startRotation - (e.clientX - startX) * 0.5)

// panels
F = 360 / images.length                       // 12 → 30°
<motion.div style={{
  rotateY: i * -F,
  transformOrigin: `50% 50% ${radius}px`,
  translateZ: -radius,
  backfaceVisibility: 'hidden',
  overflow: 'hidden',
}} animate={{ y: [0, -15, 0] }}
   transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }} />
```

Framer-motion emits `translateZ` before `rotateY`, which is why the SSR markup
reads `transform: translateZ(-570px) rotateY(-30deg)`.

### Measured geometry, per breakpoint

| viewport | window | perspective | radius | far-panel scale |
|---|---|---|---|---|
| ≥ 1200px | 300 × 420 | 500px | 570px | 500/1070 = **0.467×** |
| 810–1199px | 300 × 290 | 500px | 420px | 0.543× |
| < 810px | 140 × 230 | 500px | 270px | 0.649× |

### Measured composition at 1708 × 962

| Layer | Rect (page px) | As a fraction of the hero |
|---|---|---|
| grid plate | `-120, 317, 1948 × 689` | top 33.0%, height 71.6%, bled 120px each side, opacity **0.32** |
| drum axis (window centre) | `854, 336.5` | top **35.0%**, horizontally centred |
| copy block | `36, 647, 1636 × 299` | top **67.3%** |
| eyebrow | 24px Manrope 400, line-height 88.8px | — |
| headline | 80px Nohemi Medium 500, line-height 80px | — |

Their headline appears over `translateY(-150px)` → `0` on a spring; the eyebrow
just fades (`opacity 0.001 → 1`, bounce 0.2, 0.4s).

---

## 2. Why the projection looks the way it does

The window is **300 × 420** on a 1708px viewport. Everything you see comes from
the projection, not the box:

- `perspective: 500` with `radius: 570` puts the viewer's eye essentially **on
  the drum's axis**.
- The panel opposite the eye is `500 + 570 = 1070px` away → drawn at 0.467×.
  That is the small panel in the middle.
- Panels level with the eye sit at depth 500 → drawn at 1.0×.
- A panel at exactly ±90° is seen nearly **edge-on while sitting very close**,
  so it smears into the enormous panel filling each end of the wall. At 1708px
  that one panel's quad measures **376 × 600** — its top edge runs from y≈36 at
  the near end to y≈175 at the far end.

Confirming that last point mattered: the huge side panels are *edge-on*, not
face-on. Enlarging the window or the panel count to "fill" them would flatten
the effect.

---

## 3. The two things the reference gets away with, and we do not

**a. `backface-visibility: hidden` does not cull.** The math says a panel whose
accumulated Y-rotation passes 90° has its back to the viewer and should vanish.
Blink paints it anyway when it happens to sit in front of the eye. On desktop
this is invisible, because there `radius > perspective` and the near wall is
behind the eye and clipped. On phones `radius (270) < perspective (500)`, so the
near wall is *in front of* the eye and sweeps across the screen as giant flat
portraits. The hero culls explicitly instead, from the angle it already tracks
(`cull()` in `Hero.tsx`), with the bound **inclusive at ±90°** so the edge-on
panels survive.

**b. A 12-gon only fills the frame at multiples of 30°.** At a framing, one face
is exactly edge-on and reaches the screen edge. Half a step off (15°), the
outermost face still facing the viewer sits at 75°, projects ~270px short, and
the wall retreats from both edges into a centred band on black. The reference
never turns, so it never hits this. Ours steps **between** framings and always
lands on one, and a drag release snaps to the nearest framing — otherwise the
wall can come to rest short of both edges.

An earlier build of this hero drifted continuously. It looked correct in a still
and wrong in motion, for exactly this reason.

---

## 4. What is deliberately different

| | Reference | Here | Why |
|---|---|---|---|
| Drum motion at rest | none | one framing every 4.6s | their panels are video; ours are stills |
| Drag release | rests wherever released | snaps to nearest framing | see §3b |
| Panel content | 12 videos | 12 photographs | HR VISTA has no video assets |
| Panel life | the video itself | + slow push-in (`scale 1.02 → 1.1`, 30s) | a still wall under a moving drum reads as a screenshot |
| Display face | Nohemi Medium | Bricolage Grotesque | HR VISTA's own brand face wins |
| Surface | flat black | ink-navy, faded out over the last 20% | brand colour without a seam into the next section |
| Keyboard | none | ←/→ step a framing | the drum is otherwise pointer-only |

Panel images are chosen against two rules: **no panel may be carried by text**
(a 5:7 crop slices signage mid-word as the drum turns — several first-pass
choices had to go), and landscape/portrait sources alternate so no two
neighbours read alike.

---

## 5. How to re-verify

```bash
# reference geometry, live
node _shots/cdp.mjs eval 'https://opraah.in/' _shots/probe-opraah.js 1708 962 9000

# our composition, frozen at the reference's own resting framing
$env:MEDIA_REDUCED_MOTION='1'
node _shots/cdp.mjs shot 'http://localhost:4310/' _shots/vista/frozen.png 1708 962 7000

# drag: ratio, spring, detent
node _shots/cdp.mjs drag 'http://localhost:4310/' '' 1708 962 5000
```

Expected: `before 180°`, `during ≈ 238°` for a 200px drag (0.5°/px), `after 270°`
(framing), **5 of 12** panels hidden at rest. `MEDIA_REDUCED_MOTION=1` two frames
apart must be pixel-identical.
