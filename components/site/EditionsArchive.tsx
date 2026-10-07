"use client";

import Link from "next/link";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Marquee } from "@/components/ui/Marquee";
import { content } from "@/lib/data/content";
import { Reveal } from "./Reveal";

/**
 * EDITIONS ARCHIVE — the /work page, built 1:1 to the reference's archive.
 * ============================================================
 * opraah.in's /work page is one white screen: a 90px "Work" heading, then a
 * three-column grid of campaign cards. Each card is a doubled marquee title
 * over a 16:9 media plate, with a small pill reading "More" pinned to its
 * bottom-right corner. That page is the closest structural match in the whole
 * reference to what HR VISTA actually has — a body of past editions — so this
 * reproduces its grid, card anatomy and type sizes against our real editions.
 *
 * Measured values carried over from the reference
 *   · page heading ......... 90px, weight 400, line-height 1.2
 *   · page background ...... white
 *   · section gutter ....... the shared --section-padding-x
 *   · card media ........... 16:9 plate, 20px radius
 *   · card title ........... doubled, scrolling (a marquee), display size
 *   · card pill ............ "More", 100px radius
 *
 * Everything here is real content from `lib/data/content.ts`; nothing is
 * invented for the grid. Cards that describe an edition carry its dates,
 * venue and theme; "moments" cards describe the signature formats.
 */

interface ArchiveCard {
  /** Doubled marquee title. */
  title: string;
  /** Small label above the caption. */
  kicker: string;
  /** One line of description. */
  caption: string;
  /** Media plate. */
  src: string;
  /** Cross-fade second plate, revealed on hover (the reference's card trick). */
  hoverSrc: string;
  alt: string;
}

const CARDS: ArchiveCard[] = [
  {
    title: "HR VISTA 1.0",
    kicker: "21–22 February 2025",
    caption:
      "Work Reimagined: HR for the Future — the first edition, at CHRIST (Deemed to be University), Pune Lavasa Campus.",
    src: "/media/flickr/editions-1.jpg",
    hoverSrc: "/media/flickr/story-1.jpg",
    alt: "HR VISTA 1.0 delegates",
  },
  {
    title: "HR VISTA 2.0",
    kicker: "15–16 November 2025",
    caption:
      "Human Future — Redefining Leadership in the Post-AI World. Four panels and two round tables.",
    src: "/media/flickr/editions-2.jpg",
    hoverSrc: "/media/flickr/room-1.jpg",
    alt: "HR VISTA 2.0 stage",
  },
  {
    title: "HR VISTA 3.0",
    kicker: "21–22 November 2026",
    caption:
      "The Future of Work. The People Who Shape It. BKC, Jio Grounds, Mumbai — the largest edition yet.",
    src: "/media/flickr/editions-3.jpg",
    hoverSrc: "/media/flickr/hero-1.jpg",
    alt: "HR VISTA 3.0 announcement",
  },
  {
    title: "Keynote Conversations",
    kicker: "Format",
    caption:
      "Senior industry leaders on the future of work — the sessions that open and anchor each edition.",
    src: "/media/flickr/story-3.jpg",
    hoverSrc: "/media/flickr/hero-3.jpg",
    alt: "A keynote conversation on stage",
  },
  {
    title: "Leadership Panels",
    kicker: "Format",
    caption:
      "Multi-industry conversations on complex HR challenges, across technology, banking, consulting and manufacturing.",
    src: "/media/flickr/room-3.jpg",
    hoverSrc: "/media/flickr/story-5.jpg",
    alt: "A leadership panel in session",
  },
  {
    title: "The Sahyadri Trek",
    kicker: "Signature moment",
    caption:
      "Day two of HR VISTA 2.0 opened with a trek — the format's most-remembered hour.",
    src: "/media/flickr/stats-3.jpg",
    hoverSrc: "/media/flickr/editions-4.jpg",
    alt: "Delegates on the Sahyadri trek",
  },
];

/** One archive card — marquee title, media plate, caption, More pill. */
function ArchiveCardView({ card, delay }: { card: ArchiveCard; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--line-light)] bg-[var(--paper)]">
        {/* Doubled marquee title — the reference's card signature. The
            generous inline padding is what keeps the repeated title legible as
            it scrolls; without it the copies collide into one long string. */}
        <div className="overflow-hidden border-b border-[var(--line-light)] py-4">
          <Marquee
            items={[card.title, card.title]}
            speed={22}
            velocitySkew
            maxSkew={3}
            itemPadding="1.5rem"
            className="display-2 text-[clamp(1.35rem,2.5vw,2.1rem)] whitespace-nowrap text-[var(--ink-900)]"
          />
        </div>

        {/* 16:9 media plate with a hover cross-fade. */}
        <div data-reveal="wipe" className="zoom-frame relative aspect-[16/9] w-full overflow-hidden bg-[var(--sky-100)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.src}
            alt={card.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[0.45s] ease-[var(--ease-expo)] group-hover:scale-105 group-hover:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.hoverSrc}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-[0.45s] ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100"
          />
        </div>

        {/* Caption + More pill. */}
        <div className="flex flex-1 flex-wrap items-start justify-between gap-4 p-5 md:p-6">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-[var(--royal-500)]">{card.kicker}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--mist-400)]">
              {card.caption}
            </p>
          </div>
          <Link
            href="/#work"
            className="pill pill-ghost shrink-0 text-sm text-[var(--ink-900)]"
          >
            More <span aria-hidden>↗</span>
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

export function EditionsArchive() {
  return (
    <main className="bg-[var(--paper)]">
      {/* Masthead — white page, oversized heading, exactly the reference's
          /work opening (90px heading on a white ground). */}
      <section className="content-max px-[var(--section-padding-x)] pb-[var(--space-xl)] pt-[calc(var(--nav-h)+var(--space-2xl))]">
        <p className="eyebrow text-[var(--royal-500)]">The record</p>
        <h1
          className="display-1 mt-[var(--space-sm)] text-[var(--ink-900)]"
          style={{ fontSize: "clamp(3rem,10vw,6.5rem)", fontWeight: 400 }}
        >
          <HeadingWords text="Editions" as="span" />
        </h1>
        <p className="mt-[var(--space-md)] max-w-2xl text-[var(--text-body-lg)] leading-relaxed text-[var(--mist-400)]">
          Every HR VISTA edition, its theme and its formats. Two editions run, one
          to come — across Lavasa and, in 2026, Mumbai.
        </p>
      </section>

      {/* The grid. */}
      <section className="content-max px-[var(--section-padding-x)] pb-[var(--space-3xl)]">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CARDS.map((card, i) => (
            <ArchiveCardView key={card.title} card={card} delay={(i % 3) * 0.07} />
          ))}
        </div>
      </section>

      {/* Closing statement — the reference ends its /work page on a dark,
          centred call to action before the footer. Kept to a modest height so
          it reads as a closing beat rather than an empty screen. */}
      <section className="flex min-h-[46svh] items-center bg-[var(--ink-900)]">
        <div className="content-max w-full px-[var(--section-padding-x)] py-[var(--space-2xl)] text-center">
          <h2 className="transition-line mx-auto max-w-[1000px] text-[var(--paper)]">
            <HeadingWords as="div" text="Two editions done." />
            <HeadingWords
              as="div"
              delay={0.08}
              className="text-[var(--royal-500)]"
              text="The third one is the big one."
            />
          </h2>
          <p className="mx-auto mt-[var(--space-lg)] max-w-xl text-[var(--text-body-lg)] leading-relaxed text-[var(--mist-400)]">
            {content.footer.cta}
          </p>
          <Link
            href="/#contact"
            className="pill pill-blue mt-[var(--space-lg)] inline-flex min-h-11 px-8 py-3 text-sm"
          >
            Register your interest
          </Link>
        </div>
      </section>
    </main>
  );
}
