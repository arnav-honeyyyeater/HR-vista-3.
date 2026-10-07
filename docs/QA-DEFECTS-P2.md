# HR VISTA 3.0 — PHASE 2 QA (Creative Director review, 03:00–04:20 IST)

Reviewer: main model (mimo-v2.6-pro) = Creative Director + QA
Scope: rendered experience, desktop 1440x900 + mobile 390x844, full 23.6k px scroll,
reduced-motion emulation, build + console + media integrity.

## Verification baseline (all PASS)
- `npm run build` exits 0 (7/7 static pages, / = 66.8 kB, First Load 169 kB)
- Console errors/warnings: **0** across full programmatic scroll (hooked console.error + window.onerror)
- All 39 images load (0 broken after settle); all media local (`/media/raw/`), **zero remote hotlinks**
- Fonts loaded (Bricolage Grotesque 400–800, Manrope 300–800)
- No document horizontal overflow at desktop (scrollWidth 1425 = viewport)
- Mobile 390px: **zero horizontal overflow at every 800px scroll step** (swept 0–30.5k)
- Reduced-motion emulation: full scroll, **0 errors**, static rendering
- DCL 160ms / load 187ms (dev)

## DEFECTS FOUND (by severity)

### CRITICAL
1. **`public/media/raw/logo_beinghr.png` is a 32x32 JPEG mislabeled .png** (444 bytes).
   Served as the BeingHR partner logo in the marquee — renders as a tiny 32px dot.
   Partner marquee is a flagship section; a 32px placeholder is unacceptable.
   Fix: replace with a proper BeingHR wordmark (typographic card is the safe fallback —
   DESIGN_SPEC already sanctions typographic cards for CPCG/Ghatsfield). Regenerate
   a clean vector-style BeingHR mark or render BeingHR as a typographic card.

### HIGH (craft / masterpiece bar)
2. **No `<h1>` anywhere.** Hero headline is not a real h1 (a11y + SEO defect).
   Site has 6 h2 but zero h1. Hero "HR VISTA 3.0" must be the h1.
3. **Header nav tap targets are 21px tall** (Story/Stats/Partners/… links) — below
   the 44px mobile guideline. Desktop-only nav is partly masked on mobile by the
   hamburger, but inline links still need min-height padding.
4. **Marquee rows use `pl-[var(--section-padding-x)]` + `pr-*` seams** — the infinite
   loop can show a padding gap at the wrap point (sections 6 & 8 wide children
   2902px/3348px). Marquees must be seamless edge-to-edge loops (duplicate content,
   no side padding inside the looping track).

### MEDIUM (elevation toward "stunning")
5. **Statement strip (S7) media tiles** — full-bleed strip images need consistent
   aspect + object-position so the scrub doesn't reveal awkward crops.
6. **Signature Moments (S9) carousel** — verify each panel image fills its frame
   (no letterboxing) and the progress bar is visible.
7. **WhoIsInTheRoom (S12) sticky panels** — name marquees need strong weight contrast
   (outline/fill alternation) so the horizontal drift reads as designed, not noisy.
8. **Brochure flip (S10)** — page scale/perspective: confirm 3D peel reads on desktop
   and tap is >= 44px on mobile.

### LOW
9. Speaker thumbnails `speaker_anand_dhruv.png` is 180x180 (small);
   `speaker_arshad_fakhri.jpg` 180x180 — acceptable for avatars but verify not
   upscaled beyond native res in Organisers.
10. `blog_hr1/2/3.png` are 297–320px wide — fine for small collage tiles only.

## Creative-direction notes (for fix agents)
- Palette ratio rule (ink-navy 70 / blue 25 / white 5 / amber <1) — enforce.
- Every headline: masked line reveal (overflow-hidden line wrappers), expo-out.
- Marquees: seamless, pause-on-hover, grayscale→color on logo cards.
- Bar = masterpiece. No placeholder imagery anywhere a partner/edition is featured.
