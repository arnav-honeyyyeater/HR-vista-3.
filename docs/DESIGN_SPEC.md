# HR VISTA 3.0 — DESIGN SPEC
**Reference:** opraah.in (Framer) — structure & motion copied; palette/typography refined.
**Creative direction (Honey, final):** refined royal/lighter blue + white + deep ink. Blue stays the signature. Deviate from the reference wherever it helps the result. Bar = masterpiece.

---

## 1. Design tokens

### Colors (HR VISTA 3.0 palette — replaces opraah's near-black + orange)

| Token | Value | Role |
|---|---|---|
| `--ink-900` | `#0A1220` | Page base (deep ink-navy, NOT pure black — opraah uses #060606; we go ink-blue) |
| `--ink-800` | `#101B2E` | Section alt bg / cards |
| `--ink-700` | `#1B2A44` | Borders, subtle surfaces |
| `--royal-500` | `#2E5BFF` | Signature accent — refined royal blue (opraah's #222FFF is harsher; this is softer, deeper) |
| `--royal-400` | `#5B82FF` | Hover / highlight blue |
| `--royal-300` | `#9DBCFF` | Light blue tint, gradients |
| `--sky-100` | `#E8F0FF` | Light panel bg (white-blue) |
| `--paper` | `#FFFFFF` | White (opraah uses pure white on light sections; keep) |
| `--mist-400` | `#8A97AD` | Muted text (replaces opraah's #888) |
| `--mist-200` | `#C7D2E0` | Subtle lines on dark |
| `--signal` | `#FFB454` | TINY use only — warm highlight (opraah's orange, desaturated to amber so blue owns the page) |

**Ratio rule:** ink-navy 70% / blue 25% / white 5% / amber <1%.

### Typography

| Role | Font | Why |
|---|---|---|
| Display / headlines | **Bricolage Grotesque** (Google Fonts, variable, weights 400–800) | Same character as opraah's Nohemi (eclectic grotesque, characterful) — and it is free & open. Weights: 700/800 for hero, 600 for section titles. |
| Body / UI | **Manrope** (Google Fonts, 300–800) | Same as opraah uses. Clean, geometric, excellent on screen. |
| Mono (labels, eyebrows) | **Space Grotesk** or Manrope 500 uppercase + letter-spacing 0.18em | Eyebrow labels like "HR VISTA 3.0", "21–22 NOV 2026". |

**Type scale (desktop, clamp() fluid):**
- Hero display: `clamp(3.2rem, 9vw, 8.5rem)` / 0.94 letter-spacing / weight 800
- Section title: `clamp(2.2rem, 5vw, 4.5rem)` / 0.98 ls / 700
- Subtitle: `clamp(1.15rem, 2vw, 1.6rem)` / 400–500
- Body: 1rem–1.125rem / 1.6 line-height
- Eyebrow: 0.75rem / uppercase / 0.18em ls / 600

**Line masking:** every headline uses `overflow:hidden` line wrappers (`.line > .line-inner`) for the masked reveal.

### Radii & spacing
- Pill radius: `100px` (buttons, tags — opraah uses 100px pills)
- Card radius: `20px` (cards), `32px` (large panels)
- Section padding: `clamp(5rem, 12vh, 9rem)` vertical; `clamp(1.25rem, 6vw, 7rem)` horizontal
- Max content width: `1600px` centered (opraah goes near-full-bleed; keep 1600 for text, full-bleed for media)

### Motion tokens
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out — Framer's signature feel)
- Fast: `0.35s`; base: `0.6s`; slow: `1.1s`
- Scroll-scrub: GSAP ScrollTrigger `scrub: 1` (1s smoothing)
- Reduced motion: every animation falls back to final state via `@media (prefers-reduced-motion: reduce)`

---

## 2. Section-by-section spec (opraah.in → HR VISTA 3.0)

### S1 — Hero (opraah: repeated headline rows + horizontal drift)
- Layout: 3 stacked headline rows, each full-width, text-reveal masked lines:
  - Row 1: "HR VISTA 3.0" (giant, outline-stroke text on row 3 for depth)
  - Row 2: "The Future of Work." / "The People Who Shape It." (theme, per brochure)
  - Row 3: dates/venue strip: "21–22 NOV 2026 · BKC, JIO GROUNDS, MUMBAI"
- Animation 1 (scroll-drift): rows translateX at different rates vs scroll (`x: (i) => i * 60`, scrub). Row directions alternate left/right for parallax feel.
- Animation 2 (masked reveal): lines slide up from clip on enter, stagger 0.09s.
- Media: right/bottom — parallax collage of 3 curated HR Vista stills (hero pick `hrvista20_nov01.jpg` wide + `luma_cover.jpg` square + `blog_cover.png`) with different y-speeds, scroll-scrubbed.
- CTA pill: "Register" (royal-500, white text, 100px radius, hover → royal-400 + slight scale).

### S2 — Story ("It started with one belief") — parallax
- opraah: "We started in 2017 / With One Belief" + 3-image parallax collage.
- HR: "It started with one belief." + "Creators of the future are the most powerful storytellers alive" → adapted: "The future of work is built by the people who shape it."
- Journey: 3 chapters (1.0 Feb 2025 Lavasa / 2.0 Nov 2025 Lavasa / 3.0 Nov 2026 Mumbai BKC) — year markers in Bricolage, descriptions in Manrope.
- Parallax stack: 3–5 images, y-speed multipliers 0.2 / 0.45 / 0.7, scrub-linked.

### S3 — Stats (count-up counters + floating media)
- opraah: "10,000+ Campaigns Delivered", "1,000+ Creators in Network", "90+ Years Building the Creator Economy".
- HR counters (from brochure, per content.ts stats): 500+ HR professionals & corporate leaders / 2 days / 50+ leading organisations / 1 platform. Plus editions = 3.
- Count-up on viewport enter (IntersectionObserver, once, 1.4s expo-out). Floating media: 2–3 small images gently parallax behind the numbers.

### S4 — Partner marquees ("Most recognised Brands")
- opraah: 5 logo cards × infinite marquee, 320×215, grayscale → color hover.
- HR: CHRIST University (CC0 crest), CHRIST Lavasa, CPCG, BeingHR marks. Marquee 2 rows opposite directions, pause-on-hover, `translateX: -50%` loop, 28s/row linear infinite. Grayscale(1) → grayscale(0) on hover.

### S5 — "What Awaits You" (opraah: "Magnificent At Doing" sticky stacking cards)
- Sticky stack: 5 cards (Panels / Workshops / Cultural Night / DJ / Awards + Trek from 2.0). Pin container, each card scales 0.94→1 + offsets, stacked with shadow. Card titles in Bricolage 700; image top, text bottom.

### S6 — Flavor list ("THINGS WE'RE... AH... NOT SO GREAT AT..." rhythm)
- Two-column mixed list, alternating emphasis words in royal-500. HR version keeps the self-aware humor: "Things we're... ah... not great at... small thinking" etc. Optional flavor — keep, it preserves opraah's rhythm.

### S7 — Big statement + full-bleed media strip (CORE MEDIA MOMENT)
- opraah: "Across creators, communities, and culture..." + 4 full-bleed 2160×1440 images.
- HR: "Across two editions, one idea kept returning." + scroll-scrubbed horizontal media strip of curated HR Vista stills (editions picks). Strip translates X with scroll, images scale 1.15→1 on enter. If after-movie is ever added, it slots here as a muted-loop video tile.

### S8 — "Past Editions" work cards (marquee titles + hover media)
- opraah: "Opraah × Samsung" doubled marquee titles, 1920×1080 media, hover reveals "More".
- HR: HR VISTA 1.0 / 2.0 cards. Card title runs as marquee ("HR VISTA × BeingHR" style doubled text), media 16:9, hover: image scale 1.06 + arrow. Click → edition detail (dates, theme, notes from content.ts).

### S9 — "Signature Moments" (opraah: "Our IPs" scroll carousel)
- Horizontal scroll-jacked carousel (GSAP horizontal pin, 4 panels): Awards Night / DJ Night / Sahyadri Trek / Panel Discussions. Each panel: big title + image + description. Progress bar at bottom.

### S10 — "Tap on the brochure" flip book
- opraah: "Tap on the magazine" — 3D page flip.
- HR: HR 3.0.pdf pages rendered as flip pages (render PDF pages to PNG via PyMuPDF into public/brochure/). CSS 3D transform flip on tap/click + keyboard arrows. "Flip through it. Trust us."

### S11 — Organisers (founders cards pattern)
- opraah: 2 founder cards (photo 411×607, name, role, bio).
- HR: CPCG / convenor names from brochure ONLY (no invented bios). Same card geometry; if no photos harvested, use typographic cards (initial monogram in royal-500 circle).

### S12 — "Who's in the room" (opraah: "There's an OP for everyone" sticky panels + name marquees)
- Sticky full-height panels: HR Leaders / Academicians / Students / Partners. Each panel: left = big "HR" lockup + category label, right = vertical name marquee (names from content.ts whoIsInTheRoom), scrolling infinitely, 22s linear. Panel transitions: fade + slight Y.

### S13 — "Get Involved" (hiring cards rhythm)
- 3 cards: Volunteer / Partner / Speak. Pill tags ("In house"→"On campus"), hover lift + border glow royal-400.

### S14 — Reviews slider (auto + drag + snap)
- opraah: "REviews" — drag slider, auto-advance, snap points, avatar + quote + author + role.
- HR: 3 real attributed testimonials (Unmesh Pawar keynote quote / Mandar Arankalle / Rohit Kalamkar — from content.ts reviews). Drag via pointer events, auto 6s, snap 1 card, reduced-motion = static stack.

### S15 — Footer
- opraah: "Let's make something worth talking about." + office/contact + anchor nav + big graphic.
- HR: "Be part of HR VISTA 3.0." + registration CTA pill + contacts (from content.ts footer; brochure has none — use CPCG/Christ Lavasa official channels, marked) + anchor nav (Work / Moments / Who's in the room / Get involved) + credits line with media attribution.

---

## 3. Animation recipe book (11 recipes, exact parameters)

| # | Recipe | Implementation | Exact params |
|---|---|---|---|
| 1 | Hero scroll drift | GSAP ScrollTrigger scrub | `x: i * 80px`, `scrub: 1`, `ease: none` (scrub handles smoothing) |
| 2 | Masked line reveal | framer-motion `variants` | `initial: {y: "110%"} → {y: 0}`, `duration: 0.9`, `ease: [0.16,1,0.3,1]`, `staggerChildren: 0.09` |
| 3 | Parallax media stack | GSAP scrub | `y: speed * 200px` per layer (0.2/0.45/0.7), `scrub: 1.2` |
| 4 | Count-up | custom hook + IntersectionObserver | `once: true`, `duration: 1400ms`, expo-out, `threshold: 0.4` |
| 5 | Infinite marquee | CSS keyframes | `translateX(0 → -50%)`, `linear infinite`, 24–32s depending on content length; duplicate content for seamless loop |
| 6 | Sticky stacking cards | GSAP pin + scrub | pin container, each card `scale: 0.94→1`, `y: i * 24px`, `scrub: 1` |
| 7 | Edition card hover | CSS transitions | `transform: scale(1.06)`, `transition: 0.6s cubic-bezier(0.16,1,0.3,1)`; title marquee 18s |
| 8 | Sticky panels + name marquee | GSAP pin + CSS marquee | pin each panel 100vh, name marquee 22s linear infinite, panel fade 0.5s |
| 9 | Testimonial slider | framer-motion + pointer | drag x with `dragConstraints`, `snap: 1 card`, auto-advance 6s, `ease: [0.16,1,0.3,1]` |
| 10 | Flip book | CSS 3D | `transform: rotateY(180deg)`, `transform-style: preserve-3d`, `transition: 0.8s`, `perspective: 1600px`; tap + ArrowLeft/Right |
| 11 | Reduced motion | `@media (prefers-reduced-motion: reduce)` | all scrub/parallax/marquee disabled → static final states; count-ups render final value |

---

## 4. Media plan (from docs/MEDIA-CURATION.md)
- Hero: `hrvista20_nov01.jpg` (wide stage), `luma_cover.jpg` (square card), `blog_cover.png`
- Story: `hrvista20_nov02/21/56.jpg` + CPCG gallery frames
- Stats floating: `hrvista1_feb04.jpg`, `cpcg_54031868858.jpg`
- Statement strip: 4–6 landscape stills across both editions
- Editions: 2.0 → `hrvista20_nov04/31/71/91.jpg`; 1.0 → `hrvista1_feb01–25.jpg`
- Moments: `hrvista20_nov03.jpg` (audience), `hrvista20_nov41.jpg` (cultural night)
- Speakers: `speaker_arshad_fakhri.jpg`, `speaker_anand_dhruv.png`, `speaker_sujeet_patil.jpg`
- Partners: `logo_christ_university.png` (CC0), `logo_christ_lavasa.png`, `logo_beinghr.png`
- Brochure flip: render HR 3.0.pdf pages (PyMuPDF, 1400px wide PNG) into `public/brochure/`
- All credits per MEDIA_MANIFEST.json; org-material license → footer credit line.

## 5. Deviations from opraah (creative freedom, approved)
1. Palette: opraah near-black + electric blue + orange → our ink-navy + refined royal blue + white, amber only as micro-accent. Blue owns the page.
2. Fonts: Nohemi (paid) → Bricolage Grotesque (free, same eclectic-grotesque character). Manrope kept.
3. No "not so great at" list duplication beyond one flavor section (rhythm preserved, not repeated).
4. Hero adds an outline-stroke text row (WebkitTextStroke) for depth opraah doesn't have.
5. Statement strip is scroll-scrubbed horizontal (opraah's is a static grid) — this is the CORE media moment and deserves the motion.
6. Mobile: sticky stacks become swipeable cards; name marquees slow to 32s; all pins released under 768px (no janky pinned horizontal on mobile).

## 6. QA bar (Phase 2)
- `npm run build` exits 0
- 15/15 sections present, 11/11 recipes with reduced-motion fallbacks
- Zero console errors, all media local (grep: zero remote hotlinks), manifest-complete
- Mobile 390px: no horizontal scroll, tap targets ≥ 44px
