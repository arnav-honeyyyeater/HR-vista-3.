"use client";

import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";

/**
 * S6 — "THINGS WE'RE... AH... NOT SO GREAT AT..." (opraah).
 * Playful alternating-type list: small line / oversized line / small…
 * Rhythm copied from the reference; copy is HR-VISTA flavoured.
 */

const ITEMS: { text: string; big: boolean }[] = [
  { text: "Sitting through a slide that could have been a conversation", big: false },
  { text: "Calling a two-day conclave “just a seminar”", big: true },
  { text: "Ending a panel on time", big: false },
  { text: "Small thinking", big: true },
  { text: "Keeping the hallway conversations short", big: false },
  { text: "Pretending the coffee ran out", big: true },
  { text: "Choosing one favourite speaker", big: false },
  { text: "One-size-fits-all policy", big: true },
];

export function FlavorList() {
  return (
    <section id="not-great-at" className="sec sec-light overflow-hidden">
      <div className="sec-layer content-max">
        <Reveal>
          <p className="eyebrow text-[var(--signal)]">
            Things we&apos;re… ah… not so great at…
          </p>
        </Reveal>

        <div className="display-2 mt-6 max-w-5xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="THINGS WE'RE… AH…" />
          <HeadingWords
            as="div"
            delay={0.08}
            className="text-[var(--royal-500)]"
            text="NOT SO GREAT AT…"
          />
        </div>

        <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {ITEMS.map((item, i) => (
            <li key={item.text}>
              <Reveal delay={(i % 4) * 0.05} y={32}>
                <span
                  className={
                    item.big
                      ? "display-3 text-[length:clamp(1.5rem,3vw,2.5rem)] text-[var(--ink-900)]"
                      : "block text-base leading-snug font-medium text-[var(--mist-400)] md:text-lg"
                  }
                >
                  {item.big && (
                    <span aria-hidden className="mr-2 text-[var(--royal-500)]">
                      —
                    </span>
                  )}
                  {item.text}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
