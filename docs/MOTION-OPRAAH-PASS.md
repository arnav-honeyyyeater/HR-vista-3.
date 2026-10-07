# MOTION — carrying opraah.in's animation across the whole page

Status: **shipped.** `app/globals.css`, `components/site/Reveal.tsx`,
`components/ui/HeadingWords.tsx`, `components/ui/ScrollRevealText.tsx`, and the
section components listed below.

Companion to [`HERO-OPRAAH-DRUM.md`](./HERO-OPRAAH-DRUM.md), which covers the
hero. This one covers everything else.

---

## What the reference actually does

Pulled from its SSR markup (every `data-framer-appear-id` and every inline
`opacity:0.001`) plus its Framer bundles:

| Device | Measured |
|---|---|
| Entrance travel | `translateY(±150px)` for a hero line, `+30px` for small blocks |
| Entrance opacity | `0.001 → 1` — a **full** fade, not a partial one |
| Spring | `bounce: 0.2`, duration `0.4–1.2s` |
| Per-word headings | every section heading enters word by word |
| Scroll-scrubbed statements | long copy lights up as the reader descends |
| Counters | stat numbers count up on entry, with an overshoot |
| Marquees | repeating display labels at the head of most sections |
| Sticky stacks | full-bleed panels that pin and accumulate |

The keyword counts in their bundles: `whileInView` 5, `viewport` 13,
`whileHover` 8, `whileTap` 9, `bounce` 69, `staggerChildren` 2.

---

## The gap, and the one change that closed most of it

HR Vista already had the *devices* — marquees, a sticky stack, scroll-scrubbed
statements, counters, a horizontal scrub. What it did not have was the
**boldness**, and there was a good reason for that:

> the reveal system travelled **24px from an opacity floor of 0.6** on an expo
> curve, because that floor was the only thing standing between a missed
> IntersectionObserver and invisible copy.

That is a solved problem now. `RevealSafety` already guaranteed an element in
view gets pinned within ~1.2s whatever the observer does, and it covers no-JS,
reduced motion and background tabs. **With the safety net holding, the floor was
only costing us the entrance.** So:

| | before | after |
|---|---|---|
| resting opacity | 0.6 | **0** |
| travel | 24px fixed | **`--rv-y`**, 44px default / 68px headings / 96px display |
| easing | expo-out, 0.55s | **bounce-0.2 spring**, 0.8s |

One CSS block, and every section on the page changed character.

### It is verified, not assumed

`_shots/probe-reveal-health.js` walks the whole document in half-viewport steps,
waits for each entrance to settle, and asserts that **no element which is
currently on screen is below 0.9 opacity**. Run against the new system:

```
samples: 382   invisibleOrHalftone: 0   notFullyRisen: 0
```

Under `prefers-reduced-motion` the same page reports `force-reveal` set, 161
reveal targets, and **0 not at their final state** — plain, full-opacity text.

---

## Per-word headings, now safe to use everywhere

`HeadingWords` was framer-motion with `initial="hidden"` and
`whileInView="show"` — which wrote `opacity: 0.35` and `filter: blur(4px)` into
the **server-rendered markup**. With JS disabled, still loading, or failed, every
heading using it sat washed out and blurred. That is the exact defect the reveal
system exists to prevent, which is why the component was only ever safe in two
places.

It is now built on the same CSS reveal system as everything else — `data-reveal`
spans with a shared `--rd` stagger and `--rv-y` travel — so it inherits every
guarantee for free:

- visible by default in the served HTML, with or without JS;
- only ever pended by `RevealSafety`, and only below the fold;
- pinned to final by the sweeper if an observer misses it;
- plain text under `prefers-reduced-motion`.

It also drops framer-motion out of every route that renders a heading:
**`/work` first-load JS 160 kB → 128 kB.**

**Now applied to:** Story, Gallery, Stats, Brands, What awaits, Not-so-great-at,
The idea, Past editions, Our IPs, Brochure, Organisers, Get involved, Reviews,
Footer, and the /work closing statement — 15 headings.

> Line breaking was also fixed in passing. The old component put a `&nbsp;`
> *inside* each word span, so a heading longer than its column could not wrap and
> overflowed. Words are now `inline-block` with a real space between them.

---

## The long statements now colour in, not just fade in

`ScrollRevealText` gained a `tint` prop — a `[unread, read]` colour pair
interpolated across the same scroll slice as the opacity.

This is worth copying from the reference for a plain readability reason: an
**opacity-only** sweep leaves the unreached words the same hue as the reached
ones, so the reader cannot tell *"not yet revealed"* from *"de-emphasised"*.

Supplying a tint therefore also defaults `floor` to **1** — the copy is fully
opaque the whole time and **colour alone** carries the sweep. The reader is never
mid-sentence on washed-out text.

Measured mid-flight on the Story statement, word by word down the line:

```
rgb(57,64,77)  rgb(71,78,92)  rgb(87,95,111)  rgb(104,114,132)  rgb(119,131,150)
opacity 1      opacity 1      opacity 1       opacity 1         opacity 1
```

A highlighter passing over the sentence, at full legibility throughout.

---

## What was deliberately left alone

- **Story's sticky statement** stays a scrubbed light-up rather than becoming a
  sticky *text-swap*. Both are reference devices; the scrubbed version is the
  one that makes sense for a paragraph someone is meant to read.
- **`#room`'s sticky stack** already is the reference's accumulate-and-pin
  device, at 3.7 screens for four panels.
- **Gallery's horizontal scrub** already works and was not touched.
- **The header** keeps its own subtle scroll state; the reference's nav is
  static and adding entrance motion there would only delay the one control a
  visitor may already be reaching for.

---

## How to re-verify

```bash
# every in-view element reaches full opacity, everywhere on the page
node _shots/cdp.mjs eval 'http://localhost:4310/' _shots/probe-reveal-health.js 1440 900 8000

# reduced motion: everything already final, nothing pending
$env:MEDIA_REDUCED_MOTION='1'
node _shots/cdp.mjs eval 'http://localhost:4310/' _shots/probe-reduced.js 1440 900 7000

# full-page review, one screenshot per viewport of scroll
node _shots/cdp.mjs walk 'http://localhost:4310/' _shots/vista/walk 1440 900 11000 0.9
python _shots/contact.py _shots/vista/walk _shots/vista/sheet.png 5 340
```
