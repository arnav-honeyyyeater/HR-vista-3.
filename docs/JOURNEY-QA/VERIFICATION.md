# HR VISTA journey verification — 8 October 2026

## Completed

- Kept `Hero.tsx` and `Hero.module.css` unchanged (confirmed with Git diff); exercised its ArrowRight keyboard interaction.
- Replaced the old active homepage sections with Lavasa, travel, Mumbai, edition evolution and brochure finale. Removed the seven unused components from that composition.
- Built the lazy-loaded Three.js globe, scroll-scrubbed regional map and reversible route drawing; mouse movement adjusts the globe camera and map position.
- Restyled the historical archive and reading room, retaining captioned edition-specific photography, lightboxes, the 12-page reader and deep links.
- Built an image-based PDF from all 12 supplied brochure pages, preserving page proportions without cropping.
- Added independent development and production build directories after reproducing a concurrent-preview bundle failure. `.next` is development; `.next-production` is production.

## Checks passed

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --incremental false`.
- Production: `npm run build` completed successfully.
- Preview smoke check: `npm run check:preview` passed homepage, archive, brochure deep link, all 15 script bundles and a hash comparison of the served PDF with the source file.
- Browser inspection at 390px mobile, 768px tablet and 1440px desktop; additionally measured the 320px layout. No horizontal document overflow at these widths.
- Intro displayed in a fresh tab; Skip intro dismissed it; reload in that session did not replay it.
- Journey navigation, route drawing/reversal, edition links and selection, and Mumbai location disclosure exercised.
- Mobile navigation opened and links closed the panel correctly.
- Archive thumbnail selection changed the main photograph and caption. Lightbox next-photo navigation and Escape dismissal worked; focus returned to the opening control.
- `/brochure?page=11` selected page 11. Reading mode, zoom, Escape dismissal and focus restoration worked.
- The actual browser PDF download matched the generated file byte-for-byte. Pypdf confirmed 12 pages; Poppler rendered all pages for visual inspection.
- After build-output isolation, fresh production navigation from brochure → homepage → brochure completed with no console warnings or errors. No broken loaded images were observed.

## Evidence

Screenshots in this folder show desktop Mumbai and Lavasa, tablet Lavasa, desktop archive, desktop brochure, and mobile Mumbai. `brochure-proof.jpg` shows every exported brochure page.

## Limits

The available browser interface does not expose reduced-motion emulation or WebGL failure injection. Those paths were reviewed in code: reduced motion skips the intro and globe and keeps a static route; renderer creation failure retains the CSS globe; context loss hides the canvas and stops the renderer. No accessibility certification or frame-rate score is claimed.

The map is a stylised regional illustration. Venue and participation copy follows the existing supplied brochure; expected figures remain labelled as expectations. Work is local and has not been deployed.
