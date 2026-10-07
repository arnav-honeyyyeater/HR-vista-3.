"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * CinematicStrip — a full-bleed film strip that pans horizontally as the page
 * scrolls. This is the page's core media moment, and it is the one piece of
 * motion borrowed most directly from the reference: opraah.in carries its
 * "Across creators, communities, and culture" paragraph on a wide band of
 * full-bleed frames, and the site's whole feel is that band moving past you.
 *
 * HOW IT WORKS
 *   The section is `PAN_DISTANCE` tall and its inner frame is `sticky`, so the
 *   frame pins to the viewport for the duration of the section while the outer
 *   section's scroll progress drives the track's `x`. Vertical scrolling
 *   therefore reads as horizontal travel — no scroll-jacking, no wheel
 *   hijacking: the browser's own scroll position is the timeline, so momentum
 *   scrolling, scrollbars, keyboard paging and anchor jumps all keep working.
 *
 *   `useSpring` smooths the raw progress so trackpad flicks do not snap the
 *   strip, and the spring is deliberately stiff enough that the strip never
 *   feels detached from the scroll.
 *
 * ACCESSIBILITY
 *   - `prefers-reduced-motion`: the section collapses to its natural height and
 *     the track becomes a normal horizontally scrollable row. Every frame is
 *     reachable; nothing is hidden and nothing moves on its own.
 *   - The frames are decorative context for the statement above them, so the
 *     track is `aria-hidden`-free but images carry real alt text.
 *   - The pinned track is `overflow-hidden`, so it can never introduce
 *     horizontal page scroll.
 */

/** Frames for the strip — energy crops across both editions. */
const FRAMES: { src: string; alt: string }[] = [
  { src: "/media/flickr/statement-1.jpg", alt: "HR VISTA keynote in progress" },
  { src: "/media/flickr/editions-2.jpg", alt: "HR VISTA stage and audience" },
  { src: "/media/flickr/stats-3.jpg", alt: "Delegates at HR VISTA" },
  { src: "/media/flickr/room-1.jpg", alt: "HR VISTA panel discussion" },
  { src: "/media/flickr/editions-4.jpg", alt: "HR VISTA award presentation" },
  { src: "/media/flickr/hero-2.jpg", alt: "HR VISTA audience" },
];

/** How far the strip travels, as a fraction of its own width. */
const TRAVEL = 0.62;

export function CinematicStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() === true;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Raw progress -> gentle spring, so a fast flick glides instead of snapping.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.35,
  });

  // Percentages, so the travel is proportional to the track's own width and the
  // strip behaves identically at every viewport size.
  const x = useTransform(progress, [0, 1], ["0%", `-${TRAVEL * 100}%`]);
  // A whisper of parallax on each frame, so the band has depth as it travels.
  const imgScale = useTransform(progress, [0, 0.5, 1], [1.06, 1, 1.06]);

  return (
    <section
      ref={sectionRef}
      aria-label="HR VISTA across two editions"
      className={reduce ? "sec-dark relative py-10" : "sec-dark relative"}
    >
      <div
        className={
          reduce
            ? "overflow-x-auto"
            : "sticky top-0 flex h-[100svh] items-center overflow-hidden"
        }
      >
        <motion.div
          ref={trackRef}
          style={reduce ? undefined : { x }}
          className="flex w-max gap-3 px-[var(--section-padding-x)] md:gap-5"
        >
          {FRAMES.map((f, i) => (
            <figure
              key={f.src}
              className="group relative h-[clamp(220px,56svh,640px)] shrink-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--ink-800)]"
              // Frame widths vary slightly with the index so the band has an
              // editorial rhythm instead of reading as a uniform filmstrip.
              // Every width is a share of the viewport, so the strip stays
              // proportional at any size.
              style={{
                width:
                  i % 3 === 0
                    ? "clamp(240px, 34vw, 560px)"
                    : i % 3 === 1
                      ? "clamp(200px, 27vw, 440px)"
                      : "clamp(220px, 30vw, 500px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src={f.src}
                alt={f.alt}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                style={reduce ? undefined : { scale: imgScale }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-base)] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
              />
              <figcaption className="sr-only">{f.alt}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
      {/* The spacer is what gives the pinned frame something to scroll through:
          exactly the sticky viewport plus the height the track will travel, so
          the strip arrives at its end position precisely as the section ends
          and never leaves a dead gap. */}
      {!reduce && (
        <div style={{ height: `calc(100svh + (100vw * ${TRAVEL}))` }} aria-hidden />
      )}
    </section>
  );
}
