"use client";

import { useCallback, useRef, useState } from "react";
import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";
import { WatermarkBand } from "./Sections";

/**
 * S9 — "Our IPs" scroll carousel → HR VISTA signature moments.
 *
 * Horizontal snap track (no pinning, no scroll-jacking) with arrow
 * controls and a progress rail. Everything lives inside an
 * overflow-x-auto strip, so nothing can bleed outside it.
 */

const IMAGES = [
  "/media/flickr/story-4.jpg",
  "/media/flickr/story-5.jpg",
  "/media/flickr/editions-2.jpg",
  "/media/flickr/editions-4.jpg",
];

export function SignatureMoments() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const nudge = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return (
    <section id="moments" className="sec sec-dark relative overflow-hidden">
      <div className="sec-layer content-max">
        {/* The reference's repeating display label, scrolled edge to edge. */}
        <WatermarkBand label="Our IPs" className="mb-[var(--space-md)]" />

        <Reveal>
          <p className="eyebrow text-[var(--royal-300)]">Signature moments</p>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="display-2 max-w-3xl text-[length:var(--text-section)]">
            <HeadingWords as="div" text="Our IPs." />
            <HeadingWords
              as="div"
              delay={0.08}
              className="text-[var(--mist-400)]"
              text="Some of the moments people still talk about."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Previous moment"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ink-700)] text-[var(--paper)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--royal-500)] hover:text-[var(--royal-500)]"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Next moment"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ink-700)] text-[var(--paper)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--royal-500)] hover:text-[var(--royal-500)]"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {content.signatureMoments.map((moment, i) => (
            <article
              key={moment.title}
              className="group lift w-[84%] shrink-0 snap-start rounded-[var(--radius-card)] sm:w-[420px] lg:w-[460px]"
            >
              <div
                data-reveal="wipe"
                style={{ ["--rd" as string]: `${i * 0.06}s` }}
                className="zoom-frame relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-[var(--ink-800)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES[i % IMAGES.length]}
                  alt={moment.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <p className="eyebrow mt-5 text-[var(--royal-500)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight font-bold md:text-3xl">
                {moment.title}
              </h3>
              <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-[var(--mist-400)]">
                {moment.description}
              </p>
            </article>
          ))}
        </div>

        {/* Progress rail */}
        <div className="mt-6 h-px w-full bg-[var(--ink-700)]">
          <div
            className="h-px bg-[var(--royal-500)] transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(8, Math.round(progress * 100))}%` }}
          />
        </div>

        {/* Closing statement (the reference's "We don't just run campaigns…") */}
        <div className="display-2 mt-12 max-w-4xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="We don't just run a conclave." />
          <HeadingWords
            as="div"
            delay={0.08}
            className="text-[var(--royal-500)]"
            text="We build what people talk about."
          />
        </div>
      </div>
    </section>
  );
}
