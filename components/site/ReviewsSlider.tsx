"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { EASE, Reveal } from "./Reveal";
import { WatermarkBand } from "./Sections";

/**
 * S14 — REVIEWS slider (opraah: "REviews" — snap slider, auto-advance).
 *
 * Track translate is index-based (always an exact card width), auto
 * advance pauses on hover/focus and is disabled entirely under
 * prefers-reduced-motion (static, arrows only).
 */

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function ReviewsSlider() {
  const reduce = useReducedMotion();
  const reviews = content.reviews;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reduce, paused, reviews.length]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + reviews.length) % reviews.length);

  return (
    <section
      id="reviews"
      className="sec sec-light relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="sec-layer content-max">
        {/* The reference's repeating display label, scrolled edge to edge. */}
        <WatermarkBand label="Reviews" className="mb-[var(--space-md)]" />

        <Reveal>
          <p className="eyebrow text-[var(--signal)]">What they say</p>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="display-2 max-w-3xl text-[length:var(--text-section)]">
            <HeadingWords as="div" text="REviews" />
            <HeadingWords
              as="div"
              delay={0.08}
              className="text-[var(--royal-500)]"
              text="from HR VISTA 2.0"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--mist-200)] text-[var(--ink-900)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--royal-500)] hover:text-[var(--royal-500)]"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next review"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--mist-200)] text-[var(--ink-900)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--royal-500)] hover:text-[var(--royal-500)]"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[var(--radius-panel)] border border-[var(--mist-200)] bg-[var(--sky-100)]">
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
          >
            {reviews.map((review) => (
              <figure
                key={review.author}
                className="w-full shrink-0 p-6 md:p-10"
                aria-hidden={review.author !== reviews[index].author}
              >
                <blockquote className="display-3 text-[length:clamp(1.15rem,2.4vw,2rem)] text-[var(--ink-900)]">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--royal-500)] font-display text-sm font-bold text-white"
                  >
                    {monogram(review.author)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-bold text-[var(--ink-900)]">
                      {review.author}
                    </span>
                    <span className="block text-sm text-[var(--mist-400)]">
                      {review.role}
                    </span>
                    <span className="block text-xs tracking-wide text-[var(--mist-400)] uppercase">
                      {review.event}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        {/* Dots. The visible pill is 8px tall, which is not a usable pointer
            target, so each button is padded out to a 44px-tall hit area with
            the pill centred inside it. */}
        <div className="-my-3 mt-3 flex gap-1">
          {reviews.map((review, i) => (
            <button
              key={review.author}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="flex h-11 min-w-6 items-center justify-center px-1"
            >
              <span
                aria-hidden
                className={`block h-2 rounded-full transition-all duration-[var(--dur-base)] ${
                  i === index
                    ? "w-8 bg-[var(--royal-500)]"
                    : "w-2 bg-[var(--mist-200)] hover:bg-[var(--mist-400)]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
