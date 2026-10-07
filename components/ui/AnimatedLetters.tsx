"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType } from "react";

/**
 * AnimatedLetters — the reference's display-type entrance, rebuilt.
 *
 * opraah.in animates its display headlines per CHARACTER: each glyph springs
 * from y −150 with a bounce of 0.2 over ~0.4s (docs/OPRAAH-HERO-SCRAPE.md —
 * "All their animations: spring, bounce 0.2, duration 0.4–1.2s … y −150→0").
 * Handled naively that is one spring per letter, which across a two-line
 * display headline means well over a hundred concurrently animating nodes.
 *
 * So this deliberately does NOT run one fps-costly spring per glyph. It
 * reproduces the same *look* — glyphs rising with a soft overshoot, sweeping
 * across the line — using a single shared Framer variant with a per-letter
 * staircase delay. The stagger is what reads as the springy sweep.
 *
 * Contract
 *   - the text is real, selectable, server-rendered text; each glyph gets a
 *     wrapper, and words stay in their own inline-block so nothing breaks
 *     mid-word.
 *   - the run is announced once via aria-label, with the glyph spans hidden,
 *     so a screen reader reads the sentence rather than spelling it.
 *   - `prefers-reduced-motion: reduce` renders the plain string with no
 *     wrappers and no animation — content is never gated on an animation.
 */

/** Framer's bounce-0.2 spring, expressed as an overshooting cubic-bezier. */
const RISE_EASE: [number, number, number, number] = [0.22, 1.2, 0.36, 1];

export interface AnimatedLettersProps {
  /** Text to split. A plain string only, so the aria-label stays reliable. */
  text: string;
  /** Element to render as. Default `span`. */
  as?: ElementType;
  className?: string;
  /** Seconds before the first glyph moves. */
  delay?: number;
  /** Seconds added per glyph — the sweep. Default 0.022 (≈45 glyphs/second). */
  stagger?: number;
  /** Seconds each glyph takes to rise. Default 0.55. */
  duration?: number;
  /**
   * Play on mount (`true`) or when scrolled into view (default `false`).
   * Hero lines mount; everything below the fold reveals in view.
   */
  onMount?: boolean;
}

export function AnimatedLetters({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.022,
  duration = 0.55,
  onMount = false,
}: AnimatedLettersProps) {
  const reduceMotion = useReducedMotion() === true;

  // Reduced motion (and the SSR pass, which has no media query): plain text.
  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  /** One glyph: rises from below the baseline with a slight overshoot. */
  const glyphVariant: Variants = {
    hidden: { y: "-0.4em", opacity: 0.001 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration, ease: RISE_EASE },
    },
  };

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      aria-label={text}
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-60px" } })}
    >
      {words.map((word, w) => (
        <span
          key={w}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {Array.from(word).map((ch, i) => (
            <motion.span
              key={i}
              variants={glyphVariant}
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {ch}
            </motion.span>
          ))}
          {/* The space sits outside the nowrap word box, so lines may break. */}
          {w < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * AnimatedLettersLine — a display line whose glyphs rise out of a mask.
 *
 * The mask is what gives the entrance its "lifting off the page" read; without
 * it the glyphs would visibly travel down from above the line box. The mask is
 * padded and pulled back by an equal negative margin so a tight display
 * line-height (0.88) never clips ascenders or descenders.
 */
export function AnimatedLettersLine({
  text,
  className = "",
  delay = 0,
  stagger = 0.022,
  onMount = false,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  onMount?: boolean;
  as?: ElementType;
}) {
  return (
    <span
      className="mask-line block"
      style={{ padding: "0.08em 0", margin: "-0.08em 0" }}
    >
      <AnimatedLetters
        as={Tag}
        text={text}
        className={className}
        delay={delay}
        stagger={stagger}
        onMount={onMount}
      />
    </span>
  );
}
