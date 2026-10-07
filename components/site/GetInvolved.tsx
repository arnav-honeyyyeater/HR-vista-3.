"use client";

import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";

/**
 * S13 — HIRING CARDS → "Get involved" (opraah: "By the way, We are
 * hiring!" + pill-tagged role cards).
 *
 * Card copy is the brochure's own participation routes (content.getInvolved)
 * — no invented facts.
 */

const CARDS = [
  {
    tag: "On campus",
    title: "Volunteer",
    eyebrow: content.getInvolved[2].title,
    body: content.getInvolved[2].description,
  },
  {
    tag: "With us",
    title: "Partner",
    eyebrow: content.getInvolved[1].title,
    body: content.getInvolved[1].description,
  },
  {
    tag: "On stage",
    title: "Speak",
    eyebrow: content.getInvolved[0].title,
    body: content.getInvolved[0].description,
  },
];

export function GetInvolved() {
  return (
    <section id="involved" className="sec sec-dark overflow-hidden">
      <div className="sec-layer content-max">
        <div className="display-2 max-w-4xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="By the way —" />
          <HeadingWords
            as="div"
            delay={0.08}
            className="text-[var(--royal-500)]"
            text="there's a way in."
          />
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08} y={56}>
              <a
                href="#contact"
                className="group lift flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--ink-700)] bg-[var(--ink-800)] p-6 hover:border-[var(--royal-500)] md:p-7"
              >
                <span className="inline-flex w-fit rounded-full border border-[var(--royal-500)] px-3 py-1 text-xs font-semibold tracking-wide text-[var(--royal-300)]">
                  {card.tag}
                </span>
                <h3 className="display-2 mt-5 text-[length:clamp(1.75rem,3vw,2.5rem)] text-[var(--paper)]">
                  {card.title}
                </h3>
                <p className="eyebrow mt-4 text-[var(--mist-400)]">{card.eyebrow}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--mist-400)]">
                  {card.body}
                </p>
                <span
                  aria-hidden
                  className="mt-6 inline-block text-[var(--royal-500)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-expo)] group-hover:translate-x-1"
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
