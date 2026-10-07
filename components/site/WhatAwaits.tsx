"use client";

import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";
import { WatermarkBand } from "./Sections";

/**
 * S5 — "Things we're Magnificent At Doing" (opraah).
 * Big service statements: small label column + oversized statement.
 */
export function WhatAwaits() {
  return (
    <section id="magnificent" className="sec sec-dark relative overflow-hidden">
      <div className="sec-layer content-max">
        {/* The reference's repeating display label, scrolled edge to edge. */}
        <WatermarkBand label="What awaits" className="mb-[var(--space-md)]" />

        {/* Section lockup — opraah's exact stack */}
        <Reveal>
          <p className="eyebrow text-[var(--mist-400)]">Things we&apos;re</p>
        </Reveal>
        <div className="mt-3">
          <HeadingWords
            as="div"
            y={96}
            className="display-1 text-[length:var(--text-hero)] text-[var(--royal-500)]"
            text="Magnificent"
          />
          <HeadingWords
            as="div"
            delay={0.08}
            className="display-2 mt-2 text-[length:var(--text-section)] text-[var(--paper)]"
            text="At Doing"
          />
        </div>

        <div className="mt-10 border-t border-[var(--ink-700)]">
          {content.whatAwaits.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} y={44}>
              <div className="group grid gap-3 border-b border-[var(--ink-700)] py-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-10 md:py-7">
                <p className="eyebrow pt-2 text-[var(--mist-400)] transition-colors duration-[var(--dur-fast)] group-hover:text-[var(--royal-500)]">
                  {item.title}
                </p>
                <p className="display-3 text-[length:clamp(1.35rem,2.9vw,2.6rem)] text-[var(--paper)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-expo)] group-hover:translate-x-2">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
