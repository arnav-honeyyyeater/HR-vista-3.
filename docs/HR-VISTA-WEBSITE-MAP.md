# HR VISTA 3.0 — Active website map

Updated: 7 October 2026 (Asia/Calcutta).

## Current scope

The user approved implementation, then requested a much more expressive Awwwards-inspired direction and clarified **design and browsing UX only, without registration**. The active design is **Human Signals**: ink/navy, cobalt, large typographic compositions, layered photographs, and meaningful pointer/scroll interactions.

The opening hero remains unchanged. No code is pushed to main. The working branch is `codex/hr-vista-interior-redesign`.

## Actual project

`C:/Users/honey/Downloads/Opaarh copy/hr-vista-3.0`

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, existing Nohemi/Manrope fonts. Older docs may describe unrelated routes/components/styles; inspect the current source.

## Routes and components

| Route | Active content |
| --- | --- |
| `/` | `Hero`, `EventOverview`, `EventExperience`, `AudienceValue`, `PastEditions`, `CampusVenue`, `JoinPanel` |
| `/work` | `EditionsArchive` with 2.0 then 1.0, photo galleries, `PhotoLightbox`, upcoming-edition panel |
| `/brochure` | `BrochureReader`, all twelve pages, explicit navigation, thumbnails, larger reading mode and zoom |

Header and footer are outside semantic main content. Each route uses `main#main-content` for skip navigation. Homepage chapters use `#overview`, `#experience`, `#audience`, `#work`, `#venue`, and `#join`. Archive anchors are `#hr-vista-2` and `#hr-vista-1`. `/brochure?page=1..12` supports document deep links.

There is **no active registration or enquiry form**. Existing `app/api/register`, `app/api/contact`, and `lib/data/store.ts` are inherited functionality, not part of this design iteration. Do not imply that the site sends mail, accepts bookings, or confirms attendance.

## Styling and motion

- The original root palette and hero files are preserved.
- `app/globals.css` adds scoped `.hv` containers, type, actions, and focus foundations.
- `HomeInterior.module.css` gives the homepage its compositions.
- `HomeMotion.tsx` provides bounded magnetic links, pointer fields, and scroll drift.
- Archive, brochure, lightbox, header, and footer use their own modules.
- Keep desktop effects bounded and support touch, keyboard, and reduced-motion alternatives.
- Keep all core information readable without waiting for motion.
- Native dialog viewers use focus containment, Escape, and focus restoration.

## Content and assets

The supplied source consists of twelve rendered brochure pages in `public/brochure/`. Shared metadata is `lib/data/brochure.ts`. No original PDF is present; do not advertise a PDF download.

Brochure facts:
- HR VISTA 3.0: 21–22 November 2026.
- Location: Mumbai, BKC, Jio Grounds.
- Presenter: Centre for Placement and Career Guidance (CPCG).
- Institution: CHRIST (Deemed to be University), Pune Lavasa Campus.
- 500+ professionals and 50+ organisations are projections, not live registrations.
- Speakers, sponsors, timed agenda, admissions, fees, and logistical arrangements must not be invented.

Historical photographs are documented in `docs/FLICKR-MANIFEST.md`. The redesigned archive separates February 2025 (1.0) from November 2025 (2.0). Do not use other-institution photographs as HR VISTA documentation. Caption Lavasa landscape imagery as location context, not as the Mumbai venue. The preserved hero's media has not been replaced.

## Verification

From the project:

```powershell
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
```

Browser validation should cover desktop and mobile layouts, programme and audience exploration, archive anchors and lightboxes, brochure page boundaries/deep links/zoom, navigation, focus restoration, and reduced motion. Verify that `Hero.tsx` and `Hero.module.css` remain unchanged.

No backend submission tests or data collection are needed for this design-only iteration. No deployment or Git push is authorised by this implementation request.
