# Scroll flight and opening refinement — 8 October 2026

The existing Next.js, GSAP, Three.js, Lenis and CSS stack is retained. No new
dependencies were added. This revision also fixes reload behavior and the
reverse-scroll overlap reported after the first flight implementation.

## Journey

The travel chapter now holds its copy in view while a custom SVG airplane
travels from Lavasa to Mumbai. The plane turns along the route tangent, a blue
trail draws behind it, and the flight rule and status follow the same progress.
The movement reverses with native scrolling. Motion writes directly to SVG and
DOM properties instead of scheduling React renders each frame.

One scene renderer now owns the globe, map and arrival visibility. The globe
fades completely before the map appears, in either scroll direction; hidden
layers also lose visibility and interaction. The map then recedes into a real
blue-hour Marine Drive photograph. The following editions section enters with a
rounded leading edge and an anchor offset for the fixed header.

The photo illustrates Mumbai as a city setting, not the event venue or BKC.
Dr Vikramjit Kakati's photograph is licensed CC BY-SA 4.0, resized and compressed
to a 323 KB WebP, with a responsive display crop. Source, author, license and
change notes are visible in the caption and saved in
`public/media/mumbai/attribution.json`. Source:
https://commons.wikimedia.org/wiki/File:Marine_Lines_Mumbai_2021.jpg

Tall phones use the same flight choreography in a stacked composition. Short
phones use natural scrolling so the action remains reachable. Reduced motion
removes flight pinning and presents a static completed route. Switching that
preference while viewing the page restores every paragraph and action; switching
back reinitializes the animation. Resize and font readiness refresh the scroll
measurements. All animation contexts, observers and listeners are cleaned up.

## Loading entrance

The drum settles behind the opening shutters without scaling or fading its
perspective container. Title lines enter once and retain their final pose when
the loader is removed. The intro keeps the scroll engine stopped and the main,
header and footer inert until the 1.4-second opening completes. Keyboard entry
returns focus to the drum. Idle drum motion begins after the handoff.

Each normal top-level visit and actual browser reload replays the entrance.
A reload from a scrolled URL such as `/#journey` clears the fragment and begins
at the drum; a fresh direct link retains its destination. A parser-time
bootstrap disables scroll restoration before the hero paints, and the client
holds the scroll position until entry completes. The bootstrap decision is
consumed once so later client-side links do not reuse stale reload intent.
Existing session storage no longer suppresses the transition.

Asset timeout, immediate entry and reduced-motion bypass remain. The no-JS
page immediately hides the intro and keeps the full content usable.

## Verification

- The production build, TypeScript validation and whitespace checks passed.
- Preview checks passed for the homepage, archive, brochure and sponsors;
  all 18 required JavaScript bundles and the complete brochure download loaded.
- Actual browser reload was verified with the former session flag still set,
  while scrolled at `/#journey`: loading, opening and entered all keep the page
  at zero scroll, then release focus/scroll onto the stable drum. Desktop,
  mobile, fresh direct links, reduced motion and no-JS checks passed.
- The user's open in-app preview was reloaded too: the loader appeared, the
  fragment cleared, and the drum entrance finished at the page top.
- Scene regression checks passed through nine forward/backward origin positions
  without any simultaneous globe/map opacity. Photo loading, credit access,
  mobile overflow and live reduced-motion changes passed with no exceptions,
  console errors or failed asset responses.
- Desktop/mobile screenshots include the real Mumbai photo, the reverse
  handoff and the loading curtain over the drum. The smaller preview width was
  checked to keep arrival copy separate from the photograph.

Reusable browser QA scripts and screenshots are in `output/playwright/`:
`reloadfix-check.js`, `scene-regression.js`, `reloadfix-*` and `fixed-*`.
Phone layouts were tested through browser emulation, not on physical devices.
