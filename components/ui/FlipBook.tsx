"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * FlipBook — 3D page-flip book (DESIGN_SPEC §2 S10 + recipe book #10).
 *
 * CSS 3D: container `perspective: 1600px`, each page absolute inset-0 with
 * `transform-style: preserve-3d`; the flipping page animates
 * `rotateY(0 → 180deg)` over 0.8s with the expo easing token. Each page
 * shows its front (its own image) and its back (the next page's front,
 * pre-rotated 180deg so it lands face-up after the flip).
 *
 * Navigation: tap/click right half → next, left half → prev; ArrowLeft /
 * ArrowRight keyboard (only while the book is on screen, so the arrows are
 * not hijacked for the rest of the page); dots indicator; "N / total" counter.
 *
 * Entrance polish (OVERHAUL-PLAN §3 "BrochureFlip: unchanged interaction,
 * add entrance only"): the book rises in with the expo-out token when it
 * scrolls into view — `entrance={false}` disables it.
 *
 * prefers-reduced-motion: instant page swap (no rotate transition, no
 * entrance), still fully navigable via tap and keyboard (recipe #11).
 */

/** Expo-out — DESIGN_SPEC motion token. */
const FLIP_EASE = "var(--ease-expo)";
const FLIP_DURATION = "0.8s";

export interface FlipBookPage {
  src: string;
  alt: string;
  caption?: string;
}

export interface FlipBookProps {
  pages: FlipBookPage[];
  /** Aspect ratio of the book (CSS). Brochure pages are A4-ish. */
  aspect?: string;
  className?: string;
  /**
   * @deprecated the entrance is now the shared `Reveal` system (visible by
   * default in the served HTML, brief §3) — kept so callers stay valid.
   */
  entrance?: boolean;
}

export function FlipBook({
  pages,
  aspect = "3 / 4",
  className = "",
}: FlipBookProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Page currently mid-flip (null when settled).
  const [flipping, setFlipping] = useState<number | null>(null);
  // Arrow keys only act while the book is on screen.
  const [inView, setInView] = useState(false);

  const total = pages.length;
  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === currentIndex && flipping === null) return;
      if (!reduceMotion) {
        setFlipping(currentIndex < clamped ? currentIndex : clamped);
        window.setTimeout(() => setFlipping(null), 800);
      }
      setCurrentIndex(clamped);
    },
    [currentIndex, flipping, reduceMotion, total],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // In-view gate for keyboard navigation.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [total]);

  // Keyboard navigation (recipe #10: ArrowLeft / ArrowRight).
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, inView]);

  if (total === 0) return null;

  // Pages currently visible: settled current page + the flipping page.
  const visiblePages = new Set<number>([currentIndex]);
  if (flipping !== null) visiblePages.add(flipping);

  const isFlippingForward = flipping !== null && currentIndex > flipping;

  // Entrance is delegated to the shared Reveal system: the book is fully
  // visible in the served HTML and only ever *enhanced* afterwards (brief §3
  // — no text/media may be gated on a viewport callback).
  return (
    <div ref={rootRef} data-reveal="rise" className={className}>
      {/* Book container — perspective: 1600px (recipe #10) */}
      <div
        className="relative mx-auto w-full max-w-3xl select-none"
        style={{ perspective: "1600px" }}
      >
        <div
          className="relative w-full overflow-hidden rounded-lg shadow-2xl"
          style={{ aspectRatio: aspect }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x > rect.width / 2) next();
            else prev();
          }}
          role="group"
          aria-label="Brochure flip book — click right half for next page, left half for previous"
        >
          {pages.map((page, i) => {
            if (!visiblePages.has(i)) return null;

            // The flipping page rotates 0 → 180 (forward) or 180 → 0 (backward).
            const isFlippingPage = flipping === i;
            const isCurrent = i === currentIndex;
            let rotateY: number;
            if (isFlippingPage) {
              rotateY = isFlippingForward ? 0 : 180;
            } else if (isCurrent) {
              rotateY = 0;
            } else {
              // The page revealed behind the flip already lies flat at 180.
              rotateY = 180;
            }

            const transition = reduceMotion
              ? "none"
              : `transform ${FLIP_DURATION} ${FLIP_EASE}`;

            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotateY}deg)`,
                  transition,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  zIndex: isCurrent ? 2 : 1,
                }}
                aria-hidden={!isCurrent}
              >
                {/* Front face — this page's image */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.src}
                    alt={page.alt}
                    draggable={false}
                    className="h-full w-full rounded-lg object-cover shadow-2xl"
                  />
                </div>

                {/* Back face — next page's front, pre-rotated 180deg */}
                {i + 1 < total && (
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pages[i + 1].src}
                      alt={pages[i + 1].alt}
                      draggable={false}
                      className="h-full w-full rounded-lg object-cover shadow-2xl"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Page counter — "3 / 12" */}
          <div className="pointer-events-none absolute bottom-4 right-5 rounded-full bg-[color-mix(in_srgb,var(--ink-900)_72%,transparent)] px-4 py-1.5 font-body text-sm font-medium tabular-nums text-[var(--paper)] backdrop-blur-sm">
            {currentIndex + 1} / {total}
          </div>
        </div>
      </div>

      {/* Dots indicator.
          The dot is 8px tall, which is far below a usable pointer target, so
          the button itself is padded out to a 44px-tall hit area while the
          visible pill stays small and centred inside it. */}
      <div className="-my-4 mt-2 flex items-center justify-center gap-1">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to page ${i + 1}`}
            aria-current={i === currentIndex}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            className="flex h-11 min-w-6 items-center justify-center px-1"
          >
            <span
              aria-hidden
              className={`block h-2 rounded-full transition-all duration-[var(--dur-base)] ease-[var(--ease-expo)] ${
                i === currentIndex
                  ? "w-6 bg-[var(--royal-500)]"
                  : "w-2 bg-[var(--mist-400)]/50 hover:bg-[var(--royal-400)]"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Caption below book — current page caption ("Page N") */}
      <p className="mt-4 text-center font-body text-sm text-[var(--mist-400)]">
        {pages[currentIndex].caption ?? `Page ${currentIndex + 1}`}
      </p>
    </div>
  );
}
