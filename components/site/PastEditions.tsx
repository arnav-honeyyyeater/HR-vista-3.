"use client";

import { Marquee } from "@/components/ui/Marquee";
import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";

/**
 * S8 — "OUR WORK" (DESIGN BRIEF V4 §2: "Past Editions = big media tiles with
 * marquee titles").
 *
 * Two editions → two oversized media tiles. The photograph is the card; the
 * copy is a label stack (theme eyebrow + dates/venue caption + a short note).
 * Body copy cut hard to satisfy the 40-word declutter rule.
 *
 * Motion: doubled marquee title with velocity skew (marquee system #2 of 3),
 * masked wipe-in on the media, 1.05/0.35s hover zoom + frame cross-fade,
 * 8px hover lift.
 */

interface Card {
  title: string;
  caption: string;
  theme: string;
  notes: string;
  primary: string;
  secondary: string;
  alt: string;
}

const CARDS: Card[] = [
  {
    title: content.pastEditions[0].edition,
    caption: `${content.pastEditions[0].dates} · ${content.pastEditions[0].venue}`,
    theme: content.pastEditions[0].theme,
    notes: content.pastEditions[0].notes,
    primary: "/media/flickr/editions-1.jpg",
    secondary: "/media/flickr/editions-2.jpg",
    alt: "HR VISTA 1.0",
  },
  {
    title: content.pastEditions[1].edition,
    caption: `${content.pastEditions[1].dates} · ${content.pastEditions[1].venue}`,
    theme: content.pastEditions[1].theme,
    notes: content.pastEditions[1].notes,
    primary: "/media/flickr/editions-3.jpg",
    secondary: "/media/flickr/editions-4.jpg",
    alt: "HR VISTA 2.0",
  },
];

function WorkCard({ card, delay }: { card: Card; delay: number }) {
  return (
    <article className="group lift h-full overflow-hidden rounded-[var(--radius-panel)] border border-[var(--mist-200)] bg-[var(--paper)] hover:border-[var(--royal-500)]">
      {/* Marquee title strip (marquee system 2 of 3) */}
      <div className="bleed border-b border-[var(--mist-200)] py-4">
        <Marquee
          speed={26}
          velocitySkew
          items={[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="display-2 px-3 text-[clamp(1.6rem,3.4vw,3rem)] whitespace-nowrap text-[var(--ink-900)]"
            >
              {card.title}
              <span className="px-3 text-[var(--royal-500)]">×</span>
            </span>
          ))}
        />
      </div>

      {/* Media with hover cross-fade — the card's whole point */}
      <div
        data-reveal="wipe"
        style={{ ["--rd" as string]: `${delay}s` }}
        className="zoom-frame relative aspect-[16/10] w-full overflow-hidden bg-[var(--sky-100)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.primary}
          alt={card.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-[0.45s] ease-[var(--ease-expo)] group-hover:scale-105 group-hover:opacity-0"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.secondary}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-[0.45s] ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100"
        />
      </div>

      {/* Caption — labels, not prose */}
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 md:p-7">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[var(--royal-500)]">{card.theme}</p>
          <p className="mt-2 text-sm text-[var(--mist-400)]">{card.caption}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-900)]">
            {card.notes}
          </p>
        </div>
        <a
          href="#brochure"
          className="pill pill-ghost shrink-0 text-sm text-[var(--ink-900)]"
        >
          More <span aria-hidden>↗</span>
        </a>
      </div>
    </article>
  );
}

export function PastEditions() {
  return (
    <section id="work" className="sec sec-light overflow-hidden">
      <div className="sec-layer content-max">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-[var(--signal)]">Past editions</p>
            <div className="display-2 mt-4 max-w-4xl text-[length:var(--text-section)]">
              <HeadingWords as="div" text="Two editions already." />
              <HeadingWords
                as="div"
                delay={0.07}
                className="text-[var(--mist-400)]"
                text="Each one raised the bar."
              />
            </div>
          </div>
          <p className="eyebrow text-[var(--mist-400)]">1.0 / 2.0</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-7">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08} className="h-full">
              <WorkCard card={card} delay={i * 0.08} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
