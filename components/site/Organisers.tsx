"use client";

import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";

/**
 * S11 — FOUNDERS → HR VISTA organisers (opraah: "Meet The Founders").
 *
 * No portraits exist in the sources, so cards are typographic
 * monograms (per DESIGN_SPEC §2 S11) — no invented photos, no bios.
 */

function monogram(name: string): string {
  const acronym = name.match(/\(([A-Z0-9.]{2,})\)/);
  if (acronym) return acronym[1].slice(0, 4);
  const cleaned = name.replace(/^(Prof\.|Fr\.)\s+/, "");
  const words = cleaned.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w));
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function Organisers() {
  return (
    <section id="organisers" className="sec sec-dark overflow-hidden">
      <div className="deco" aria-hidden>
        <span className="pointer-events-none absolute -bottom-8 right-0 block font-display text-[20vw] leading-none font-extrabold tracking-tighter text-[var(--ink-800)] select-none">
          CPCG
        </span>
      </div>

      <div className="sec-layer content-max">
        <Reveal>
          <p className="eyebrow text-[var(--royal-300)]">The organisers</p>
        </Reveal>
        <div className="display-2 mt-4 max-w-4xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="Meet the people behind" />
          <HeadingWords as="div" delay={0.08} className="text-[var(--paper)]" text="HR VISTA." />
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.organisers.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.08} y={48}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-6 transition-colors duration-[var(--dur-base)] hover:border-[var(--royal-500)]">
                <span
                  aria-hidden
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--royal-500)] font-display text-xl font-bold text-white"
                >
                  {monogram(person.name)}
                </span>
                <h3 className="display-3 mt-5 text-lg text-[var(--paper)]">
                  {person.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mist-400)]">
                  {person.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
