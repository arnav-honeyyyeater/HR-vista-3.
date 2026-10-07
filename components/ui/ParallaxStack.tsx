"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

/**
 * ParallaxStack — multi-depth scrub parallax (OVERHAUL-PLAN §3 "Story:
 * scrubbed parallax stack, 3 depths 0.5x / 1x / 1.3x").
 *
 * Every layer is its own GSAP ScrollTrigger: container top → container bottom
 * across the viewport top, `scrub: 1.1` (smooth, progress-linked, no jank),
 * y travelling `speed * distance` px (distance defaults to 200px — the old
 * recipe #3 value, so existing `speed: 0.2 / 0.45 / 0.7` layers behave the
 * same; the new choreography uses speeds like 0.5 / 1 / 1.3).
 *
 * Layers carry their own responsive classes from the caller: mobile is an
 * in-flow row/grid, md+ layers become absolutely positioned collage tiles
 * (callers pass `md:absolute …` in `className`).
 *
 * Gates: parallax runs on md+ only (mobile stays in-flow and static) and is
 * disabled entirely under prefers-reduced-motion — static final state.
 * GSAP is registered inside the effect (client-only); the module import is
 * SSR-safe (verified against plain-node import) and nothing touches `window`
 * during render.
 */

export interface ParallaxLayer {
  src: string;
  alt: string;
  /** y-speed multiplier (recipe #3: 0.2 / 0.45 / 0.7; plan §3: 0.5 / 1 / 1.3). */
  speed: number;
  /** Responsive layout classes — include `md:absolute …` for collage mode. */
  className?: string;
}

export interface ParallaxStackProps {
  layers: ParallaxLayer[];
  className?: string;
  /** px of travel for speed 1.0. Default 200. */
  distance?: number;
}

export function ParallaxStack({
  layers,
  className = "",
  distance = 200,
}: ParallaxStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Scrub/parallax only on md+ (mobile renders the layers in-flow).
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Serialised layer identity — the effect must not re-run on every parent
  // render, only when the actual layers/speeds change.
  const layersKey = layers.map((l) => `${l.src}@${l.speed}`).join("|");

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-parallax-layer]"),
    );
    if (items.length === 0) return;

    // Reduced motion / mobile: no triggers at all — static final state.
    if (reduceMotion || !isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      items.forEach((el) => {
        const speed = Number(el.dataset.speed ?? "0");
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: speed * distance,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );
      });
    }, container);

    // Lazy images change the container height after load → re-measure so the
    // scrub range never goes stale (debounced refresh).
    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    container.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", scheduleRefresh);
    });

    return () => {
      window.clearTimeout(refreshTimer);
      container.querySelectorAll("img").forEach((img) => {
        img.removeEventListener("load", scheduleRefresh);
      });
      ctx.revert();
    };
  }, [reduceMotion, isDesktop, distance, layersKey]);

  return (
    <div ref={ref} className={className}>
      {layers.map((layer) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${layer.src}-${layer.speed}-${layer.className ?? ""}`}
          data-parallax-layer=""
          data-speed={layer.speed}
          src={layer.src}
          alt={layer.alt}
          loading="lazy"
          className={`rounded-2xl border border-[var(--mist-200)]/20 object-cover ${layer.className ?? ""}`}
        />
      ))}
    </div>
  );
}
