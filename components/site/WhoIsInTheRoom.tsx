"use client";

import { Marquee } from "@/components/ui/Marquee";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { content } from "@/lib/data/content";
import { Reveal } from "./Reveal";

/**
 * S12 — "WHO'S IN THE ROOM" (DESIGN BRIEF V4 §2 + §4).
 *
 * This is the ONE sticky-stack moment on the page (brief §4 allows exactly
 * one). Media-first: each panel is a full-bleed photograph with an OPAQUE
 * content card sitting on top of it — no text is ever painted over an image,
 * so text-on-text and text-on-photo are structurally impossible. A decorative
 * name marquee runs along the foot of each card (marquee system 3 of 3).
 *
 * BUG RULES (unchanged from the clone pass):
 *  · every panel carries an explicit opaque backgroundColor (paper / #f4f4f4)
 *  · no opacity animation on panels, increasing z-index → clean occlusion
 *  · the section has NO overflow: hidden (it would silently kill sticky)
 */

const PANEL_IMAGES = [
  "/media/flickr/room-1.jpg",
  "/media/flickr/room-3.jpg",
  "/media/flickr/room-2.jpg",
  "/media/flickr/room-4.jpg",
];

const STICKY_TOP = "top-16 md:top-[68px]";

export function WhoIsInTheRoom() {
  const groups = content.whoIsInTheRoom;

  return (
    <section id="room" className="sec sec-light pb-0">
      <div className="sec-layer content-max">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-[var(--signal)]">Who&apos;s in the room</p>
            <div className="display-2 mt-4 max-w-4xl text-[length:var(--text-section)]">
              <HeadingWords as="div" text="There's a seat" />
              <HeadingWords
                as="div"
                delay={0.07}
                className="text-[var(--royal-500)]"
                text="for everyone."
              />
            </div>
          </div>
          <p className="eyebrow text-[var(--mist-400)]">
            {String(groups.length).padStart(2, "0")} seats
          </p>
        </div>
      </div>

      {/* Sticky panels — full-bleed inside the section padding */}
      <div className="mt-12 mx-[calc(var(--section-padding-x)*-1)]">
        {groups.map((group, i) => (
          <div
            key={group.heading}
            className={`${STICKY_TOP} relative flex min-h-[84svh] items-end overflow-hidden border-t border-[var(--mist-200)] px-[var(--section-padding-x)] py-6`}
            style={{
              zIndex: i + 1,
              backgroundColor: i % 2 === 0 ? "var(--paper)" : "var(--sky-100)",
            }}
          >
            {/* Photo background — full-bleed, no copy painted over it */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PANEL_IMAGES[i % PANEL_IMAGES.length]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Opaque content card — always above the photograph */}
            <div className="relative z-10 mx-auto flex w-full max-w-[var(--max-content)] justify-end">
              <Reveal
                delay={0.04}
                className="w-full rounded-[var(--radius-panel)] border border-[var(--mist-200)] bg-[var(--paper)] p-6 shadow-[0_30px_80px_rgba(6,10,20,0.28)] md:p-8 lg:w-[56%]"
              >
                <p className="eyebrow text-[var(--royal-500)]">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(groups.length).padStart(2, "0")}
                </p>
                <h3 className="display-2 mt-3 text-[clamp(1.75rem,3.6vw,3rem)] text-[var(--ink-900)]">
                  {group.heading}
                </h3>

                <ul className="mt-5 border-t border-[var(--mist-200)]">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="display-3 border-b border-[var(--mist-200)] py-3 text-[clamp(1rem,1.7vw,1.35rem)] text-[var(--ink-900)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Decorative name marquee — marquee system 3 of 3 */}
                <div className="bleed mt-5" aria-hidden>
                  <Marquee
                    speed={30}
                    items={group.items.map((item, j) => (
                      <span
                        key={`${item}-${j}`}
                        className="px-4 font-display text-sm font-semibold tracking-tight whitespace-nowrap text-[var(--mist-400)]"
                      >
                        {item}
                        <span className="pl-4 text-[var(--royal-500)]">•</span>
                      </span>
                    ))}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
