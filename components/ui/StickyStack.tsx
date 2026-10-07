"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

/**
 * StickyStack — chunky physical stacking cards (OVERHAUL-PLAN §3
 * "WhatAwaits: real physical stack — cards scale 0.94^n, rotate ±1.5deg,
 * deepening shadows. This must feel CHUNKY.").
 *
 * Pinning: each card wrapper is CSS `sticky` at `calc(stickyTop + i * step)`
 * (a 16px staggered edge stays visible per card — the stack reads as paper
 * slabs, not as hidden panels). Sticky is used instead of ScrollTrigger's
 * `pin` deliberately: it does not inject pin-spacers into React's DOM (the
 * project dropped GSAP pin for exactly that teardown bug — see
 * docs/EXECUTION-PHASE1.md) and gives identical visuals.
 *
 * The stack motion itself IS ScrollTrigger-scrubbed: one trigger spans the
 * container ("top bottom" → "bottom top"); on every update each card's live
 * coverage is measured from its rect (how far it has risen to its own sticky
 * point), and every card is re-styled from those depths:
 *
 *   depth_i  = Σ coverage of the cards above i      (how buried it is)
 *   scale    = 0.94 ^ depth_i
 *   rotate   = ±1.5deg, alternating per card, saturating at full tilt
 *   shadow   = deepens as cards stack beneath the top card
 *
 * Progress-linked (scrub) ⇒ it scrubs back if you scroll up, and because the
 * values are read from geometry there is no lag and no jank.
 *
 * prefers-reduced-motion: no sticky pin, no transforms, no shadows — plain
 * static flow (every card fully readable).
 */

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

export interface StickyStackProps {
  /** Card elements — rendered in order, top to bottom. */
  cards: ReactNode[];
  className?: string;
  /** CSS top for the first card. Default "12vh". */
  stickyTop?: string;
  /** Extra top offset per card in px (visible stack edge). Default 16. */
  step?: number;
  /** Scale per stacking level (plan: 0.94). Default 0.94. */
  shrink?: number;
  /** Max rotation in degrees (plan: ±1.5). Default 1.5. */
  rotate?: number;
}

export function StickyStack({
  cards,
  className = "",
  stickyTop = "12vh",
  step = 16,
  shrink = 0.94,
  rotate = 1.5,
}: StickyStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const wrappers = () =>
      Array.from(container.querySelectorAll<HTMLElement>("[data-sticky-card]"));

    gsap.registerPlugin(ScrollTrigger);

    // Re-style the whole stack from live geometry.
    const apply = () => {
      const els = wrappers();
      const n = els.length;
      if (n === 0) return;
      const vh = window.innerHeight;

      // coverage[j] = how far card j has risen toward its sticky point
      // (0 = still entering the viewport, 1 = fully pinned, covering j-1).
      const coverage = new Array<number>(n).fill(0);
      for (let j = 1; j < n; j++) {
        const el = els[j];
        const stick = parseFloat(window.getComputedStyle(el).top) || 0;
        const range = Math.max(vh - stick, 1);
        const rect = el.getBoundingClientRect();
        coverage[j] = clamp(1 - (rect.top - stick) / range, 0, 1);
      }

      for (let i = 0; i < n; i++) {
        let depth = 0;
        for (let j = i + 1; j < n; j++) depth += coverage[j];
        depth = Math.min(depth, n - 1 - i);

        let below = 0;
        for (let j = 1; j <= i; j++) below += coverage[j];
        below = Math.min(below, 5);

        const scale = Math.pow(shrink, depth);
        const tilt =
          (i % 2 === 0 ? rotate : -rotate) * Math.min(depth, 1);
        const shadowY = (8 + below * 6).toFixed(0);
        const shadowBlur = (26 + below * 14).toFixed(0);
        const shadowAlpha = (0.1 + below * 0.05).toFixed(3);

        const el = els[i];
        el.style.transform = `rotate(${tilt.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
        el.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(6, 10, 20, ${shadowAlpha})`;
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: apply,
      onRefresh: apply,
    });
    apply();

    return () => {
      trigger.kill();
      // Leave the cards at their natural resting state.
      wrappers().forEach((el) => {
        el.style.transform = "";
        el.style.boxShadow = "";
      });
    };
  }, [reduceMotion, shrink, rotate]);

  return (
    <div ref={containerRef} className={`flex flex-col ${className}`}>
      {cards.map((card, i) => (
        <div
          key={i}
          data-sticky-card
          data-sticky-index={i}
          className={reduceMotion ? "" : "sticky"}
          style={{
            zIndex: i + 1,
            top: reduceMotion ? undefined : `calc(${stickyTop} + ${i * step}px)`,
            transformOrigin: "50% 0%",
            willChange: reduceMotion ? undefined : "transform",
          }}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
