# HR VISTA 3.0

An interactive event website for the Centre for Placement and Career Guidance, CHRIST (Deemed to be University), Pune Lavasa Campus.

The original opening hero and its photo wall are preserved. The rest of the site uses the **Human Signals** direction: oversized typography, cobalt and ink surfaces, layered event photography, pointer-responsive graphics, and accessible exploration.

## Run locally

```powershell
npm install
npm run dev -- --hostname 127.0.0.1 --port 3005
```

Open http://127.0.0.1:3005.

```powershell
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
npm run start -- --hostname 127.0.0.1 --port 3005
```

## Pages

- `/`: preserved hero, overview, interactive programme stage, audience radar, edition previews, institution/venue, discovery finale.
- `/work`: completed editions with captioned photo galleries and keyboard-accessible lightboxes.
- `/brochure`: all twelve brochure pages, thumbnails, page selector, reading mode, and zoom. Deep links such as `/brochure?page=11` open the relevant page.

The active site focuses on design and browsing. There is no registration page or submission UI. The pre-existing registration/contact APIs are outside this redesign.

## Main files

- `app/page.tsx`: homepage composition.
- `components/site/Hero.tsx` and `Hero.module.css`: preserved opening.
- `components/site/HomeInterior.module.css` and `HomeMotion.tsx`: visual system and bounded pointer/scroll motion.
- `components/site/EditionsArchive.tsx`, `PhotoLightbox.tsx`: archive exploration.
- `components/site/BrochureReader.tsx`, `lib/data/brochure.ts`: reader and shared twelve-page document metadata.
- `app/globals.css`: original styles plus scoped `.hv` foundations.
- `lib/data/content.ts`: event copy.
- `docs/FLICKR-MANIFEST.md`: local media provenance.

## Content and interaction

Event facts follow the supplied brochure: **21–22 November 2026, Mumbai, BKC, Jio Grounds**. Participation figures are expected, rather than confirmed attendance. Photography in the redesigned archive is assigned to the correct historical edition; the hero media remains unchanged.

Display typography is locally hosted **Nohemi**; body typography is **Manrope**. Animation respects reduced motion, touch layouts keep controls visible, and native dialogs support Escape, focus containment, and focus restoration. The brochure consists of PNG pages; the site does not advertise an unavailable original PDF.

Work is on the local branch `codex/hr-vista-interior-redesign`. No push or deployment is part of this work.
