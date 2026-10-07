"use client";

import { FlipBook } from "@/components/ui/FlipBook";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";

/**
 * S10 — MAGAZINE FLIP (opraah: "Flip through it. Trust us. /
 * Tap on the magazine").
 *
 * Uses the existing FlipBook primitive over the 10 rendered pages of
 * HR 3.0.pdf in /brochure/.
 */

const PAGES = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/brochure/page-${n}.png`,
    alt: `HR VISTA 3.0 brochure — page ${n}`,
    caption: `Page ${n}`,
  };
});

export function BrochureFlip() {
  return (
    <section id="brochure" className="sec sec-light overflow-hidden">
      <div className="sec-layer content-max">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="display-2 max-w-3xl text-[length:var(--text-section)]">
            <HeadingWords as="div" text="Flip through it." />
            <HeadingWords as="div" delay={0.08} className="text-[var(--royal-500)]" text="Trust us." />
          </div>
          <Reveal delay={0.12} y={32}>
            <p className="eyebrow text-[var(--signal)]">Tap on the magazine</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-8">
          <FlipBook pages={PAGES} aspect="210 / 297" className="mx-auto max-w-3xl" />
        </Reveal>

        <p className="mt-6 text-center text-sm text-[var(--mist-400)]">
          HR VISTA 3.0 official brochure · 10 pages · use ← / → to turn
        </p>
      </div>
    </section>
  );
}
