import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { StoryJourney } from "@/components/site/StoryJourney";
import { GalleryStrip } from "@/components/site/GalleryStrip";
import { StatsCounters } from "@/components/site/StatsCounters";
import { PartnerMarquee } from "@/components/site/PartnerMarquee";
import { WhatAwaits } from "@/components/site/WhatAwaits";
import { FlavorList } from "@/components/site/FlavorList";
import { StatementStrip } from "@/components/site/StatementStrip";
import { PastEditions } from "@/components/site/PastEditions";
import { SignatureMoments } from "@/components/site/SignatureMoments";
import { BrochureFlip } from "@/components/site/BrochureFlip";
import { Organisers } from "@/components/site/Organisers";
import { WhoIsInTheRoom } from "@/components/site/WhoIsInTheRoom";
import { GetInvolved } from "@/components/site/GetInvolved";
import { ReviewsSlider } from "@/components/site/ReviewsSlider";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * HR VISTA 3.0 — DESIGN BRIEF V4: gallery-first, media-dominant.
 *
 *  1 Hero (2 headline lines + big media collage)
 *  2 Story (media collage carries it, copy cut to labels)
 *  3 Gallery strip (THE SPINE — vertical scroll drives horizontal tiles)
 *  4 Stats          5 Brand marquee   6 What awaits   7 Not so great at
 *  8 Statement (full-bleed media)      9 Our Work (big media tiles)
 * 10 Our IPs       11 Magazine        12 Organisers   13 In the room
 * 14 Get involved  15 Reviews         16 Footer
 *
 * Sections alternate dark (#060606) / light (#ffffff) exactly like the
 * reference; every surface is opaque (no ghosting).
 */
export default function HomePage() {
  return (
    <main id="top" className="min-h-screen bg-[var(--ink-900)]">
      <SiteHeader />
      <Hero />
      <StoryJourney />
      <GalleryStrip />
      <StatsCounters />
      <PartnerMarquee />
      <WhatAwaits />
      <FlavorList />
      <StatementStrip />
      <PastEditions />
      <SignatureMoments />
      <BrochureFlip />
      <Organisers />
      <WhoIsInTheRoom />
      <GetInvolved />
      <ReviewsSlider />
      <SiteFooter />
    </main>
  );
}
