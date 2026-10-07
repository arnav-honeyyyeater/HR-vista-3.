"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { WatermarkBand } from "./Sections";

/**
 * S2b — GALLERY STRIP (DESIGN BRIEF V4 §2, "the gallery spine").
 *
 * The page is a gallery you scroll through, and this is its spine: six big
 * event tiles that move horizontally while you scroll vertically — words
 * reduced to labels and captions, the photographs carrying the section.
 *
 * Pattern #4 (horizontal-from-vertical) WITHOUT a GSAP pin: the pinning is
 * plain `position: sticky` and the horizontal travel is a single transform
 * derived from the section's own geometry. Nothing is hijacked, the scroll
 * is never seized, and no pin-spacers are injected into React's DOM (the
 * teardown bug this project already dropped GSAP pin for).
 *
 *   · desktop + motion allowed → scrub mode: sticky stage, section height =
 *     stage + track overflow, progress = (-sectionTop) / dist. Velocity skew
 *     leans the track with the scroll and settles flat.
 *   · mobile / reduced motion → native mode: an ordinary overflow-x scroller
 *     with scroll-snap. Skippable, familiar, no pin, no jank.
 *
 * Safety: the component renders in native mode first (fully readable with
 * zero JS) and only upgrades to scrub when eligible, so content is never
 * gated on motion. The heading is plain `RiseLine` copy — visible by
 * default (brief §3).
 */

interface Tile {
  src: string;
  alt: string;
  index: string;
  title: string;
  caption: string;
}

/** Short factual labels only — no invented copy (brief §2 declutter rule). */
const TILES: Tile[] = [
  {
    src: "/media/flickr/editions-1.jpg",
    alt: "HR VISTA — the conclave floor",
    index: "01",
    title: "Two days.",
    caption: "One ecosystem.",
  },
  {
    src: "/media/flickr/story-2.jpg",
    alt: "HR VISTA delegates in session",
    index: "02",
    title: "500+",
    caption: "HR leaders & corporate voices",
  },
  {
    src: "/media/flickr/story-4.jpg",
    alt: "HR VISTA audience",
    index: "03",
    title: "50+",
    caption: "Leading organisations",
  },
  {
    src: "/media/flickr/stats-2.jpg",
    alt: "HR VISTA panel discussion",
    index: "04",
    title: "Three",
    caption: "Editions — 1.0, 2.0, 3.0",
  },
  {
    src: "/media/flickr/room-2.jpg",
    alt: "HR VISTA networking",
    index: "05",
    title: "Lavasa → Mumbai",
    caption: "Campus initiative to national platform",
  },
  {
    src: "/media/flickr/editions-4.jpg",
    alt: "HR VISTA closing frame",
    index: "06",
    title: "21–22 Nov",
    caption: "BKC · Jio Grounds · Mumbai",
  },
];

const MIN_WIDTH = 900; // below this → native horizontal scroller
const SKEW_MAX = 4; // degrees of velocity skew

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

function TileCard({ tile }: { tile: Tile }) {
  return (
    <article className="group lift relative w-[clamp(250px,74vw,520px)] shrink-0 snap-start md:w-[clamp(300px,34vw,560px)]">
      <div
        data-reveal="wipe"
        className="zoom-frame relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--ink-700)] bg-[var(--ink-800)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tile.src}
          alt={tile.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span
          aria-hidden
          className="absolute top-4 left-4 rounded-full bg-[var(--ink-900)]/85 px-3 py-1 font-display text-xs font-bold tracking-widest text-[var(--paper)]"
        >
          {tile.index}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <h3 className="display-3 shrink-0 text-[clamp(1.15rem,1.9vw,1.75rem)] text-[var(--paper)]">
          {tile.title}
        </h3>
        <p className="min-w-0 truncate text-sm text-[var(--mist-400)]">
          {tile.caption}
        </p>
      </div>
    </article>
  );
}

export function GalleryStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Native first (readable with no JS at all), upgrade only when eligible.
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const eligible = () => {
      const reduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      return !reduced && window.innerWidth >= MIN_WIDTH;
    };
    setScrub(eligible());
    const onResize = () => setScrub(eligible());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!scrub) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!section || !stage || !scroller || !track) return;
    return runScrub(section, stage, scroller, track, railRef);
  }, [scrub]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="sec sec-dark"
      style={{ paddingBlock: 0 }}
    >
      {/* Sticky stage — pinning by CSS, travel by transform. */}
      <div
        ref={stageRef}
        className={
          scrub
            ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"
            : "relative flex flex-col justify-center overflow-hidden py-10"
        }
      >
        <div className="content-max mx-auto w-full">
          {/* The reference's repeating display label, scrolled edge to edge. */}
          <WatermarkBand
            label="The gallery"
            className="mb-[var(--space-sm)] px-[var(--section-padding-x)]"
          />

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-[var(--royal-300)]">The gallery</p>
              <div className="display-2 mt-3 text-[length:var(--text-section)] text-[var(--paper)]">
                <HeadingWords as="div" text="Scroll the room." />
                <HeadingWords
                  as="div"
                  delay={0.07}
                  className="text-[var(--mist-400)]"
                  text="Six frames from two editions."
                />
              </div>
            </div>
            <p className="eyebrow shrink-0 text-[var(--mist-400)]">
              {scrub ? "Keep scrolling →" : "Swipe →"}
            </p>
          </div>
        </div>

        {/* The track — vertical scroll drives horizontal travel. */}
        <div
          ref={scrollerRef}
          className={
            scrub
              ? "mt-8 w-full overflow-hidden"
              : "gallery-scroller snap-x snap-mandatory mt-8 w-full overflow-x-auto"
          }
        >
          <div
            ref={trackRef}
            className="gallery-track flex w-max gap-4 md:gap-5"
          >
            {TILES.map((tile) => (
              <TileCard key={tile.index} tile={tile} />
            ))}
          </div>
        </div>

        {/* Progress rail — information, so it survives reduced motion. */}
        <div className="mx-auto mt-7 h-px w-full max-w-[var(--max-content)] bg-[var(--ink-700)]">
          <div
            ref={railRef}
            className="h-px origin-left bg-[var(--royal-500)]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * The scrub loop: geometry-derived progress + a little velocity skew.
 * Runs only while the section is on screen (IntersectionObserver gate), so
 * it costs nothing the rest of the time. Returns its own cleanup.
 */
function runScrub(
  section: HTMLElement,
  stage: HTMLElement,
  scroller: HTMLElement,
  track: HTMLElement,
  railRef: RefObject<HTMLDivElement | null>,
) {
  let dist = 0;
  let skew = 0;
  let raf = 0;
  let active = false;
  let lastY = window.scrollY;

  function padTop() {
    return parseFloat(getComputedStyle(section).paddingTop) || 0;
  }

  function apply() {
    const rect = section.getBoundingClientRect();
    const p = dist > 0 ? clamp((-rect.top - padTop()) / dist, 0, 1) : 0;
    track.style.transform = `translate3d(${(-p * dist).toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    if (railRef.current) railRef.current.style.transform = `scaleX(${p})`;
  }

  function measure() {
    // Section height = stage height + horizontal travel (padding-block is 0).
    dist = Math.max(0, track.scrollWidth - scroller.clientWidth);
    section.style.height = `${stage.offsetHeight + dist + padTop() * 2}px`;
    apply();
  }

  function tick() {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    const target = clamp(dy * 0.08, -SKEW_MAX, SKEW_MAX);
    skew += (target - skew) * 0.15;
    if (Math.abs(skew) < 0.02) skew = 0;
    apply();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (active) return;
    active = true;
    lastY = window.scrollY;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(raf);
    skew = 0;
    apply();
  }

  const io = new IntersectionObserver(
    ([entry]) => (entry && entry.isIntersecting ? start() : stop()),
    { rootMargin: "25% 0px 25% 0px" },
  );
  io.observe(section);

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measure, 150);
  };
  window.addEventListener("resize", onResize);

  // Lazy images change the track width → re-measure once they land.
  const imgs = Array.from(track.querySelectorAll("img"));
  const onImg = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measure, 80);
  };
  imgs.forEach((img) => {
    if (!img.complete) img.addEventListener("load", onImg, { once: true });
  });

  measure();

  return () => {
    io.disconnect();
    window.removeEventListener("resize", onResize);
    window.clearTimeout(resizeTimer);
    cancelAnimationFrame(raf);
    imgs.forEach((img) => img.removeEventListener("load", onImg));
    section.style.height = "";
    track.style.transform = "";
    if (railRef.current) railRef.current.style.transform = "";
  };
}
