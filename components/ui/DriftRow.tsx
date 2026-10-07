"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useVelocitySkew, SUBTLE_VELOCITY_SKEW } from "./ScrollVelocity";

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

/**
 * DriftRow — scroll-scrubbed horizontal drift for headline rows
 * (OVERHAUL-PLAN §3 "Opraah choreography support": hero headline rows drift
 * horizontally with scroll, alternating directions).
 *
 * The row's x is linked to the progress of its CONTAINING <section>:
 *
 *   progress = clamp(-sectionRect.top / sectionHeight, 0, 1)
 *   x        = progress * direction * distance
 *
 * which is exactly the old Hero.tsx hand-rolled scrub
 * (framer `useScroll` target + offset ["start start", "end start"]). It is
 * measured in our own rAF-throttled scroll loop: the section is resolved in
 * a ref callback (commit phase, before any effect) so there is no
 * target-tracking race, and native scroll events are what Lenis emits — so
 * the drift stays locked to the smoother. Every listener is torn down on
 * unmount.
 *
 * - `distance` = total travel in px (plan: 80–120px). Default 80.
 * - `direction` 1 = drifts right (positive x), -1 = drifts left. Omit it and
 *   pass `index` to alternate automatically (0 → right, 1 → left, 2 → right…).
 * - `skew` adds velocity-reactive skewX (≤4deg) on top of the drift.
 * - prefers-reduced-motion ⇒ x = 0, skew = 0 (static final state).
 * - desktopOnly (default true) keeps 390px viewports free of horizontal drift.
 */

export interface UseDriftXOptions {
  /** Total horizontal travel in px. Default 80. */
  distance?: number;
  /** 1 → drifts positive x, -1 → negative x. Default 1. */
  direction?: 1 | -1;
  /** Disable the drift entirely (reduced motion / mobile). Default true. */
  enabled?: boolean;
  /** Attach scroll-velocity skewX too (≤ SUBTLE_VELOCITY_SKEW deg). */
  skew?: boolean;
  /** Explicit scroll-range target. Defaults to the nearest <section>. */
  targetRef?: RefObject<HTMLElement | null>;
}

export interface DriftControls {
  /** Attach to the drifting element. */
  ref: Ref<HTMLDivElement>;
  /** Scroll-scrubbed x (px) — pass to a motion element. */
  x: MotionValue<number>;
  /** Scroll-velocity skewX (deg) — pass to a motion element. */
  skewX: MotionValue<number>;
}

/**
 * Hook form — for site code that wants the MotionValues on its own element:
 *   const { ref, x, skewX } = useDriftX({ distance: 100, direction: -1 });
 *   <motion.div ref={ref} style={{ x, skewX }}>…</motion.div>
 */
export function useDriftX(options: UseDriftXOptions = {}): DriftControls {
  const {
    distance = 80,
    direction = 1,
    enabled = true,
    skew = false,
    targetRef,
  } = options;

  const reduceMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);

  // Ref callback: attach + resolve the scroll-range target during the commit
  // phase (before effects), so measurement is never racy.
  const setRef = useCallback<(el: HTMLDivElement | null) => void>(
    (el) => {
      rowRef.current = el;
      if (!targetRef) {
        sectionRef.current = el
          ? (el.closest("section") ?? document.body)
          : null;
      }
    },
    [targetRef],
  );

  const active = enabled && reduceMotion !== true;

  useEffect(() => {
    if (!active) {
      x.set(0);
      return;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const target =
        targetRef?.current ?? sectionRef.current ?? rowRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const height = rect.height || window.innerHeight;
      const progress = clamp(-rect.top / height, 0, 1);
      x.set(progress * direction * distance);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      x.set(0);
    };
  }, [active, direction, distance, targetRef, x]);

  const skewX = useVelocitySkew(SUBTLE_VELOCITY_SKEW, active && skew);

  return { ref: setRef, x, skewX };
}

export interface DriftRowProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Total horizontal travel in px (plan: 80–120). Default 80. */
  distance?: number;
  /** 1 → drifts right as the section scrolls; -1 → left. Default 1. */
  direction?: 1 | -1;
  /** Row index for automatic alternation (0 → 1, 1 → -1, 2 → 1 …). */
  index?: number;
  /** Add velocity-reactive skewX (≤4deg) to the row. Default false. */
  skew?: boolean;
  /** Only drift on ≥768px viewports. Default true (no mobile h-scroll). */
  desktopOnly?: boolean;
  /** Explicit scroll-range target; defaults to the nearest <section>. */
  targetRef?: RefObject<HTMLElement | null>;
}

/**
 * DriftRow — wraps a headline row (typically a MaskedText) in a
 * scroll-scrubbed horizontal drift.
 *
 *   <DriftRow index={0} distance={90}>…</DriftRow>
 *   <DriftRow index={1} distance={90}>…</DriftRow>  ← opposite direction
 */
export function DriftRow({
  children,
  className,
  style,
  distance = 80,
  direction,
  index,
  skew = false,
  desktopOnly = true,
  targetRef,
}: DriftRowProps) {
  const dir: 1 | -1 =
    direction ?? (index !== undefined && index % 2 === 1 ? -1 : 1);

  // Desktop gate — media-query driven, SSR-safe (starts false, so a 390px
  // viewport never gets a horizontal drift frame).
  const [isDesktop, setIsDesktop] = useState(!desktopOnly);
  useEffect(() => {
    if (!desktopOnly) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [desktopOnly]);

  const { ref, x, skewX } = useDriftX({
    distance,
    direction: dir,
    enabled: isDesktop,
    skew,
    targetRef,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x, skewX, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
