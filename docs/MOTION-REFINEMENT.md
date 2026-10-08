# HR VISTA motion refinement — 8 October 2026

The existing Next.js, Three.js, GSAP and CSS stack is retained. The live
https://opraah.in brand section was inspected at several scroll positions: five
boards advance diagonally through a staircase and turn in perspective. The
HR VISTA interpretation uses the existing sponsorship concepts rather than
inventing a confirmed brand lineup.

## Opening

`ChristIntro.tsx` now renders a navy opening screen and waits for the visible
wall photographs and fonts to decode. The opening choreography has a one-second
minimum, a 2.8-second asset deadline and an immediate entry button. Seven
alternating shutters retract over the actual hero; the wall comes forward and
the two title lines enter through masks. The visible opening panels load eagerly.

The intro appears once per session, bypasses deep links and reduced motion,
restores scroll and keyboard access on entry, and removes its overlay when the
animation finishes. Without JavaScript, CSS opens the overlay after four seconds.

## Globe discovery

Logos no longer occupy the resting globe. Pointer movement must include three
direction reversals, legs of at least 22 pixels and total travel of 140 pixels
within 1.1 seconds. A normal drag only spins the globe.

The HR VISTA and CHRIST marks emerge together in tilted panels. Each logo has
twelve clipped slices that drift apart and blur away, with a small shockwave and
sparks. The reveal clears after 3.8 seconds and has a four-second replay cooldown.
Space/Enter and “Give it a shake” provide keyboard and tap alternatives. Reduced
motion presents both logos without spatial effects for five seconds. Logo
discovery remains available when the WebGL enhancement is unavailable.

## Scroll choreography

The photo wall recedes with scroll and the journey headings and supporting copy
enter in sequence. The Lavasa photograph has a small scroll-linked tilt.

Both the homepage and `/sponsors` use five sponsor concept boards in a native
sticky scene. Vertical and lateral travel, perspective rotation and an understated
progress rule follow scroll in both directions. The scene spans three viewport
heights on desktop and 2.5 on phones. Edge shading preserves the small labels and
the action as boards pass behind them. The brand-name editor updates the boards,
and the existing pause control freezes their motion. Reduced motion removes the
sticky travel and shows all five boards in a regular gallery.
The people directory, pointer tilt and sponsor preview use a hydration-safe
motion preference subscription. Their first client render matches the server;
CSS presents static cards immediately when reduced motion is enabled.

## Verification

- Production build, TypeScript and `git diff --check` passed.
- Production preview check: all four routes, 17 JavaScript bundles and the
  complete brochure download passed.
- Chromium screenshots inspected at 360, 390, 768 and 1440 pixels, including
  loader handoff, resting globe, reveal, dissolve, sponsor motion and reduced motion.
- Browser interactions verified ordinary drag, mouse shake, touch shake via CDP,
  keyboard replay, mobile menu, brand editing, scroll reversal, pause/resume,
  session-only loading, and live changes to reduced motion.
- A JavaScript-disabled browser confirmed the opening fallback releases the page.
- A reduced-motion development reload confirmed static people cards without
  hydration warnings on the homepage or sponsor page.
- Browser QA captured no page exceptions or failed asset responses in production.

Screenshots and the two browser QA scripts are under `output/playwright/`.
Touch was tested through browser emulation, not on a physical phone. Tailwind
scanning is explicitly limited to app, component and data sources; generated
browser logs and exports no longer cause a development rebuild loop.
