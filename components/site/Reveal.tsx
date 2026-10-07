"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useEffect } from "react";

/**
 * Reveal — DESIGN BRIEF V4 §3: NO LATE TEXT, EVER.
 *
 * The old system (framer `whileInView` + `initial: { opacity: 0 }`) wrote a
 * hidden state into the SERVER-RENDERED markup, so text was invisible in the
 * HTML and only appeared once an IntersectionObserver callback landed. That
 * is exactly the "text appears late while scrolling" defect.
 *
 * This system inverts it:
 *
 *   • markup never hides anything — every element is at its final state in
 *     the served HTML/CSS, with or without JS;
 *   • `RevealSafety` (mounted in app/layout.tsx) is the ONLY thing that may
 *     add a pending state, and it only ever does so for elements that are
 *     strictly BELOW the fold at boot;
 *   • anything already inside the viewport at boot is pinned to its final
 *     state immediately (`data-state="now"`), so above-the-fold copy can
 *     never be seen mid-flight;
 *   • the IntersectionObserver fires early (rootMargin 100% of the viewport
 *     below the fold) so the 550ms travel normally completes off-screen.
 *     If the user scrolled fast and the element is already in view, it SNAPS
 *     to final instead of animating — readable beats animated;
 *   • the pending state itself has an opacity floor of 0.6 and travels 24px
 *     (brief §3 hard floors). Text is never at 0.
 *
 * `Reveal` / `RiseLine` are therefore plain presentational wrappers — no
 * framer-motion, no IO, no inline transform to fight scroll parallax.
 */

/** Expo-out — DESIGN_SPEC motion token. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * TRAVEL DISTANCES
 *
 * These used to be 24px across the board, while the entrance also faded from an
 * opacity floor of 0.6 — deliberately timid, because the floor was the only
 * thing standing between a missed IntersectionObserver and invisible copy.
 *
 * With the floor gone (see the reveal block in globals.css) the travel carries
 * the entrance, so it scales with the element. The reference's own numbers run
 * 30px for small blocks to 150px for a hero headline. Pass `y` to override the
 * default (44px, set in CSS as `--rv-y`):
 *
 *   Reveal / RiseLine   y={44}   body copy, small blocks (the default)
 *   Headings            y={68}   section headings and card titles
 *   Display lines       y={96}   section-sized headlines
 */
const revealStyle = (delay: number, y?: number): CSSProperties =>
  ({
    "--rd": `${delay}s`,
    ...(y === undefined ? null : { "--rv-y": `${y}px` }),
  }) as CSSProperties;

interface RevealProps {
  children: ReactNode;
  /** Seconds of delay (stagger 50–90ms per sibling). */
  delay?: number;
  /** Travel distance in px. Defaults to 44 (set in globals.css). */
  y?: number;
  className?: string;
  /** @deprecated above-the-fold content needs no gate; kept for compatibility. */
  onMount?: boolean;
}

/**
 * Viewport entrance — rise + fade, on the reference's bounce-0.2 spring.
 * Visible by default; motion is a post-paint enhancement only.
 */
export function Reveal({ children, delay = 0, y, className = "" }: RevealProps) {
  return (
    <div data-reveal="rise" style={revealStyle(delay, y)} className={className}>
      {children}
    </div>
  );
}

interface RiseLineProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Wrapper element — use "div" when the line contains block content. */
  as?: ElementType;
  /** Travel distance in px. Defaults to 44 (set in globals.css). */
  y?: number;
  /** @deprecated kept for compatibility. */
  onMount?: boolean;
}

/**
 * Display line — same rise as `Reveal`, applied to the element itself.
 * Deliberately NOT masked/clipped: a clip hides the text, and brief §3
 * forbids hiding text. Media gets the masked wipe instead — see `Wipe`.
 */
export function RiseLine({
  children,
  delay = 0,
  className = "",
  as: Tag = "span",
  y,
}: RiseLineProps) {
  return (
    <Tag data-reveal="rise" style={revealStyle(delay, y)} className={className}>
      {children}
    </Tag>
  );
}

interface WipeProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Media-only masked wipe — brief §4 "masked wipe-in reveals (clip-path inset)".
 * Never wrap text in this: a clip-path hides what it clips.
 */
export function Wipe({ children, delay = 0, className = "" }: WipeProps) {
  return (
    <div data-reveal="wipe" style={revealStyle(delay)} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const SELECTOR = "[data-reveal]";
const SNAP_MARGIN = 1.05; // already within 5% of the fold → snap, never animate

/**
 * RevealSafety — the motion boot sequence (mounted once in app/layout.tsx).
 *
 * Layers, ordered by how much they trust JS:
 *   0. NOTHING trusts it: with JS disabled or failed, the CSS default is
 *      "fully visible". Motion is strictly additive.
 *   1. reduced-motion / no IntersectionObserver → html.force-reveal, done.
 *   2. boot pass: below-the-fold → pend, in-view → now (final).
 *   3. early IO: still below the fold → animate; already in view → snap.
 *   4. sweeper: any element that ends up centred in the viewport while still
 *      pending gets pinned to final (rescues a dead IO in a background tab).
 */
export function RevealSafety() {
  useEffect(() => {
    const root = document.documentElement;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      root.classList.add("force-reveal");
      return;
    }

    root.classList.add("motion-ready");

    /** Decide the boot state for one element (also used for late mounts). */
    const bootOne = (el: HTMLElement): HTMLElement | null => {
      if (el.dataset.state) return null;
      const rect = el.getBoundingClientRect();
      if (rect.height < 1 || rect.width < 1) {
        el.dataset.state = "now";
        return null;
      }
      if (rect.top >= window.innerHeight) {
        el.dataset.state = "pend";
        return el;
      }
      el.dataset.state = "now";
      return null;
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const rect = el.getBoundingClientRect();
          // Already on screen (fast scroll / late callback) → snap to final.
          // Text must be readable the instant it is visible.
          if (rect.top < window.innerHeight * SNAP_MARGIN) {
            el.dataset.state = "now";
          } else {
            el.dataset.state = "in";
          }
        }
      },
      // Generous: fires while the target is still a full viewport below the
      // fold, so a 550ms travel lands before it is ever seen.
      { rootMargin: "0px 0px 100% 0px", threshold: 0 },
    );

    const pending: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      const p = bootOne(el);
      if (p) pending.push(p);
    });
    pending.forEach((el) => io.observe(el));

    // Late-mounted nodes (menus, conditionals) get the same treatment, so a
    // dynamically added block can never be stuck hidden.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as HTMLElement;
          const targets: HTMLElement[] = [];
          if (el.matches?.(SELECTOR)) targets.push(el);
          el.querySelectorAll?.<HTMLElement>(SELECTOR).forEach((n) => targets.push(n));
          targets.forEach((t) => {
            const p = bootOne(t);
            if (p) io.observe(p);
          });
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // ---- sweeper: an element centred in the viewport must never be pending
    const stuck = new WeakMap<HTMLElement, number>();
    const sweep = () => {
      if (document.hidden) return;
      const vh = window.innerHeight;
      if (!vh) return;
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.dataset.state !== "pend") return;
        const rect = el.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        if (centre <= 0 || centre >= vh) {
          stuck.delete(el);
          return;
        }
        const hits = (stuck.get(el) ?? 0) + 1;
        stuck.set(el, hits);
        if (hits >= 3) el.dataset.state = "now";
      });
    };
    const interval = window.setInterval(sweep, 400);
    const onVisibility = () => {
      if (document.visibilityState === "visible") sweep();
    };
    document.addEventListener("visibilitychange", onVisibility);
    sweep();

    // A hidden/background document never delivers IO entries — force final.
    const probe = window.setTimeout(() => {
      if (document.visibilityState === "visible") return;
      root.classList.add("force-reveal");
    }, 1500);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(probe);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
