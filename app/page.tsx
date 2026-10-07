import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { EventOverview } from "@/components/site/EventOverview";
import { EventExperience } from "@/components/site/EventExperience";
import { AudienceValue } from "@/components/site/AudienceValue";
import { PastEditions } from "@/components/site/PastEditions";
import { CampusVenue } from "@/components/site/CampusVenue";
import { JoinPanel } from "@/components/site/JoinPanel";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-[var(--ink-900)]">
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <div className="hv">
          <EventOverview />
          <EventExperience />
          <AudienceValue />
          <PastEditions />
          <CampusVenue />
          <JoinPanel />
        </div>
      </main>
      <div className="hv"><SiteFooter /></div>
    </div>
  );
}
