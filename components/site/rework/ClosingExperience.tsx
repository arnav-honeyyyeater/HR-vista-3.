"use client";

import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/data/content";
import { FlipBook } from "@/components/ui/FlipBook";

const ease = [0.16, 1, 0.3, 1] as const;

const pages = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/brochure/page-${n}.png`,
    alt: `HR VISTA 3.0 brochure — page ${n}`,
    caption: `Page ${n}`,
  };
});

export function ClosingExperience() {
  const reduce = useReducedMotion();

  return (
    <>
      <section id="brochure" className="relative overflow-hidden bg-[var(--ink-900)] text-white">
        <div className="content-max px-[var(--section-padding-x)] py-[clamp(6rem,11vw,11rem)]">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow text-[var(--royal-300)]">05 — The official brochure</p>
              <h2 className="display-1 mt-7 text-[clamp(3.2rem,7vw,7.8rem)]">
                HOLD THE
                <span className="block text-[var(--royal-500)]">WHOLE STORY</span>
                IN YOUR HANDS.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--mist-400)] md:text-lg">
                Twelve pages covering the scale, people, corporate ecosystem, Mumbai, CPCG and why HR VISTA 3.0 matters.
              </p>
            </div>
            <motion.div
              initial={reduce ? false : { opacity: 0, rotate: 2, y: 40 }}
              whileInView={reduce ? undefined : { opacity: 1, rotate: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease }}
              className="rounded-[28px] border border-[var(--line-dark)] bg-[var(--ink-800)] p-4 md:p-6"
            >
              <FlipBook pages={pages} aspect="1 / 1" className="mx-auto max-w-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="why" className="bg-white text-[var(--ink-900)]">
        <div className="content-max px-[var(--section-padding-x)] py-[clamp(6rem,11vw,11rem)]">
          <p className="eyebrow text-[var(--royal-500)]">06 — Why HR VISTA 3.0?</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {content.whyHrVista.audiences.map((audience, index) => (
              <motion.article
                key={audience.heading}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.6, delay: index * 0.06, ease }}
                className="group flex min-h-[340px] flex-col justify-between rounded-[24px] border border-[var(--line-light)] bg-[var(--sky-100)] p-6 transition duration-500 hover:-translate-y-2 hover:border-[var(--royal-500)] hover:bg-white"
              >
                <div>
                  <span className="font-display text-sm text-[var(--royal-500)]">0{index + 1}</span>
                  <h3 className="display-3 mt-7 text-[clamp(1.5rem,2.4vw,2.4rem)]">{audience.heading}</h3>
                </div>
                <p className="mt-8 text-sm leading-relaxed text-[var(--mist-400)]">{audience.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-[var(--royal-500)] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="content-max relative z-10 px-[var(--section-padding-x)] py-[clamp(6rem,10vw,10rem)]">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="eyebrow text-white/70">21–22 November 2026 · Mumbai</p>
              <h2 className="display-1 mt-7 max-w-[11ch] text-[clamp(3.6rem,8.5vw,9rem)]">
                TWO DAYS. ONE SHARED FUTURE.
              </h2>
            </div>
            <div className="rounded-[24px] border border-white/25 bg-white/10 p-7 backdrop-blur md:p-9">
              <p className="display-3 text-[clamp(1.6rem,2.7vw,2.5rem)]">{content.footer.cta}</p>
              <div className="mt-8 space-y-3 text-sm text-white/80">
                {content.footer.contacts.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#top" className="rounded-full bg-white px-5 py-3 font-display text-sm font-semibold text-[var(--ink-900)] transition hover:scale-[1.03]">
                  Back to top
                </a>
                <a href="#brochure" className="rounded-full border border-white/35 px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-white hover:text-[var(--ink-900)]">
                  View brochure
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/25 pt-7 text-xs text-white/65 md:flex-row md:items-center md:justify-between">
            <p>{content.footer.credits}</p>
            <p className="font-display text-sm font-semibold text-white">HR VISTA 3.0 · The future of work.</p>
          </div>
        </div>
      </section>
    </>
  );
}
