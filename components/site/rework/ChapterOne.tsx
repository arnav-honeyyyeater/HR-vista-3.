"use client";

import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/data/content";

const stats = content.atAGlance.stats;

const ease = [0.16, 1, 0.3, 1] as const;

export function ChapterOne() {
  const reduce = useReducedMotion();

  return (
    <section id="story" className="relative overflow-hidden bg-white text-[var(--ink-900)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[8vw] top-[-10vw] h-[38vw] w-[38vw] rounded-full border border-[rgba(46,91,255,.12)]" />
        <div className="absolute -right-[2vw] top-[-4vw] h-[24vw] w-[24vw] rounded-full border border-[rgba(46,91,255,.18)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--line-light)]" />
      </div>

      <div className="content-max relative z-10 px-[var(--section-padding-x)] py-[clamp(6rem,12vw,12rem)]">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.7, ease }}
              className="eyebrow text-[var(--royal-500)]"
            >
              01 — Welcome to HR VISTA 3.0
            </motion.p>

            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 60 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1, ease }}
              className="display-1 mt-7 max-w-[11ch] text-[clamp(3.2rem,7vw,7.8rem)]"
            >
              WHERE INDIA&apos;S HR COMMUNITY
              <span className="block text-[var(--royal-500)]">COMES TOGETHER.</span>
            </motion.h2>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--mist-400)] md:text-lg">
              {content.intro.subheading}
            </p>
          </div>

          <div className="space-y-14">
            <motion.div
              initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
              whileInView={reduce ? undefined : { clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, ease }}
              className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-[var(--ink-900)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/flickr/story-5.jpg"
                alt="HR VISTA audience"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(10,18,32,.86)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                <p className="eyebrow text-white/60">The scale shifts here</p>
                <p className="display-2 mt-3 max-w-3xl text-[clamp(2rem,4.4vw,4.8rem)] text-white">
                  500+ voices. Two days. One ecosystem.
                </p>
              </div>
            </motion.div>

            <div className="grid border-y border-[var(--line-light)] sm:grid-cols-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease }}
                  className="group relative border-b border-[var(--line-light)] p-6 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 md:p-8"
                >
                  <span className="absolute right-5 top-5 font-display text-xs text-[var(--mist-400)]">
                    0{index + 1}
                  </span>
                  <div className="display-1 text-[clamp(3rem,6vw,6rem)] text-[var(--ink-900)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1 group-hover:text-[var(--royal-500)]">
                    {stat.value}
                  </div>
                  <p className="mt-4 max-w-[24ch] text-sm font-semibold uppercase tracking-[0.14em] text-[var(--mist-400)]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.75, ease }}
              className="grid gap-8 border-l-2 border-[var(--royal-500)] pl-6 md:grid-cols-[1fr_auto] md:items-end md:pl-9"
            >
              <p className="display-3 max-w-3xl text-[clamp(1.7rem,3vw,3rem)]">
                {content.intro.closingLine}
              </p>
              <p className="eyebrow text-[var(--royal-500)]">{content.atAGlance.dates}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div aria-hidden className="overflow-hidden border-y border-[var(--line-light)] py-4">
        <div className="whitespace-nowrap font-display text-[clamp(4rem,10vw,11rem)] font-bold leading-none tracking-[-0.05em] text-[var(--ink-900)]/5">
          FUTURE OF WORK — PEOPLE — CULTURE — LEADERSHIP — FUTURE OF WORK —
        </div>
      </div>
    </section>
  );
}
