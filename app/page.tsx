import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { ChristIntro } from "@/components/site/ChristIntro";
import {
  Journey,
  JourneyFinale,
} from "@/components/site/Journey";
import { EditionJourney } from "@/components/site/EditionJourney";
import { SiteFooter } from "@/components/site/SiteFooter";
import { People } from "@/components/site/People";
import { SponsorTeaser } from "@/components/site/Sponsors";
export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-[var(--ink-900)]">
      <ChristIntro />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Journey />
        <EditionJourney />
        <People />
        <SponsorTeaser />
        <JourneyFinale />
      </main>
      <SiteFooter />
    </div>
  );
}
