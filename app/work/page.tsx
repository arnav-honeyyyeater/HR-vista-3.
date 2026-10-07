import type { Metadata } from "next";
import { EditionsArchive } from "@/components/site/EditionsArchive";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Editions — HR VISTA 3.0",
  description:
    "Every HR VISTA edition, its theme and its formats: HR VISTA 1.0 (Feb 2025), HR VISTA 2.0 (Nov 2025) and HR VISTA 3.0 (21–22 November 2026, BKC, Mumbai).",
};

/**
 * /work — the editions archive.
 *
 * Built 1:1 to the reference's /work page: a white ground, an oversized page
 * heading, and a grid of media cards each carrying a doubled, scrolling title
 * and a "More" pill. See components/site/EditionsArchive.tsx for the mapping.
 */
export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <EditionsArchive />
      <SiteFooter />
    </>
  );
}
