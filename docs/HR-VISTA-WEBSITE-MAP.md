# HR VISTA 3.0 — WEBSITE MAP & AGENT REFERENCE

Last updated: 2026-09-24
Status: Redesigned and verified
Source of truth: `public/docs/HR 3.0.pdf` and `lib/data/eventData.ts`

## Project

- Path: `C:\Users\honey\OneDrive\Desktop\Hr vista preview`
- Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, Canvas 2D Thinking Orbs, canvas-confetti, Zod, file-backed JSON storage.
- Dev command: `npm run dev`
- Production check: `npm run build`
- Desktop launcher: `C:\Users\honey\OneDrive\Desktop\Start HR VISTA 3.0.bat`
- Local URL: `http://localhost:3000`
- The launcher changes into the project directory, starts `npm run dev` in a separate server window, and opens Chrome.

## Event facts

- Event: HR VISTA 3.0
- Theme: The Future of Work. The People Who Shape It.
- Dates: 21–22 November 2026
- Venue: Bandra Kurla Complex, Jio Grounds, G Block, Mumbai
- Organizer: Centre for Placement and Career Guidance (CPCG)
- Institution: CHRIST (Deemed to be University), Pune Lavasa Campus, The Analytical Hub
- Brochure: `public/docs/HR 3.0.pdf`
- Brochure API: `/api/brochure?action=inline` for reading and `?action=download` for downloading.

## Active page flow

`app/page.tsx` is a client component and composes the redesigned page in this order:

1. `SiteHeader` — `components/site/SiteHeader.tsx`
   - Fixed editorial header with official logo, mobile menu, brochure link, and registration CTA.
2. `Hero` — `components/site/Hero.tsx`
   - Event title, date, venue, CTAs, scroll-linked parallax, progress rail, restrained Thinking Orb.
3. `Manifesto` — `components/site/Manifesto.tsx`
   - Brochure-based event purpose, four principles, and 1.0 → 2.0 → 3.0 journey.
4. `MetricsSection` — `components/site/MetricsSection.tsx`
   - Four brochure metrics through `AntiGravityBento` plus the seven-sector note.
5. `PeopleSection` — `components/site/PeopleSection.tsx`
   - Interactive delegate network, expected delegate profiles, experience pillars, and Thinking Orb.
6. `CampusVenueSection` — `components/site/CampusVenueSection.tsx`
   - Lavasa lake image as the primary campus image, central block image, campus facts, and BKC venue card.
7. `AudienceSection` — `components/site/AudienceSection.tsx`
   - Accessible five-tab audience/value section with keyboard controls.
8. `RegistrationSection` — `components/site/RegistrationSection.tsx`
   - Registration form, API submission, duplicate-email handling, ticket preview, and modal.
9. `SiteFooter` — `components/site/SiteFooter.tsx`
   - Logo, brochure, registration, partnership inquiry, event details, and image attribution.
10. `ContactModal` — `components/ui/ContactModal.tsx`
    - Partnership/sponsorship/speaker inquiry form and success state.

The active frontend is intentionally short. Legacy files under `components/navigation`, `components/sections`, and `components/landing` are retained as historical source but are not the active page import tree.

## Active design system

- Concept: warm editorial / “The Red Thread”.
- Palette: paper `#F4F0E7`, ink `#191A17`, clay `#B13C2A`, ochre `#D89A2B`, forest `#24483B`.
- Display font: Newsreader.
- Body font: Manrope.
- Metadata font: IBM Plex Mono.
- Styling lives primarily in `app/globals.css` with CSS custom properties and component classes.
- No synthetic blue, cyan, indigo, sky, or gradient treatment is used in the active redesigned frontend.
- Natural blue is allowed only inside the Lavasa lake photograph.
- No hotlinked production images are required. Local assets are under `public/images/`.

## Active components

| Component | Path | Purpose |
|---|---|---|
| SiteHeader | `components/site/SiteHeader.tsx` | Header, navigation, logo, mobile menu, CTAs |
| Hero | `components/site/Hero.tsx` | Main event introduction and CTAs |
| Manifesto | `components/site/Manifesto.tsx` | Event purpose, principles, journey |
| MetricsSection | `components/site/MetricsSection.tsx` | Scale and brochure metrics |
| PeopleSection | `components/site/PeopleSection.tsx` | People network, delegates, experience |
| CampusVenueSection | `components/site/CampusVenueSection.tsx` | Lavasa campus and Mumbai venue |
| AudienceSection | `components/site/AudienceSection.tsx` | Accessible audience tabs |
| RegistrationSection | `components/site/RegistrationSection.tsx` | Delegate registration modal and ticket preview |
| SiteFooter | `components/site/SiteFooter.tsx` | Institutional footer and contact actions |
| AntiGravityBento | `components/ui/AntiGravityBento.tsx` | Warm editorial metric bento with restrained tilt |
| MelonTicketCard | `components/ui/MelonTicketCard.tsx` | Ticket card, foil, pull-to-verify, reduced-motion-safe interaction |
| ContactModal | `components/ui/ContactModal.tsx` | Partnership inquiry form and dialog |
| ThinkingOrb | `components/ui/ThinkingOrb.tsx` | Re-export for the nested procedural Canvas orb |

## Data and assets

- Brochure-derived data: `lib/data/eventData.ts`.
- JSON persistence: `data/hrvista.json` through `lib/db/index.ts`.
- Official brochure: `public/docs/HR 3.0.pdf`.
- CHRIST logo: `public/images/logo-menu-3-2.png`.
- Primary campus photo: `public/images/campus/lavasa-lake.jpg`.
- Secondary campus image: `public/images/campus/christ-lavasa-central-block.png`.
- The lake image is locally stored and attributed in the footer to Sam0204, CC BY-SA 4.0, cropped. Confirm final publication permission/attribution requirements before launch.

## API map

### `POST /api/register`

- Validates `registrationSchema`.
- Stores registrations in `data/hrvista.json`.
- Returns a redacted public ticket object: ticket ID, name, organization, designation, category, industry, and status. Email and phone are not returned.
- Duplicate email returns HTTP 409 with a generic message and no existing record.
- `GET /api/register` intentionally returns HTTP 405; do not reintroduce public registration enumeration or ticket lookup.

### `GET /api/brochure`

- Streams the official PDF.
- `?action=inline` opens it in the browser.
- `?action=download` downloads it.
- Supports HTTP byte ranges for large-file streaming.
- `POST /api/brochure` accepts optional brochure lead data through `brochureDownloadSchema`; it does not return secrets or credentials.

### `POST /api/contact`

- Validates `contactInquirySchema`.
- Stores partnership/sponsorship/speaker inquiries in JSON storage.
- Returns an inquiry reference code.

### `GET /api/stats`

- Returns current stored registration/download/inquiry statistics.
- Do not add fabricated baseline counts or unregistered public PII to this endpoint.

## Accessibility and motion rules

- Registration and inquiry dialogs use `role="dialog"`, `aria-modal`, Escape-to-close, focus trapping, initial focus, and focus restoration.
- Success states have stable accessible titles.
- Audience tabs implement WAI-ARIA tab relationships, roving tab focus, Arrow/Home/End navigation, and labelled panels.
- Ticket verification is available by pointer and keyboard; reduced-motion users do not get trapped in a non-functional drag interaction.
- CSS and JavaScript effects respect `prefers-reduced-motion`.
- Keep focus-visible states and readable text contrast in any future edits.

## Verification record

Latest verified work:

- `npm run build` passes.
- TypeScript compilation passes with `npx tsc --noEmit`.
- Homepage returns HTTP 200 on local dev/production checks.
- Registration and contact POST flows were previously exercised successfully; temporary QA records were removed from JSON storage.
- Public registration list/lookup exposure was removed.
- Duplicate registration responses no longer disclose an existing registration.
- Active redesigned files have no blue/cyan/indigo/sky/gradient styling.
- Official logo integration is present in the header and footer.
- Desktop launcher exists at `C:\Users\honey\OneDrive\Desktop\Start HR VISTA 3.0.bat`.

## Agent operating rules

1. Read this map before modifying the project.
2. Verify current source after compaction; do not rely on the old pre-redesign documentation.
3. Preserve brochure facts and the local assets.
4. Keep the active page short and editorial.
5. Do not reintroduce public registration enumeration or duplicate-email PII disclosure.
6. Do not claim companies, speakers, sponsors, dates, or statistics as confirmed without source support.
7. Keep credentials, API keys, passwords, and secrets out of this document and all project memory.
8. After edits, run `npm run build` and `npx tsc --noEmit`.
9. Test APIs only with temporary data and remove QA records afterward.
10. If adding a launcher, write it to the real OneDrive Desktop path.

## Historical files

The old neon/cyan component tree remains in `components/navigation`, `components/sections`, and `components/landing` for history/backup purposes. Do not use it as the active design reference unless explicitly migrating a feature back into `components/site`.

## Verified update — 2026-09-24
- The active landing page is now a concise six-chapter event page: idea, scale, people, places, audience, registration.
- Active ThinkingOrb usage is removed. Remaining historical ThinkingOrb references are only in unused legacy components.
- Added a fixed scroll progress rail and viewport reveal transitions with reduced-motion handling.
- Added local Lavasa lake and Evolve sculpture images plus a Mumbai BKC skyline image.
- Added `/faculty-guests` as a preview-only directory for future faculty and guest LinkedIn cards. It contains no real person information.
- Verified with `npx tsc --noEmit`, `npm run build`, and HTTP smoke checks against the rebuilt dev server (home and preview route).
- Next review: confirm the live visual with a desktop/mobile browser pass and replace the preview placeholders when final names and LinkedIn URLs are available.

## Verified update — 2026-09-24 (visual polish)
- Reworked the active landing page toward a Linear/Apple-inspired visual system: near-black stage, warm paper sections, ochre accent, oversized type, precise rules, and fewer decorative effects.
- Added a fixed chapter rail for scroll navigation, hero copy parallax, viewport reveal transitions, hover lift on cards, and reduced-motion fallbacks.
- Kept content factual and brochure-backed; removed the interactive people network and repetitive metrics presentation from the active page.
- `npx tsc --noEmit` passes. `npm run build` passes. The rebuilt dev server returned HTTP 200 for `/` and `/faculty-guests`; the first request to the preview route compiled successfully, then both routes returned HTTP 200 in the server log.
- The browser backend timed out during one visual pass, so desktop/mobile screenshot review remains recommended before launch; the build and server route checks are verified.

## Verified update — 2026-09-24 (final active page)
- Active page source is clean of ThinkingOrb references: `app/page.tsx`, `components/site/Hero.tsx`, `Manifesto.tsx`, `MetricsSection.tsx`, `PeopleSection.tsx`, `CampusVenueSection.tsx`, `AudienceSection.tsx`, and `ScrollProgress.tsx`.
- The active page now uses the same professional visual system across all main sections, with no random per-section effects.
- Final checks: `npx tsc --noEmit` passed; `npm run build` passed; dev server log showed HTTP 200 for `/` and `/faculty-guests`.
