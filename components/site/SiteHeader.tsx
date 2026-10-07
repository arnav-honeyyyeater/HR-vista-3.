"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * SITE HEADER — opraah.in's measured navigation, HR VISTA's identity.
 *
 * The reference's bar is 64px tall, holds five 15px/500 links centred with the
 * wordmark left, and ends in a white pill CTA whose radius is 39px with 8px
 * 20px of padding (all measured — see _shots/spec-opraah-home.json). Those are
 * the numbers this reproduces.
 *
 * One deliberate departure: the reference is transparent over its dark hero and
 * only tints once scrolled. Our page alternates dark and LIGHT sections, and a
 * transparent bar over a white section turns the white wordmark invisible. So
 * the bar always carries its own surface — the moment an opaque backdrop does
 * not cost legibility is the moment it is worth having.
 */

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "People", href: "#room" },
  { label: "Mumbai", href: "#mumbai" },
  { label: "Brochure", href: "#brochure" },
  { label: "Why HR VISTA", href: "#why" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /**
   * The hero's anchors are ids on the landing page, so they only resolve from
   * "/". From any other route they must be prefixed with "/" to travel home
   * first — otherwise `/work` would look for a `#work` element that is not
   * there and the click would silently do nothing.
   */
  const onHome = pathname === "/";
  const anchor = (hash: string) => (onHome ? hash : `/${hash}`);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Deepen the bar's surface once the page has moved, so it separates from the
  // hero's media rather than sitting flat on it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-[var(--dur-base)] ease-[var(--ease-expo)] ${
        scrolled
          ? "border-[var(--line-dark)] bg-[color-mix(in_srgb,var(--ink-900)_88%,transparent)] backdrop-blur-xl"
          : "border-transparent bg-[color-mix(in_srgb,var(--ink-900)_45%,transparent)] backdrop-blur-md"
      }`}
      style={{ height: "var(--nav-h)" }}
    >
      <div className="content-max mx-auto flex h-full items-center justify-between gap-[var(--space-md)] px-[var(--section-padding-x)]">
        {/* Lockup — dot glyph + wordmark, as in the reference */}
        <a href={anchor("#top")} className="group inline-flex min-h-11 shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--royal-500)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-expo)] group-hover:scale-125"
          />
          <span className="font-display text-base font-bold tracking-[-0.03em] text-[var(--paper)]">
            HR VISTA <span className="text-[var(--royal-300)]">3.0</span>
          </span>
        </a>

        {/* Desktop nav — 15px / 500 / −0.01em, matching the measured links.
            Centred absolutely so the wordmark and CTA keep their own widths. */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative inline-flex min-h-11 items-center text-[length:var(--text-nav)] font-medium tracking-[-0.01em] text-[var(--paper)]/85 transition-colors duration-[var(--dur-fast)] hover:text-[var(--paper)]"
            >
              {link.label}
              <span
                aria-hidden
                className="absolute bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[var(--royal-500)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-expo)] group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* The nav pill: 39px radius, 8px 20px padding — measured. */}
          <a
              href={anchor("#contact")}
            className="hidden min-h-11 items-center rounded-[var(--radius-nav-cta)] bg-[var(--paper)] px-5 py-2 font-display text-[length:var(--text-nav)] font-semibold tracking-[-0.01em] text-[var(--ink-900)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--royal-500)] hover:text-white sm:inline-flex"
          >
            Register
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-[var(--line-dark)] lg:hidden"
          >
            <span
              className={`block h-px w-4 bg-[var(--paper)] transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-4 bg-[var(--paper)] transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile panel — OPAQUE, own stacking layer (no bleed-through) */}
      {open && (
        <div
          className="fixed inset-x-0 z-50 max-h-[calc(100svh-var(--nav-h))] overflow-y-auto border-b border-[var(--line-dark)] bg-[var(--ink-900)] px-[var(--section-padding-x)] py-6 lg:hidden"
          style={{ top: "var(--nav-h)" }}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={anchor(link.href)}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--line-dark)] py-4 font-display text-2xl font-semibold text-[var(--paper)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href={anchor("#contact")}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-nav-cta)] bg-[var(--paper)] px-5 py-3 font-display font-semibold text-[var(--ink-900)]"
            >
              Register
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
