"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Counter — count-up stat with overshoot + blur→0 snap (OVERHAUL-PLAN §3).
 *
 * - Fires once via IntersectionObserver (threshold 0.4).
 * - Easing: ease-out-back (slight overshoot — the number shoots a few percent
 *   past the target, then settles on it) over `duration` ms (default 1400).
 * - Simultaneously blur(4px) → blur(0px) snaps clear over the first ~60% of
 *   the run, so the digits land hard.
 * - `value` is a display string like "500+", "2 DAYS", "1 PLATFORM" — the
 *   leading number is parsed, counted up with comma formatting, and the
 *   suffix re-appended.
 * - prefers-reduced-motion: renders the final value immediately, no blur.
 */

/** Expo-out — DESIGN_SPEC motion token t => 1 - 2^(-10t). */
const expoOut = (t: number) => 1 - Math.pow(2, -10 * t);

/** Ease-out-back with a slight overshoot (~6% for SKEW = 1.2). */
const SKEW = 1.2;
const backOut = (t: number) =>
  1 + (SKEW + 1) * Math.pow(t - 1, 3) + SKEW * Math.pow(t - 1, 2);

const formatNumber = (n: number) => n.toLocaleString("en-US");

/** Split "500+" → { num: 500, suffix: "+" } (keeps commas in the digits). */
function parseValue(value: string): { num: number; suffix: string } {
  const match = value.match(/[\d,]+/);
  const digits = match ? match[0] : "";
  return {
    num: parseInt(digits.replace(/,/g, ""), 10) || 0,
    suffix: digits ? value.replace(digits, "") : value,
  };
}

export interface CounterProps {
  /** Display string — leading number is animated, suffix preserved. */
  value: string;
  label: string;
  /** Count-up duration in ms (recipe #4 default: 1400). */
  duration?: number;
  /** Extra delay before the count starts (seconds) — for staggered grids. */
  delay?: number;
  /** Class for the root element (number + label styling unchanged). */
  className?: string;
}

export function Counter({
  value,
  label,
  duration = 1400,
  delay = 0,
  className,
}: CounterProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const { num, suffix } = parseValue(value);
  const finalValue = formatNumber(num) + suffix;

  const [display, setDisplay] = useState(
    reduceMotion ? finalValue : formatNumber(0) + suffix,
  );

  useEffect(() => {
    // Reduced motion: final value immediately, no animation, no blur.
    if (reduceMotion) {
      setDisplay(finalValue);
      if (numberRef.current) numberRef.current.style.filter = "";
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now() + delay * 1000;
        const tick = (now: number) => {
          const t = Math.max(0, Math.min((now - start) / duration, 1));
          const eased = backOut(t);
          setDisplay(formatNumber(Math.round(num * eased)) + suffix);

          // blur(4px) → 0, snapping clear over the first 60% (expo-out).
          const numberEl = numberRef.current;
          if (numberEl) {
            const clear = expoOut(Math.min(t / 0.6, 1));
            const blurPx = 4 * (1 - clear);
            numberEl.style.filter =
              blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "";
          }

          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      if (numberRef.current) numberRef.current.style.filter = "";
    };
  }, [num, suffix, duration, delay, reduceMotion, finalValue]);

  return (
    <div ref={rootRef} className={className}>
      <div
        ref={numberRef}
        className="font-display text-6xl font-bold tracking-[-0.01em] text-[var(--paper)] md:text-7xl xl:text-8xl"
      >
        {display}
      </div>
      <p className="eyebrow mt-4 text-[var(--mist-400)]">{label}</p>
    </div>
  );
}
