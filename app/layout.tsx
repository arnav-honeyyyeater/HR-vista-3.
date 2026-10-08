import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { RevealSafety } from "@/components/site/Reveal";
import "./globals.css";

/**
 * Display — Nohemi.
 *
 * This is the face the reference sets its entire site in, and it is the single
 * biggest reason their type reads the way it does: a tight geometric grotesque
 * with flat terminals and no optical quirks, which lets a 80px headline sit at
 * −0.025em without the counters closing up.
 *
 * It was previously Bricolage Grotesque. Bricolage is a fine display face but it
 * is wide and deliberately eccentric — at the same nominal size its headline ran
 * ~20% longer than the reference's, and its quirky `t`, `f` and `g` read as
 * "designer" rather than "institution". See docs/TYPE-NOHEMI.md for the
 * side-by-side.
 *
 * LICENCE: Nohemi is freeware — "you can use it freely for personal and
 * commercial projects; the typeface files may not be modified". We ship the
 * files unmodified. Terms are reproduced in app/fonts/Nohemi-LICENSE.txt.
 *
 * Self-hosted rather than linked: it is not on Google Fonts, and `next/font`
 * gives us the files inlined into the build with no render-blocking request.
 */
const nohemi = localFont({
  src: [
    { path: "./fonts/Nohemi-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Nohemi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Nohemi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Nohemi-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Nohemi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/**
 * Body — Manrope, unchanged.
 *
 * The reference pairs Nohemi with Manrope too (its eyebrow is Manrope 400), so
 * this is their pairing rather than a compromise.
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "HR VISTA 3.0 — The Future of Work. The People Who Shape It.",
  description:
    "HR VISTA 3.0 — 21–22 November 2026, BKC, Jio Grounds, Mumbai. The flagship HR conclave of CHRIST (Deemed to be University), Pune Lavasa Campus: keynote conversations, leadership panels, industry interactions and networking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${nohemi.variable} ${manrope.variable}`}>
      <body className="font-body bg-[var(--ink-900)] text-[var(--paper)] antialiased">
        <LenisProvider>
          <RevealSafety />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
