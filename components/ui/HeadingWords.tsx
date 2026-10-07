import { Fragment, type CSSProperties, type ElementType } from "react";

/**
 * HeadingWords — the reference's per-word heading entrance.
 * ============================================================
 * opraah.in brings its headings in PER WORD: each word rises and settles on the
 * reference's bounce-0.2 spring, the words overlapping as they land. Doing it per
 * word rather than per line is what gives their type its hand-set, spoken feel —
 * you read the heading at the speed it arrives.
 *
 * WHY THIS IS NOT FRAMER-MOTION ANY MORE
 *   It used to be, with `initial="hidden"` and `whileInView="show"`. That wrote
 *   the hidden state — `opacity: 0.35` and `filter: blur(4px)` — into the
 *   SERVER-RENDERED markup, so with JS disabled, still loading, or failed, every
 *   section heading on the site sat washed out and blurred. That is the exact
 *   defect the reveal system in `Reveal.tsx` exists to prevent, which is why
 *   this component was only ever safe to use in two places.
 *
 *   It now rides the same CSS reveal system as everything else: `data-reveal`
 *   spans, the shared `--rd` stagger, and the shared `--rv-y` travel. So it
 *   inherits every guarantee for free —
 *
 *     · visible by default in the served HTML, with or without JS;
 *     · only ever pended by `RevealSafety`, and only below the fold;
 *     · pinned to final by the sweeper if an observer misses it;
 *     · plain text under `prefers-reduced-motion`.
 *
 *   It also drops framer-motion from the initial bundle of every section that
 *   uses a heading, which is most of them.
 *
 * LINE BREAKING
 *   Words are `inline-block` with a REAL space between them (not `&nbsp;` inside
 *   each word, which is what the previous version did) — otherwise a heading
 *   longer than its column cannot wrap and overflows instead.
 */

/** Seconds between words. 45ms reads as one gesture rather than a sequence. */
const DEFAULT_STAGGER = 0.045;
/** Travel in px — the section-heading end of the reference's 30–150px range. */
const DEFAULT_TRAVEL = 68;

export interface HeadingWordsProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Travel distance in px. */
  y?: number;
}

export function HeadingWords({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = DEFAULT_STAGGER,
  y = DEFAULT_TRAVEL,
}: HeadingWordsProps) {
  const words = text.split(" ");

  return (
    // One string for assistive tech; the per-word spans are hidden from it so a
    // screen reader reads the sentence rather than spelling it out.
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            aria-hidden
            data-reveal="rise"
            style={
              {
                "--rd": `${(delay + i * stagger).toFixed(3)}s`,
                "--rv-y": `${y}px`,
                display: "inline-block",
              } as CSSProperties
            }
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
