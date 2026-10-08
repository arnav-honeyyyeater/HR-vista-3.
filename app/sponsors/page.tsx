import type { Metadata } from "next";
import { Sponsors } from "@/components/site/Sponsors";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Sponsor showcase — HR VISTA 3.0",
  description: "Explore the HR VISTA 3.0 sponsor showcase preview. Imagine your brand in the next chapter of the future of work. Sponsor announcements to follow.",
};

export default function SponsorsPage() {
  return <><SiteHeader /><Sponsors /><SiteFooter /></>;
}
