"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * ScrollVelocity — velocity-reactive motion utilities (OVERHAUL-PLAN §3).
 *
 * The page runs on Lenis (components/providers/LenisProvider.tsx), which
 * scrolls the real window, so `window.scrollY` is always authoritative —
 * no Lenis instance access needed, which keeps this SSR-safe and decoupled
 * from whoever mounts the smoother.
 *
 * Contract:
 *   - returns a MotionValue in [-1, 1] where ±1 ≈ "fast scroll"
 *     (~60px per 60fps frame ≈ 3600px/s).
 *   - rAF loop only runs while the page is actually moving; it stops and
 *     resets to 0 when the scroll settles ("settles calm at rest").
 *   - `prefers-reduced-motion` ⇒ constant 0, no listeners at all.
 *   - every listener / rAF handle is torn down on unmount.
 */

/** px per 60fps frame that counts as "fast" (normaliser → velocity 1.0). */
const FAST_PX_PER_FRAME = 60;
/** Max skew in degrees at |velocity| = 1 (plan §3: max ~6deg). */
export const MAX_VELOCITY_SKEW = 6;
/** Subtle hero-row skew ceiling (plan §3: "skewX ≤4deg"). */
export const SUBTLE_VELOCITY_SKEW = 4;

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

export interface UseScrollVelocityOptions {
  /** When false the hook stays at 0 and attaches no listeners. Default true. */
  enabled?: boolean;
}

/**
 * Normalised scroll velocity as a MotionValue ([-1, 1], sign = direction).
 * Fast attack (0.35), slow release (0.10) so it snaps while scrolling and
 * eases back to 0 the moment the wheel stops.
 */
export function useScrollVelocity(
  options: UseScrollVelocityOptions = {},
): MotionValue<number> {
  const { enabled = true } = options;
  const reduceMotion = useReducedMotion();
  const velocity = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined" || !enabled || reduceMotion) {
      velocity.set(0);
      return;
    }

    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let lastMoveT = lastT;
    let value = 0;

    const tick = (now: number) => {
      const dt = clamp(now - lastT, 1, 120);
      lastT = now;

      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) >= 1) lastMoveT = now;

      // px/frame → normalised target
      const perFrame = (dy / dt) * 16.667;
      const target = clamp(perFrame / FAST_PX_PER_FRAME, -1, 1);

      // Attack fast, release slow; explicit decay once scrolling stops.
      const ease = Math.abs(target) > Math.abs(value) ? 0.35 : 0.1;
      value += (target - value) * ease;
      if (now - lastMoveT > 140) value += (0 - value) * 0.3;
      if (Math.abs(value) < 0.003) value = 0;
      velocity.set(value);

      // Idle → stop the loop (keeps the resting page completely still).
      if (value === 0 && now - lastMoveT > 400) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // passive scroll: Lenis animates the real window, so every frame fires here
    window.addEventListener("scroll", kick, { passive: true });
    kick();

    return () => {
      window.removeEventListener("scroll", kick);
      if (raf) cancelAnimationFrame(raf);
      velocity.set(0);
    };
  }, [enabled, reduceMotion, velocity]);

  return velocity;
}

/**
 * Scroll velocity mapped to skewX in degrees, run through a spring so the
 * skew always settles flat (overdamped — no bounce).
 * Scrolling down leans the text forward (italic-ish), scrolling up mirrors it.
 */
export function useVelocitySkew(
  maxDeg: number = MAX_VELOCITY_SKEW,
  enabled: boolean = true,
): MotionValue<number> {
  const velocity = useScrollVelocity({ enabled });
  const target = useTransform(velocity, [-1, 1], [maxDeg, -maxDeg]);
  return useSpring(target, {
    stiffness: 170,
    damping: 22,
    mass: 0.4,
  });
}

/** Convenience: `{ skewX }` style fragment for any motion element. */
export function useVelocitySkewStyle(
  maxDeg: number = MAX_VELOCITY_SKEW,
  enabled: boolean = true,
): CSSProperties {
  const skewX = useVelocitySkew(maxDeg, enabled);
  return { skewX } as unknown as CSSProperties;
}

/** Velocity-driven vertical nudge (px at |velocity| = 1) — for media layers. */
export function useVelocityY(
  amplitude: number = 40,
  enabled: boolean = true,
): MotionValue<number> {
  const velocity = useScrollVelocity({ enabled });
  const target = useTransform(velocity, [-1, 1], [amplitude, -amplitude]);
  return useSpring(target, {
    stiffness: 140,
    damping: 20,
    mass: 0.4,
  });
}

export interface ScrollVelocitySkewProps {
  children: ReactNode;
  /** Max skew in degrees at full speed. Default 6 (plan §3 ceiling). */
  max?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wrapper that skews its children with scroll velocity and settles flat.
 * Reduced motion ⇒ velocity is pinned to 0, so this renders statically.
 */
export function ScrollVelocitySkew({
  children,
  max = MAX_VELOCITY_SKEW,
  className,
  style,
}: ScrollVelocitySkewProps) {
  const skewX = useVelocitySkew(max);

  return (
    <motion.div
      className={className}
      style={{ ...style, skewX, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
