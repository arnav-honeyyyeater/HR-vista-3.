"use client";

import { CinematicStrip } from "./CinematicStrip";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { content } from "@/lib/data/content";

/**
 * S7 — BIG STATEMENT + FULL-BLEED MEDIA (DESIGN BRIEF V4 §2/§4).
 *
 * The statement is normal `RiseLine` copy (visible by default — brief §3), and
 * the media beneath it is a `CinematicStrip`: a full-bleed band of frames that
 * pans horizontally as the page scrolls. That band is the page's core media
 * moment and the piece of motion borrowed most directly from the reference,
 * whose whole feel is a wide strip of frames travelling past the reader.
 *
 * The strip is a separate component because it owns a pinned, scroll-driven
 * timeline; keeping it isolated means this section stays a simple layout.
 */
export function StatementStrip() {
  return (
    // NOTE: no `overflow-hidden` on this section. An ancestor with a clipping
    // overflow becomes the scroll container for `position: sticky`
    // descendants, which silently breaks the CinematicStrip's pin — the strip
    // still translates, but it scrolls away instead of holding the viewport.
    // The strip clips itself, so nothing here needs to.
    <section id="statement" className="sec-dark">
      <div className="sec-layer content-max px-[var(--section-padding-x)]">
        <p className="eyebrow text-[var(--royal-300)]">The idea</p>
        <div className="display-2 mt-4 max-w-5xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="Across two editions," />
          <HeadingWords
            as="div"
            delay={0.07}
            className="text-[var(--royal-500)]"
            text="one idea kept returning."
          />
        </div>
      </div>

      <CinematicStrip />

      <div className="sec-layer content-max flex flex-wrap items-baseline justify-between gap-3 px-[var(--section-padding-x)]">
        <p className="display-3 max-w-3xl text-[clamp(1.1rem,2vw,1.7rem)] text-[var(--paper)]">
          {content.statement}
        </p>
        <p className="eyebrow text-[var(--mist-400)]">Two editions · One platform</p>
      </div>
    </section>
  );
}
