import type { Metadata } from "next";
import { EditionsArchive } from "@/components/site/EditionsArchive";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Editions — HR VISTA 3.0",
  description:
    "Every HR VISTA edition, its theme and its formats: HR VISTA 1.0 (Feb 2025), HR VISTA 2.0 (Nov 2025) and HR VISTA 3.0 (21–22 November 2026, BKC, Mumbai).",
};

/** Edition recaps with photographs from each historical event. */
export default function WorkPage() {
  return (
    <div className="hv">
      <SiteHeader />
      <EditionsArchive />
      <SiteFooter />
    </div>
  );
}
