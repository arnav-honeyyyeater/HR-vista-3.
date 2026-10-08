# HR VISTA 3.0 — Lavasa roots, Mumbai horizons

Next.js 15 / React 19 / TypeScript. The original interactive opening hero is preserved. The rest of the homepage is a scroll narrative: Lavasa → globe and regional map → Mumbai → editions 1.0, 2.0 and the planned 3.0 → brochure.

## Run

```powershell
npm install
npm run dev -- --hostname 127.0.0.1 --port 3005
```

Open http://127.0.0.1:3005.

```powershell
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
npm run start -- --hostname 127.0.0.1 --port 3005
npm run check:preview
```

## Pages and behavior

- `/`: dark CHRIST / HR VISTA intro (once per session, skippable), shutter reveal into the draggable photo wall, three travel chapters, edition timeline, people, scroll-driven sponsor staircase, closing download action.
- `/sponsors`: sponsor concepts, the same 3D staircase, and a live brand-name preview. Confirmed sponsors remain to be announced.
- `/#lavasa`, `/#journey`, `/#mumbai`, `/#editions`, `/#edition-1` through `/#edition-3`, `/#next`: direct story links.
- `/work`: chronological archive with original edition photography, photo selection and native-dialog lightboxes.
- `/brochure?page=11`: complete 12-page reader, deep links, keyboard navigation and zoom.
- `/brochure/HR-VISTA-3.0.pdf`: downloadable document rebuilt without cropping from the supplied brochure page PNGs. It is image-based; text summaries are available in the reader.

`Journey.tsx` orchestrates the story with GSAP ScrollTrigger; `JourneyGlobe.tsx` is a lazy-loaded Three.js enhancement. The regional map is an original schematic, not a road route or an exact entrance location. Globe boundaries come from Natural Earth (see the provenance note in `public/media/journey`).

Important content and controls stay in HTML. Reduced motion skips the intro, removes automatic movement and presents the route without scroll scrubbing. WebGL creation failure leaves the CSS globe and SVG map available. Rendering pauses when offscreen or the tab is hidden; GPU work stops once the map replaces the globe. Native page scroll drives the timeline alongside the existing Lenis provider.
The globe's logos are hidden until a quick back-and-forth shake. Both marks appear together, then dissolve into drifting slices. Space/Enter on the globe and the “Give it a shake” button offer the same discovery. Reduced motion keeps a static, temporary reveal and presents sponsor cards as an ordinary gallery; changing the preference also stops wall autoplay and smooth scrolling immediately. See `docs/MOTION-REFINEMENT.md` for the triggers and browser verification.

## Content

Existing brochure facts are retained: 21–22 November 2026, Jio Grounds, BKC, Mumbai. Participation figures are expected, not confirmed attendance. All event photographs show historical editions and are captioned accordingly. No registration/contact API changes or deployment are included.

## Brochure rebuild

Run `python scripts/build-brochure.py` with Pillow and ReportLab installed. The output is the static public PDF; all 12 supplied pages retain their original proportions and resolution. Use Poppler to inspect the exported document.

Development and production outputs are separate (`.next` and `.next-production`), so a live development preview cannot overwrite production JavaScript bundles. Run `npm run check:preview` against the running production preview to verify routes, bundles and the PDF download. Detailed browser evidence and verification limits are recorded in `docs/JOURNEY-QA/VERIFICATION.md`.
