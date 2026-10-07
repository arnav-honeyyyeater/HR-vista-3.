"use client";

import { content } from "@/lib/data/content";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { Reveal } from "./Reveal";

/**
 * S15 — FOOTER (opraah: "Let's make something worth talking about." +
 * office/contact + anchor nav + big graphic).
 */

const ANCHORS = [
  { label: "Story", href: "#story" },
  { label: "Our Work", href: "#work" },
  { label: "Moments", href: "#moments" },
  { label: "Brochure", href: "#brochure" },
  { label: "Who's in the room", href: "#room" },
  { label: "Get involved", href: "#involved" },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="sec sec-dark relative overflow-hidden border-t border-[var(--ink-700)]"
    >
      {/* Big closing graphic — decorative, own layer */}
      <div className="deco" aria-hidden>
        <div className="perspective-grid" />
      </div>

      <div className="sec-layer content-max">
        <div className="display-2 max-w-5xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="Let's make something" />
          <HeadingWords
            as="div"
            delay={0.08}
            className="text-[var(--royal-500)]"
            text="worth talking about."
          />
        </div>

        <Reveal delay={0.12} y={48}>
          <p className="mt-6 max-w-2xl text-base text-[var(--mist-400)] md:text-lg">
            {content.footer.cta}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#top" className="pill pill-solid text-sm">
              Register now
            </a>
            <a href="#brochure" className="pill pill-ghost text-sm">
              View brochure
            </a>
          </div>
        </Reveal>

        {/* Media band */}
        <Reveal delay={0.1} y={56}>
          <div data-reveal="wipe" className="zoom-frame relative aspect-[21/9] overflow-hidden rounded-[var(--radius-card)] bg-[var(--ink-800)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/flickr/footer-1.jpg"
              alt="HR VISTA 3.0"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Reveal>

        {/* Contact / nav / credits */}
        <div className="mt-11 grid gap-8 border-t border-[var(--ink-700)] pt-9 md:grid-cols-3">
          <div>
            <p className="eyebrow text-[var(--mist-400)]">Where</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--paper)]">
              {content.footer.contacts.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-[var(--mist-400)]">Explore</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-1">
              {ANCHORS.map((a) => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    className="text-[var(--paper)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--royal-500)]"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-[var(--mist-400)]">Taglines</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--mist-400)]">
              {content.footer.taglines.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--ink-700)] pt-6 text-xs text-[var(--mist-400)] md:flex-row md:items-center md:justify-between">
          <p>{content.footer.credits}</p>
          <p className="font-display text-sm font-bold text-[var(--paper)]">
            HR VISTA <span className="text-[var(--royal-500)]">3.0</span> · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
