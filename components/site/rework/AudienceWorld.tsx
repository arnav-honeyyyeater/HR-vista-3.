"use client";

import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/data/content";

const ease = [0.16, 1, 0.3, 1] as const;
const panelImages = [
  "/media/flickr/room-1.jpg",
  "/media/flickr/room-3.jpg",
  "/media/flickr/room-2.jpg",
  "/media/flickr/story-4.jpg",
];

export function AudienceWorld() {
  const reduce = useReducedMotion();

  return (
    <section id="room" className="bg-white text-[var(--ink-900)]">
      <div className="content-max px-[var(--section-padding-x)] py-[clamp(6rem,12vw,12rem)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-[var(--royal-500)]">03 — The people of HR VISTA</p>
            <h2 className="display-1 mt-7 text-[clamp(3.5rem,8vw,8.8rem)]">
              500+
              <span className="block text-[var(--royal-500)]">VOICES.</span>
            </h2>
          </div>
          <div className="lg:pb-3">
            <p className="display-3 max-w-2xl text-[clamp(1.5rem,2.7vw,2.5rem)]">
              One HR ecosystem where strategy meets experience, industry meets academia, and established leaders meet the next generation.
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-[var(--line-light)]">
        {content.whoIsInTheRoom.map((group, index) => (
          <article
            key={group.heading}
            className="relative min-h-[82svh] overflow-hidden border-b border-[var(--line-light)] last:border-b-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={panelImages[index % panelImages.length]}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,32,.2),rgba(10,18,32,.78)_58%,rgba(10,18,32,.95))]" />
            <div className="content-max relative z-10 flex min-h-[82svh] items-end justify-end px-[var(--section-padding-x)] py-10 md:py-14">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 60, scale: 0.98 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8, ease }}
                className="w-full max-w-2xl rounded-[26px] border border-white/15 bg-[rgba(10,18,32,.88)] p-7 text-white shadow-2xl backdrop-blur-xl md:p-10"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-[var(--royal-300)]">0{index + 1} / 04</p>
                  <span className="h-px flex-1 bg-white/15" />
                </div>
                <h3 className="display-1 mt-5 text-[clamp(2.6rem,5vw,5.5rem)]">{group.heading}</h3>
                <ul className="mt-7 border-t border-white/15">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-white/15 py-4 font-display text-[clamp(1rem,1.8vw,1.35rem)] font-semibold">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </article>
        ))}
      </div>

      <div id="mumbai" className="relative overflow-hidden bg-[var(--royal-500)] text-white">
        <div className="pointer-events-none absolute -right-[12vw] top-1/2 h-[52vw] w-[52vw] -translate-y-1/2 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -right-[2vw] top-1/2 h-[28vw] w-[28vw] -translate-y-1/2 rounded-full border border-white/20" />
        <div className="content-max relative z-10 px-[var(--section-padding-x)] py-[clamp(6rem,10vw,10rem)]">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="eyebrow text-white/70">04 — Why Mumbai?</p>
              <h2 className="display-1 mt-7 text-[clamp(3.5rem,8vw,8.5rem)]">
                THE HEART OF INDIA&apos;S
                <span className="block text-[var(--ink-900)]">CORPORATE ECOSYSTEM.</span>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="text-base leading-relaxed text-white/80 md:text-lg">
                {content.whyMumbai.body}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {content.whyMumbai.points.map((point) => (
                  <span key={point} className="rounded-full border border-white/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
