import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { ChristIntro } from "@/components/site/ChristIntro";
import {
  Journey,
  EditionJourney,
  JourneyFinale,
} from "@/components/site/Journey";
import { SiteFooter } from "@/components/site/SiteFooter";
export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-[var(--ink-900)]">
      <ChristIntro />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Journey />
        <EditionJourney />
        <JourneyFinale />
      </main>
      <SiteFooter />
    </div>
  );
}
