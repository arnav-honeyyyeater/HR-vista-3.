"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lenis smooth-scroll provider.
 * Dynamically imports lenis (client-only), runs a rAF loop, and
 * respects prefers-reduced-motion — when reduced, Lenis is NOT initialised
 * and native scrolling is untouched.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced-motion guard: do not init Lenis when the user prefers reduced motion.
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let rafId = 0;
    let cancelled = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;

        // No custom wrapper — Lenis drives window scroll
        // (the default). A custom wrapper needs overflow
        // handling that breaks sticky sections; the window
        // default is the proven smooth-scroll setup.
        lenis = new Lenis({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      })
      .catch((err) => {
        // Smooth scroll is progressive enhancement — never crash the page on failure.
        console.warn("[LenisProvider] smooth scroll disabled:", err);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}
