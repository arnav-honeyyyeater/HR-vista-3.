"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { content } from "@/lib/data/content";
import { Reveal } from "./Reveal";
import { WatermarkBand } from "./Sections";

/**
 * S3 — STATS (opraah: count-up counters with floating media).
 *
 * The floating media lives in its OWN band below the counters with a
 * 64px+ gutter, and parallax travel is capped at ±32px — so media can
 * never drift underneath the numbers or their labels.
 */

const FLOATERS = [
  { src: "/media/flickr/stats-1.jpg", alt: "HR VISTA delegates", speed: -32 },
  { src: "/media/flickr/stats-2.jpg", alt: "HR VISTA panel", speed: 26 },
  { src: "/media/flickr/stats-3.jpg", alt: "HR VISTA audience", speed: -20 },
] as const;

/** Expo-out with overshoot — DESIGN_SPEC recipe #4. */
const EXPO_OUT = (t: number) => 1 - Math.pow(2, -10 * t);

function parseValue(value: string): { num: number; suffix: string } {
  const match = value.match(/[\d,]+/);
  const digits = match ? match[0] : "";
  return {
    num: parseInt(digits.replace(/,/g, ""), 10) || 0,
    suffix: digits ? value.replace(digits, "") : value,
  };
}

/**
 * Count-up number with a hard fallback: IntersectionObserver triggers
 * the animation, and a 1.5s timer jumps straight to the final value if
 * IO never delivers an entry (hidden / background document) — the
 * number can never be left stuck at 0.
 */
function StatNumber({ value, label }: { value: string; label: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { num, suffix } = parseValue(value);
  const final = num.toLocaleString("en-US") + suffix;
  const [display, setDisplay] = useState(reduce || !num ? final : `0${suffix}`);

  useEffect(() => {
    if (reduce || !num) {
      setDisplay(final);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const count = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = EXPO_OUT(t);
        setDisplay(
          t < 1 ? `${Math.round(num * eased).toLocaleString("en-US")}${suffix}` : final,
        );
        // brief §4 "count-up + blur snap": blur(6px) clears over the first
        // 60% of the run, then the digits land hard at zero blur.
        const blurPx = t < 0.6 ? (1 - t / 0.6) * 6 : 0;
        el.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "none";
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        window.clearTimeout(fallback);
        count();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    const fallback = window.setTimeout(() => {
      observer.disconnect();
      if (!started) {
        setDisplay(final);
        el.style.filter = "none";
      }
    }, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
      el.style.filter = "";
    };
  }, [num, suffix, final, reduce]);

  return (
    <div ref={ref}>
      <div className="display-1 text-5xl text-[var(--paper)] md:text-6xl xl:text-7xl">
        {display}
      </div>
      <p className="eyebrow mt-4 text-[var(--mist-400)]">{label}</p>
    </div>
  );
}

function Floater({
  src,
  alt,
  speed,
}: {
  src: string;
  alt: string;
  speed: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--ink-800)]">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y }}
        className="aspect-[4/3] w-full scale-110 object-cover"
      />
    </div>
  );
}

export function StatsCounters() {
  return (
    <section id="stats" className="sec-dark relative overflow-hidden py-[var(--section-padding-y)]">
      <div className="content-max px-[var(--section-padding-x)]">
        {/* The reference's repeating display label, scrolled behind the stats. */}
        <WatermarkBand label="At a glance" className="mb-[var(--space-md)]" />

        <Reveal>
          <p className="eyebrow text-[var(--royal-300)]">HR VISTA 3.0 · At a glance</p>
        </Reveal>

        <div className="mt-[var(--space-lg)] grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} y={48}>
              <div className="border-t border-[var(--line-dark)] pt-6">
                <StatNumber value={stat.value} label={stat.label} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Floating media band — its own row, generous gutters */}
        <div className="mt-[var(--space-xl)] grid gap-4 sm:grid-cols-3 md:gap-6">
          {FLOATERS.map((f) => (
            <Floater key={f.src} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
