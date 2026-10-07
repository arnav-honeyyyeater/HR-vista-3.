"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * ScrollRevealText — words that light up as you read down the page.
 * ============================================================
 * This is the reference's dominant typographic motion. Every long statement on
 * opraah.in — "We started in 2017", "Creators are the most powerful
 * storytellers alive." — arrives word by word, driven entirely by scroll
 * position rather than a timer, so the reader sets the pace. It is what makes
 * their long-form copy feel spoken rather than displayed.
 *
 * IMPLEMENTATION
 *   One `useScroll` on the block gives progress 0→1 across the block's pass
 *   through the viewport. Each word maps a slice of that progress to its own
 *   opacity, so word *i* of *n* lights between `i/n` and `(i+1)/n` of the
 *   scroll. Slices overlap by `SPREAD` so the illumination sweeps continuously
 *   rather than stepping from word to word.
 *
 *   Each word needs its own `useTransform`, which is why words are rendered as
 *   components — hooks cannot be called inside a loop.
 *
 * ACCESSIBILITY
 *   - The block is exposed as ONE string via `aria-label`, with the word spans
 *     hidden, so a screen reader reads the sentence instead of spelling it.
 *   - `prefers-reduced-motion`: no scroll coupling at all — the sentence simply
 *     renders at full strength.
 *   - The words are real server-rendered text, always in the DOM, selectable
 *     and searchable. The dimmed state is an opacity floor, never `display`
 *     or `visibility`, so nothing here can hide content from a crawler.
 */

/** Word-slice overlap, as a fraction of one slice. Higher = softer sweep. */
const SPREAD = 0.6;

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  /** Start of this word's slice within the block's scroll progress, 0–1. */
  from: number;
  /** Opacity before the word is reached. */
  floor: number;
  /** Colour pair for the sweep — unread → read. Omitted = opacity only. */
  tint?: readonly [string, string];
}

function Word({ children, progress, from, floor, tint }: WordProps) {
  const opacity = useTransform(progress, [from, from + SPREAD], [floor, 1]);
  // Colour is interpolated alongside opacity when a tint is supplied. Both
  // tracks share the same slice, so a word arrives in colour and weight at once
  // rather than lingering as a half-lit ghost.
  const color = useTransform(
    progress,
    [from, from + SPREAD],
    tint ? [tint[0], tint[1]] : ["currentColor", "currentColor"],
  );
  return (
    <motion.span aria-hidden style={{ opacity, color }} className="inline-block">
      {children}
    </motion.span>
  );
}

export interface ScrollRevealTextProps {
  text: string;
  /** Element to render as. Default `p`. */
  as?: "p" | "div" | "h2" | "h3" | "span";
  className?: string;
  /**
   * Resting opacity of a word the reader has not reached yet.
   *
   * Defaults to 0.22 for a plain opacity sweep on light ground, and to **1**
   * when a `tint` is supplied — see `tint`. Pass it explicitly to override.
   */
  floor?: number;
  /**
   * Scroll-driven colour sweep as `[unread, read]`.
   *
   * The reference colours its long statements as it reveals them, and it is
   * worth copying for a plain readability reason: an opacity-only sweep leaves
   * the unreached words the same hue as the reached ones, so the reader cannot
   * tell "not yet revealed" from "de-emphasised".
   *
   * Supplying a tint therefore defaults `floor` to 1: the copy is fully opaque
   * the whole time and **colour alone** carries the sweep, which is both what
   * the reference does and the only version that never dims text the reader is
   * mid-sentence on. Pass an explicit `floor` to combine the two.
   */
  tint?: readonly [string, string];
}

export function ScrollRevealText({
  text,
  as = "p",
  className = "",
  floor,
  tint,
}: ScrollRevealTextProps) {
  const restingOpacity = floor ?? (tint ? 1 : 0.22);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() === true;

  const { scrollYProgress } = useScroll({
    target: ref,
    // Begin as the block enters, finish while it is still comfortably in view,
    // so the final word is solid before the reader reaches the next section.
    offset: ["start 0.85", "end 0.45"],
  });

  const words = useMemo(() => text.split(" "), [text]);

  // Slice start per word. The last word must still be able to reach 1, so the
  // usable range is compressed by SPREAD and the leftovers spread evenly.
  const starts = useMemo(() => {
    const n = Math.max(words.length, 1);
    const span = 1 - SPREAD;
    return words.map((_, i) => (n === 1 ? 0 : (i / (n - 1)) * span));
  }, [words]);

  const Tag = as as "p";

  if (reduce) {
    return (
      <Tag ref={ref as never} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <Word progress={scrollYProgress} from={starts[i]} floor={restingOpacity} tint={tint}>
            {w}
          </Word>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
