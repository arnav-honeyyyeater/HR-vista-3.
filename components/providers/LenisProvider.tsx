"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth-scroll provider.
 * Dynamically imports lenis (client-only), runs a rAF loop, and
 * respects prefers-reduced-motion — when reduced, Lenis is NOT initialised
 * and native scrolling is untouched.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: import("lenis").default | null = null;
    let rafId = 0;
    let cancelled = false;

    // The opening curtain and photo wall share a scene. Freeze the scroll
    // engine until that handoff ends so wheel input cannot move it underneath.
    const syncIntro = () => {
      const phase = document.documentElement.dataset.intro;
      if (phase === "loading" || phase === "opening") lenis?.stop();
      else if (lenis?.isStopped) lenis.start();
    };
    const introObserver = new MutationObserver(syncIntro);
    introObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro"],
    });

    const stop = () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
    };
    const update = () => {
      if (preference.matches) { stop(); return; }
      if (lenis) return;
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled || preference.matches || lenis) return;

        // No custom wrapper — Lenis drives window scroll
        // (the default). A custom wrapper needs overflow
        // handling that breaks sticky sections; the window
        // default is the proven smooth-scroll setup.
        lenis = new Lenis({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          anchors: true,
          stopInertiaOnNavigate: true,
        });
        lenis.on("scroll", ScrollTrigger.update);
        syncIntro();

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
    };
    update();
    preference.addEventListener("change", update);

    return () => {
      cancelled = true;
      preference.removeEventListener("change", update);
      introObserver.disconnect();
      stop();
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}
