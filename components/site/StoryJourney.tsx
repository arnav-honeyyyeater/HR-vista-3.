"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { content } from "@/lib/data/content";
import { Reveal } from "./Reveal";

/**
 * S2 — STORY (DESIGN BRIEF V4 §2, declutter rule).
 *
 * Media carries the section: an overlapping 3-depth parallax collage
 * (speed ratios 0.5 / 1 / 1.3, exactly the brief's choreography) sits under a
 * two-line headline. Words are reduced to labels and captions — the journey
 * is year + title + one short line, nothing more.
 *
 * The collage lives in its own bounded band; parallax travel is capped at
 * ±23px while every frame's image is scaled to 1.15 (≈10% headroom on every
 * edge), so a layer can never expose a gap or travel into the copy.
 */

const LAYERS = [
  {
    src: "/media/flickr/story-1.jpg",
    alt: "HR VISTA 1.0",
    speed: 0.5,
    frame: "relative aspect-[4/3] md:absolute md:top-[8%] md:left-0 md:h-[46%] md:w-[46%] md:aspect-auto",
  },
  {
    src: "/media/flickr/story-3.jpg",
    alt: "HR VISTA conversations",
    speed: 1,
    frame: "relative aspect-[3/4] md:absolute md:top-0 md:right-[2%] md:h-[68%] md:w-[44%] md:aspect-auto",
  },
  {
    src: "/media/flickr/story-5.jpg",
    alt: "HR VISTA audience",
    speed: 1.3,
    frame: "relative aspect-[16/10] md:absolute md:bottom-[4%] md:left-[26%] md:h-[42%] md:w-[46%] md:aspect-auto",
  },
] as const;

/** ±23px max travel at speed 1.3 — inside the 10% image headroom. */
const TRAVEL = 18;

/**
 * Scroll-sweep colour pairs for the statements below.
 *
 * Literal hex, not `var(--…)`: Framer interpolates these channel by channel and
 * cannot resolve a CSS custom property. Keep them in step with the palette —
 * `--mist-400` → `--ink-900`, and `--mist-400` → `--royal-500`.
 */
const INK_SWEEP = ["#8a97ad", "#0a1220"] as const;
const ROYAL_SWEEP = ["#8a97ad", "#2e5bff"] as const;

function CollageTile({
  src,
  alt,
  speed,
  frame,
}: {
  src: string;
  alt: string;
  speed: number;
  frame: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const span = speed * TRAVEL;
  const y = useTransform(scrollYProgress, [0, 1], [span, -span]);

  return (
    <div
      ref={ref}
      data-reveal="wipe"
      className={`group overflow-hidden rounded-[var(--radius-card)] border border-[var(--mist-200)] bg-[var(--sky-100)] ${frame}`}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y }}
        className="absolute inset-0 h-full w-full scale-[1.15] object-cover"
      />
    </div>
  );
}

export function StoryJourney() {
  return (
    <section id="story" className="sec-light relative overflow-hidden">
      <div className="content-max px-[var(--section-padding-x)] pb-[var(--section-padding-y)] pt-[var(--space-2xl)]">
        {/* THE LONG STATEMENT — the reference's signature move.
            opraah.in holds "We started in 2017 / With One Belief" centred at
            55.6px, its lines lit word by word as the reader scrolls (measured:
            size 55.62, weight 700, line-height 1.2, tracking −0.02em, centred).
            Reproduced at the same size, weight, leading and alignment. */}
        <div className="mx-auto max-w-[1180px] text-center">
          <p className="eyebrow mb-[var(--space-md)] text-[var(--royal-500)]">Our story</p>

          <ScrollRevealText
            as="p"
            text="We started in Feb 2025."
            className="display-2 text-[length:var(--text-section)] text-[var(--ink-900)]"
            tint={INK_SWEEP}
          />
          <ScrollRevealText
            as="p"
            text="With one belief."
            className="display-2 mt-[var(--space-xs)] text-[length:var(--text-section)] text-[var(--royal-500)]"
            tint={ROYAL_SWEEP}
          />
          {/* The long statement. Colour carries the sweep here (see `tint`), so
              the sentence is fully opaque the whole way down and the reader is
              never mid-line on washed-out text. */}
          <ScrollRevealText
            as="p"
            text="The people who shape the future of work are the most powerful storytellers in the room."
            className="display-2 mt-[var(--space-xl)] text-[length:var(--text-section)] text-[var(--ink-900)]"
            tint={INK_SWEEP}
          />
          <ScrollRevealText
            as="p"
            text="Everything we have built since then proves it."
            className="display-2 mt-[var(--space-xs)] text-[length:var(--text-section)] text-[var(--ink-900)]"
            tint={INK_SWEEP}
          />
        </div>

        {/* Parallax collage — 3 depths, bounded band, no overlap possible */}
        <div className="relative mt-[var(--space-2xl)] grid gap-4 md:h-[clamp(420px,52vh,620px)] md:grid-cols-1 md:gap-6">
          {LAYERS.map((layer) => (
            <CollageTile key={layer.src} {...layer} />
          ))}
        </div>

        {/* Journey chapters — labels only (brief §2 declutter rule) */}
        <div className="mt-[var(--space-2xl)] flex items-baseline justify-between gap-4">
          <p className="eyebrow text-[var(--mist-400)]">{content.story.heading}</p>
          <span aria-hidden className="hidden h-px flex-1 bg-[var(--line-light)] sm:block" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
          {content.story.entries.map((entry, i) => (
            <Reveal key={entry.year} delay={i * 0.07} className="h-full">
              <a
                href="#work"
                className="group lift flex h-full flex-col rounded-[var(--radius-panel)] border border-[var(--line-light)] bg-[var(--paper)] p-6 md:p-7"
              >
                <p className="eyebrow text-[var(--signal)]">{entry.year}</p>
                <h3 className="display-3 mt-3 text-[clamp(1.15rem,2vw,1.6rem)]">
                  {entry.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mist-400)]">
                  {entry.description}
                </p>
                <span
                  aria-hidden
                  className="mt-5 inline-block text-[var(--royal-500)] transition-transform duration-[var(--dur-fast)] ease-[var(--ease-expo)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
