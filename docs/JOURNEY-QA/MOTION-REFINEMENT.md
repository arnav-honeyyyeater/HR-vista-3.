# HR VISTA scroll refinement

Implemented 8 October 2026. The opening photo-wall hero is unchanged.

## Choreography

| Chapter | Motion and composition |
| --- | --- |
| Lavasa → Mumbai | The camera descends toward western India, settling any visitor rotation. The regional map grows into the last part of that descent while the globe remains visible. Both layers share one reversible transition. Controls recede before the descent. |
| Hello, Mumbai | The photograph belongs to the Mumbai section and rises with the document. A smaller movement inside the photograph adds depth. On mobile, photography precedes the headline and venue details. |
| The evolution | A sticky progress rail follows three editions. Large edition numbers and orbital linework move with the scroll; photos open through masks while headlines assemble. The second edition reverses the desktop composition. |
| The human element | An ink-blue scene assembles seven initial nodes around a shared signal. Moving connections, ripples and kinetic lettering lead into a compact people directory. Initials remain graphic placeholders. A pause button controls decorative motion. |

Native scrolling, factual edition captions, qualified expectations, profile links, filters and unannounced guest information remain available. Reduced motion provides complete static content. Decorative people animations pause outside the viewport and in hidden tabs.

## Verification

- Production build: `npm run build` passed.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --incremental false` passed.
- `git diff --check` passed; `Hero.tsx` and `Hero.module.css` have no changes.
- Production preview: `npm run check:preview -- http://127.0.0.1:3006` passed for `/`, `/work`, `/brochure?page=11`, `/sponsors`, 17 JavaScript bundles and the complete PDF download.
- Browser inspection at 1280 × 720, 390 × 844 and 390 × 700: no horizontal overflow observed. Mumbai and edition photographs loaded successfully.
- Exercised forward/reverse globe and route scrolling, keyboard globe rotation before descent, edition anchors/active indicators, venue disclosure, people filters (7/4/3), pause/resume and desktop/mobile resizing.
- Corrected a resize-dependent GSAP centering issue in the signal scene, a possible globe momentum snap and an edition active-state problem on wide screens.
- No error or warning entries were returned by the browser console check after the final development reload.

The browser interface does not expose reduced-motion emulation or WebGL-failure injection. Those fallbacks and live-preference cleanup were reviewed in source. No frame-rate measurement or accessibility certification is claimed.
