"use client";

import type { ElementType, ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * MaskedText — masked line rise with stagger (OVERHAUL-PLAN §3 entrances).
 *
 * Each line lives in an overflow-hidden mask and slides up from y:110% to 0
 * with the expo-out token cubic-bezier(0.16, 1, 0.3, 1): 0.9s per line,
 * 75ms stagger between lines (plan range 60–90ms), optional blur(4px)→0.
 *
 * Reveal is IN-VIEW (whileInView, once) rather than on-mount, so headings
 * below the fold actually animate when the reader reaches them. Pass
 * `onMount` to get the old fire-immediately behaviour (hero rows).
 *
 * prefers-reduced-motion: variants start at the final state — instant, no
 * transform, no blur.
 */

/** Expo-out — DESIGN_SPEC motion token `cubic-bezier(0.16, 1, 0.3, 1)`. */
const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Mirrors framer's MarginType (not exported) so viewportMargin type-checks. */
type MarginValue = `${number}px` | `${number}%`;
type ViewportMargin =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export interface MaskedTextProps {
  /** Element tag for each masked line wrapper. */
  as?: ElementType;
  className?: string;
  /** Lines to reveal — an array of lines, or a single child (wrapped as one line). */
  children: ReactNode | ReactNode[];
  /** Delay before the reveal starts (seconds). */
  delay?: number;
  /** Seconds between lines (plan: 60–90ms). Default 0.075. */
  stagger?: number;
  /** Seconds per line (plan: 0.7–1.0s). Default 0.9. */
  duration?: number;
  /** Add blur(4px) → 0 to each line's rise. Default false (cheaper). */
  blur?: boolean;
  /** Reveal once (default) or re-reveal on every enter. */
  once?: boolean;
  /** In-view trigger margin. Default "-80px 0px -80px 0px". */
  viewportMargin?: ViewportMargin;
  /** Reveal on mount instead of waiting for in-view (hero rows). */
  onMount?: boolean;
}

/** Shared start/end states for a single masked line. */
function lineVariants(
  reduceMotion: boolean,
  blur: boolean,
  duration: number,
): Variants {
  const hidden = reduceMotion
    ? { y: 0, filter: "blur(0px)" }
    : { y: "110%", filter: blur ? "blur(4px)" : "blur(0px)" };
  return {
    hidden,
    show: {
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: REVEAL_EASE },
    },
  };
}

/** Single masked line — inner span slides up inside an overflow-hidden wrapper. */
export function MaskedLine({
  children,
  className = "",
  blur = false,
  duration = 0.9,
}: {
  children: ReactNode;
  className?: string;
  blur?: boolean;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion() === true;
  const variants = lineVariants(reduceMotion, blur, duration);

  return (
    <span className={`mask-line block ${className}`} aria-hidden={false}>
      <motion.span
        className="block will-change-transform"
        variants={variants}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * MaskedText — a stack of masked lines with staggered reveal.
 *
 *   <MaskedText as="h2" delay={0.15}>Line one{<br />}Line two</MaskedText>
 */
export function MaskedText({
  as: Tag = "span",
  className = "",
  children,
  delay = 0,
  stagger = 0.075,
  duration = 0.9,
  blur = false,
  once = true,
  viewportMargin = "-80px 0px -80px 0px",
  onMount = false,
}: MaskedTextProps) {
  const reduceMotion = useReducedMotion() === true;
  const lines = Array.isArray(children) ? children : [children];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const variants = lineVariants(reduceMotion, blur, duration);
  const initial = reduceMotion ? "show" : "hidden";
  const viewport = { once, margin: viewportMargin } as const;

  return (
    <motion.span
      className={className}
      variants={container}
      initial={initial}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      style={{ display: "block" }}
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport })}
    >
      {lines.map((line, i) => (
        <Tag key={i} className="mask-line block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            variants={variants}
          >
            {line}
          </motion.span>
        </Tag>
      ))}
    </motion.span>
  );
}
