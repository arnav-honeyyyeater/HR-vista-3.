"use client";

import type { CSSProperties, ReactNode } from "react";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, RiseLine } from "./Reveal";

/**
 * SectionOpener — the reference's most repeated device.
 * ============================================================
 * opraah.in opens every large block the same way: its own name is set at
 * display size, uppercased, and run as a marquee across the full width, then
 * the real headline drops in beneath it. Their "OUR WORK OUR WORK OUR WORK"
 * band is exactly this (`data-framer-name="sticky"`), and reproducing it is
 * what makes a page read as *their* page rather than a generic one.
 *
 *   <SectionOpener label="Our work" title={["Two editions.", "One platform."]} />
 *
 * The label band scrolls because `Marquee` duplicates its set; on a narrow
 * screen the copies simply keep the band full. The label is decorative
 * (aria-hidden through `Marquee`'s duplicate handling) — the real, announced
 * heading is the `title`, so assistive tech never hears "Our work" three
 * times.
 */
export interface SectionOpenerProps {
  /** Repeated display label, e.g. "Our work". Rendered uppercase. */
  label: string;
  /** Real heading lines — the announced content. */
  title: string[];
  /** Optional supporting line under the heading. */
  intro?: string;
  /** Optional right-aligned micro-label, e.g. a scroll hint. */
  meta?: string;
  /** Accent one of the title lines (index) with the signature blue. */
  accentLine?: number;
  /** Section id, for anchors. */
  id?: string;
  /** "dark" (default) or "light" — controls text colours. */
  tone?: "dark" | "light";
  /** Headline size override; defaults to the measured section size. */
  titleSize?: string;
  className?: string;
}

export function SectionOpener({
  label,
  title,
  intro,
  meta,
  accentLine,
  id,
  tone = "dark",
  titleSize = "var(--text-section)",
  className = "",
}: SectionOpenerProps) {
  const muted = tone === "dark" ? "text-[var(--mist-400)]" : "text-[var(--mist-400)]";

  return (
    <header id={id} className={`relative ${className}`}>
      {/* The label band. Decorative repetition — see the note above. */}
      <div aria-hidden className="pointer-events-none select-none">
        <Marquee
          items={[label, label, label]}
          speed={42}
          pauseOnHover={false}
          className="opener-label opacity-[0.13]"
        />
      </div>

      <div className="content-max mt-[var(--space-md)] flex flex-wrap items-end justify-between gap-[var(--space-md)] px-[var(--section-padding-x)]">
        <h2 className="display-2 max-w-5xl" style={{ fontSize: titleSize }}>
          {title.map((line, i) => (
            <HeadingWords
              key={line}
              as="span"
              text={line}
              delay={i * 0.09}
              className={
                i === accentLine
                  ? "block text-[var(--royal-500)]"
                  : "block"
              }
            />
          ))}
        </h2>

        {(intro || meta) && (
          <Reveal delay={0.12}>
            <div className="max-w-sm text-right">
              {intro && (
                <p className={`text-[var(--text-body-lg)] leading-relaxed ${muted}`}>{intro}</p>
              )}
              {meta && <p className="eyebrow mt-3 text-[var(--royal-500)]">{meta}</p>}
            </div>
          </Reveal>
        )}
      </div>
    </header>
  );
}

/**
 * WatermarkBand — the repeated display label as a faint scrolling band.
 * ============================================================
 * The reference opens a large block with its own name, set at display size and
 * scrolled edge to edge. `SectionOpener` pairs that band with a heading; this
 * is the band on its own, for sections whose heading already exists and only
 * needs the accent.
 *
 *   <WatermarkBand label="At a glance" />
 *
 * Purely decorative: the band is `aria-hidden`, so a screen reader never hears
 * the same word three times.
 */
export function WatermarkBand({
  label,
  className = "",
  opacity = 0.12,
  speed = 46,
}: {
  label: string;
  className?: string;
  opacity?: number;
  speed?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <Marquee
        items={[label, label, label]}
        speed={speed}
        pauseOnHover={false}
        className="opener-label"
      />
    </div>
  );
}

/**
 * FullWidthTransition — the tall statement blocks between sections.
 * ============================================================
 * Between its content sections the reference inserts a block that is nothing
 * but a sentence, set large and centred, holding most of a screen on its own.
 * Those blocks are what give the page its unhurried, editorial pace: without
 * them a page of dense cards reads as a list rather than a narrative.
 *
 *   <FullWidthTransition>We don't just run campaigns.</FullWidthTransition>
 */
export interface FullWidthTransitionProps {
  children: ReactNode;
  /** Optional small label above the sentence. */
  eyebrow?: string;
  /** Optional second, accented line under the first. */
  emphasis?: string;
  tone?: "dark" | "light";
  /** Optional background media, rendered full-bleed behind the copy. */
  media?: { src: string; alt: string };
  className?: string;
  style?: CSSProperties;
}

export function FullWidthTransition({
  children,
  eyebrow,
  emphasis,
  tone = "dark",
  media,
  className = "",
  style,
}: FullWidthTransitionProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={`relative isolate flex min-h-[62svh] items-center overflow-hidden ${
        isDark ? "bg-[var(--ink-900)]" : "bg-[var(--paper)]"
      } ${className}`}
      style={style}
    >
      {media && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
          />
          {/* Scrim: guarantees the sentence keeps its contrast over any crop. */}
          <div
            aria-hidden
            className={`absolute inset-0 -z-10 ${
              isDark
                ? "bg-[linear-gradient(to_bottom,rgba(10,18,32,0.72),rgba(10,18,32,0.9))]"
                : "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.86),rgba(255,255,255,0.96))]"
            }`}
          />
        </>
      )}

      <div className="content-max relative w-full px-[var(--section-padding-x)] py-[var(--space-2xl)] text-center">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-[var(--space-md)] text-[var(--royal-500)]">{eyebrow}</p>
          </Reveal>
        )}

        <div
          className={`transition-line mx-auto max-w-[1100px] ${
            isDark ? "text-[var(--paper)]" : "text-[var(--ink-900)]"
          }`}
        >
          <RiseLine as="div">{children}</RiseLine>
          {emphasis && (
            <RiseLine as="div" delay={0.08} className="text-[var(--royal-500)]">
              {emphasis}
            </RiseLine>
          )}
        </div>
      </div>
    </section>
  );
}
