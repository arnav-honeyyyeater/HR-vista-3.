# HR VISTA — Media Curation Guide

This document maps the harvested media in `public/media/raw/` (see
`docs/MEDIA_MANIFEST.json` for the full machine-readable list) to the
sections of the HR VISTA 3.0 website. All stills are **real event media**
from CHRIST (Deemed to be University), Pune Lavasa Campus and its official
partners — no stock or placeholder imagery.

## Source provenance

| Source | What it is | Entries |
|---|---|---|
| CHRIST Lavasa official Flickr — *HR Vista 15 & 16 November 2025* album | 333-photo official event album (HR Vista 2.0) | 21 curated stills |
| CHRIST Lavasa official Flickr — *HR Vista 21 & 22 February 2025* album | 165-photo official event album (HR Vista 1.0) | 25 curated stills |
| christuniversitylavasa.blogspot.com — "HR VISTA 2025" post | Official campus blog write-up + 4 photos | 4 images |
| luma.com/ut8q3lxj — HR VISTA 2025 event page | Event cover art | 1 cover |
| lavasa.christuniversity.in — CPCG page | Official CPCG gallery photos | 6 images |
| hrvista.live — HR Vista 2.0 official site | Speaker headshots (real speakers) | 3 headshots |
| Wikimedia Commons — CHRIST University Logo | University crest/logo, **CC0 public domain** | 1 logo |
| lavasa.christuniversity.in — site logo | Campus logo lockup | 1 logo |
| Luma — BeingHR event avatar | BeingHR partner mark | 1 logo |

**Licence note:** event photography is published by the university on its own
official channels (Flickr/blog/site) for event coverage; these are marked
`org-material` (organizational material — credit the source). Only the
Wikimedia CHRIST University crest is an explicit open licence (CC0). The
Ghatsfield Foundation logo could not be located on an official site and is
intentionally **not** included rather than fabricated.

## Top picks per section

### hero
- `hrvista20_nov01.jpg` — HR Vista 2.0 album cover frame, wide 1600×901 stage shot.
- `luma_cover.jpg` — Luma event cover art (800×800, square — good for a hero card).
- `blog_cover.png` — blog banner (475×317) with the HR VISTA 2025 title lockup.

### story (the conclave narrative)
- `hrvista20_nov02.jpg`, `hrvista20_nov21.jpg`, `hrvista20_nov56.jpg` — auditorium / session flow.
- `cpcg_54031868858.jpg` … `cpcg_55127933066.jpg` — CPCG official gallery frames.
- `hrvista1_feb04.jpg`, `hrvista1_feb14.jpg` — HR Vista 1.0 (Feb 2025) session stills for the "editions" timeline.

### editions (HR Vista 1.0 → 2.0)
- **2.0 (Nov 2025):** `hrvista20_nov04.jpg`, `hrvista20_nov31.jpg`, `hrvista20_nov71.jpg`, `hrvista20_nov91.jpg`.
- **1.0 (Feb 2025):** `hrvista1_feb01.jpg` (DSC08165) … `hrvista1_feb25.jpg` (DSC08995) — 25 stills across the two-day conclave.

### moments (audience, networking, cultural night, trek)
- 23 curated stills across both editions, e.g. `hrvista20_nov03.jpg` (audience),
  `hrvista20_nov41.jpg` (cultural night), `hrvista1_feb06.jpg` (DSC08247).

### statement (speaker / keynote quotes)
- `speaker_arshad_fakhri.jpg` — Arshad Fakhri, Guest of Honour (PROSE Technologies India).
- `speaker_anand_dhruv.png` — Anand Dhruv, Fractional CHRO (RackBank Datacenter).
- `speaker_sujeet_patil.jpg` — Sujeet Patil, People Partner.
- Plus keynote-stage stills: `hrvista20_nov11.jpg`, `hrvista1_feb07.jpg`, `hrvista1_feb18.jpg`.

### partners (logos)
- `logo_christ_university.png` — CHRIST (Deemed to be University) crest, **CC0** (1587×533, transparent RGBA) — safest logo to use.
- `logo_christ_lavasa.png` — CHRIST University Pune Lavasa campus logo (1794×608).
- `logo_beinghr.png` — BeingHR / Being Networks partner mark (32×32 avatar from Luma).

## Media targets — status

| Target | Goal | Achieved | Notes |
|---|---|---|---|
| Images | 40–60, mixed aspect | 60 images | all 1600×900/901 landscape (Flickr `_h` size); 4 blog PNGs + 1 Luma cover + 6 CPCG (640×360) + 3 speaker headshots add variety |
| Videos | 2–5 incl. after-movie | 0 | **No public HR Vista after-movie exists.** Searched YouTube (official Lavasa channel has no HR Vista video), Vimeo, Instagram Reels (login-walled). See "Video gap" below. |
| Logos | 10+ PNGs | 3 | Christ University (CC0), Christ Lavasa, BeingHR. Ghatsfield Foundation logo not findable on an official site; CPCG/BeingHR full logos are behind JS challenges on their sites. |

## Video gap (honest note)

No public HR Vista after-movie / highlight reel could be found:
- The official CHRIST Lavasa YouTube channel (`@ChristUniversityLavasa`) hosts
  convocation/placement videos but **no HR Vista video**.
- Instagram Reels for HR Vista 2.0 (e.g. `@hrvista_culavasa`, `@cpcglavasa`)
  exist but are behind Instagram login — cannot be downloaded without scraping,
  which is out of scope.
- The only YouTube "HR Conclave 2025" video found (`fT249dYlJN0`) is from the
  **Kengeri/Bangalore** campus, not Lavasa — excluded as off-target.

If an after-movie surfaces later, drop it at `public/media/raw/hrvista_aftermovie.mp4`
and append a `kind: "video"` entry to the manifest.

## Review caveat

The vision-review pass (Gemini) was rate-limited during this harvest, so curation
relied on the official album structure: every Flickr still comes from the
university's own "HR Vista" albums, so off-topic risk is minimal, but a human
should still skim the picks before publishing. Dimensions are read from image
headers (PIL), not estimated.
