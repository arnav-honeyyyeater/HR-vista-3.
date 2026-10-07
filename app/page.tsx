import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { PostHeroExperience } from "@/components/site/rework/PostHeroExperience";

/**
 * HR VISTA 3.0
 *
 * The existing landing / hero experience is deliberately preserved.
 * Everything after the hero is the production rework on
 * redesign/production-rework-v2.
 */
export default function HomePage() {
  return (
    <main id="top" className="min-h-screen bg-[var(--ink-900)]">
      <SiteHeader />
      <Hero />
      <PostHeroExperience />
    </main>
  );
}
