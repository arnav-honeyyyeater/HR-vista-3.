# HR VISTA 3.0 — Active website map

Updated: 7 October 2026, third iteration (Asia/Calcutta).

## Current scope

User-approved direction (final steer, 7 Oct 2026): **opraah.in's language** — modern, minimalistic, **animation-heavy, everything mouse-interactive**, media-dominant. Rejected earlier this day: the "Human Signals" interior (radar/orbit/stamps — too sharp) and a Frontier Dialogues editorial direction (Awwwards HM — too sharp; scraped reference kept at `C:/Users/honey/AppData/Local/hermes/cache/scratch/ref/`, NOT the design target). The design target is **opraah.in**: reference captures in `docs/REFERENCE-SHOTS/`, motion measurements in `docs/MOTION-OPRAAH-PASS.md`. Design and browsing UX only — no registration.

The opening hero (`Hero.tsx`, `Hero.module.css`) remains unchanged — the user fixed/likes it. No code is pushed to `main`. Working branch: **`feature/opraah-motion-interior`** (branched from `codex/hr-vista-interior-redesign`).

## Actual project

`C:/Users/honey/Downloads/Opaarh copy/hr-vista-3.0`

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, Lenis. Fonts: self-hosted Nohemi (display) + Manrope (body), see `docs/TYPE-NOHEMI.md`. Older docs may describe unrelated routes/components/styles; inspect the current source.

## Routes and components

| Route | Active content |
| --- | --- |
| `/` | `Hero` (untouched) + rebuilt `EventOverview`, `EventExperience`, `AudienceValue`, `PastEditions`, `CampusVenue`, `JoinPanel` + `SiteFooter` |
| `/work` | `EditionsArchive` with 2.0 then 1.0, photo galleries, `PhotoLightbox`, upcoming-edition panel (unchanged this iteration) |
| `/brochure` | `BrochureReader`, all twelve pages, navigation, thumbnails, reading mode and zoom (unchanged this iteration) |

Header and footer are outside semantic main content. Each route uses `main#main-content` for skip navigation. Homepage chapters use `#overview`, `#experience`, `#audience`, `#work`, `#venue`, `#join`; aliases `#story`, `#room`, `#organisers`, `#involved`, `#brochure` preserved. Archive anchors `#hr-vista-2`, `#hr-vista-1`; `/brochure?page=1..12` deep links.

There is **no active registration or enquiry form**. `app/api/register`, `app/api/contact`, `lib/data/store.ts` are inherited functionality, not part of this design iteration. Do not imply the site sends mail, accepts bookings, or confirms attendance.

## Design system (this iteration)

- `components/site/Interior.module.css` — interior system (replaced deleted `HomeInterior.module.css`, `SiteFooter.module.css`).
- `components/site/PointerFX.tsx` — `Tilt` (cursor-lean 3D cards + specular shine) and `DragStrip` (grab-and-throw gallery; wheel/touch native).
- Surface rhythm: dark → light → dark → wash → dark → brand blue (Join) → ink-900 footer. One colour moment only.
- Every section: velocity-skewed marquee opener → giant heading (spring rise lines) → one idea per block → real photography (rounded 20px cards, clip-wipe reveals, hover zoom, pill tags).
- Motion + interactivity: `HeadingWords`/`RiseLine`, `ScrollRevealText` tint sweep, `Counter` stats, `Marquee` openers (7), `ScrollVelocitySkew` on all giant headings, `ScrollDrift` parallax, `MagneticLink` CTAs, `StickyStack` on the two edition cards (pin + accumulate), `Tilt` on media cards + brochure card, `DragStrip` photo gallery, `SignalField` cursor glow on overview/audience/join, hover choreography (heading lines stagger-slide, stats pop, rows glide, footer links slide).
- Keep desktop effects bounded; support touch, keyboard, and reduced-motion alternatives. All pointer FX are mouse-only and vanish under `prefers-reduced-motion` (page renders static + full opacity).
- Archive, brochure, lightbox, header use their own modules. Native dialog viewers keep focus containment, Escape, and focus restoration.

## Verified (7 Oct 2026)

- `npx tsc --noEmit` clean; `npm run build` passes (static routes generated).
- Desktop + 390px mobile: no horizontal scroll (hero drum overflow is clipped by `body overflow-x:hidden`, pre-existing and intentional).
- Interactions exercised with real synthetic input: Tilt (matrix3d + shine on), DragStrip (scrollLeft 0→360 after drag), SignalField glow (`--signal-x/y` track cursor), StickyStack (2 `position:sticky` cards); reduced-motion probe: `force-reveal`, 0 pending reveals, marquee animations stopped, 0 dimmed in-view elements. `Hero.tsx` / `Hero.module.css` unchanged.

## Content and assets

Twelve rendered brochure pages in `public/brochure/`; metadata `lib/data/brochure.ts`. No original PDF — never advertise a PDF download.

Brochure facts: HR VISTA 3.0, 21–22 November 2026, Mumbai, BKC, Jio Grounds; presented by CPCG, CHRIST (Deemed to be University), Pune Lavasa Campus. 500+ professionals and 50+ organisations are projections, not live registrations. Speakers, sponsors, timed agenda, admissions, fees, and logistics must not be invented.

Historical photographs: `docs/FLICKR-MANIFEST.md` — alts/captions must match it. Archive separates February 2025 (1.0) from November 2025 (2.0). Do not use other-institution photographs as HR VISTA documentation. Caption Lavasa landscape as location context, not the Mumbai venue. The preserved hero's media has not been replaced.

## Git

- `main` and `codex/hr-vista-interior-redesign` untouched by this iteration; user explicitly reserved `main`.
- Windows push gotcha: plain `git push` fails (helper-selector supplies no creds) and can hang on flaky home DNS; use `GIT_TERMINAL_PROMPT=0 git -c credential.helper=manager push` and retry when DNS recovers.

## Pending

- `/work` and `/brochure` styling not yet aligned to the new interior — user has not asked yet.
- User visual review of the interactive interior.
