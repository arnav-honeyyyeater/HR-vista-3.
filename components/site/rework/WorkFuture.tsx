"use client";

import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/data/content";

const images = [
  "/media/flickr/statement-1.jpg",
  "/media/flickr/stats-2.jpg",
  "/media/flickr/story-3.jpg",
  "/media/flickr/room-1.jpg",
  "/media/flickr/editions-3.jpg",
];

const ease = [0.16, 1, 0.3, 1] as const;

export function WorkFuture() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="relative overflow-hidden bg-[var(--ink-900)] text-white">
      <div className="content-max px-[var(--section-padding-x)] py-[clamp(6rem,11vw,11rem)]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <p className="eyebrow text-[var(--royal-300)]">02 — An experience built around connection</p>
            <h2 className="display-1 mt-7 text-[clamp(3.4rem,7.6vw,8rem)]">
              NOT A
              <span className="block text-[var(--royal-500)]">STATIC</span>
              CONCLAVE.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--mist-400)] md:text-lg">
              HR VISTA 3.0 extends beyond keynote sessions and panel discussions. The experience is built for conversations, interaction, networking and knowledge exchange.
            </p>
          </div>

          <div className="border-t border-[var(--line-dark)]">
            {content.whatAwaits.map((item, index) => (
              <motion.article
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 36 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.7, delay: index * 0.05, ease }}
                className="group grid gap-6 border-b border-[var(--line-dark)] py-8 md:grid-cols-[88px_1fr_220px] md:items-center md:py-10"
              >
                <span className="font-display text-sm text-white/35">0{index + 1}</span>
                <div>
                  <h3 className="display-3 text-[clamp(1.7rem,3vw,3rem)] transition-colors duration-300 group-hover:text-[var(--royal-400)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--mist-400)] md:text-base">
                    {item.description}
                  </p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[var(--ink-800)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[index]}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 ease-[var(--ease-expo)] group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(46,91,255,.26),transparent_60%)]" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[70svh] min-h-[560px] overflow-hidden border-y border-[var(--line-dark)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/flickr/room-4.jpg"
          alt="HR VISTA professional gathering"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,32,.96)_0%,rgba(10,18,32,.58)_48%,rgba(10,18,32,.2)_100%)]" />
        <div className="content-max relative z-10 flex h-full items-center px-[var(--section-padding-x)]">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -45 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.9, ease }}
            className="max-w-4xl"
          >
            <p className="eyebrow text-[var(--royal-300)]">The corporate ecosystem</p>
            <h3 className="display-1 mt-6 text-[clamp(3.2rem,7vw,7.8rem)]">
              WHERE INDUSTRY
              <span className="block text-[var(--royal-400)]">LEADERS MEET.</span>
            </h3>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              {content.corporateEcosystem.subheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {content.corporateEcosystem.industries.map((industry) => (
                <span key={industry} className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur">
                  {industry}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
