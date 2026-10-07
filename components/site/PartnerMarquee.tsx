"use client";

import { Marquee } from "@/components/ui/Marquee";
import { HeadingWords } from "@/components/ui/HeadingWords";
import { content } from "@/lib/data/content";
import { Reveal } from "./Reveal";
import { WatermarkBand } from "./Sections";

/**
 * S4 — BRAND MARQUEE (opraah: "Some of the world's most recognised
 * Brands. All in one place." + 5 logo cards × infinite marquee).
 *
 * Two rows, opposite directions, pause on hover, cards are opaque
 * light tiles (grayscale → colour on hover).
 */

const HOSTS = content.partners.map((p) => p.name);
const CORPORATES = content.corporateEcosystem.companies;

function LogoCard({ name }: { name: string }) {
  return (
    <div className="mr-4 flex h-[132px] w-[220px] shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-[var(--mist-200)] bg-[var(--sky-100)] px-5 text-center transition-colors duration-[var(--dur-base)] hover:border-[var(--royal-500)] hover:bg-[var(--paper)] md:h-[176px] md:w-[300px]">
      <span className="font-display text-[0.8rem] leading-snug font-semibold text-[var(--mist-400)] transition-colors duration-[var(--dur-base)] md:text-base">
        {name}
      </span>
    </div>
  );
}

export function PartnerMarquee() {
  return (
    <section id="partners" className="sec sec-light relative overflow-hidden">
      <div className="sec-layer content-max">
        {/* The reference's repeating display label, scrolled edge to edge. */}
        <WatermarkBand label="Brands & institutions" className="mb-[var(--space-md)]" />

        <div className="display-2 max-w-4xl text-[length:var(--text-section)]">
          <HeadingWords as="div" text="Some of India's most followed institutions." />
          <HeadingWords
            as="div"
            delay={0.07}
            className="text-[var(--mist-400)]"
            text="All in one place."
          />
        </div>

        <Reveal delay={0.1} className="mt-9 space-y-4">
          <Marquee
            items={HOSTS.map((name) => (
              <LogoCard key={name} name={name} />
            ))}
            speed={34}
            velocitySkew
          />
          <Marquee
            items={CORPORATES.map((name) => (
              <LogoCard key={name} name={name} />
            ))}
            speed={38}
            reverse
            velocitySkew
          />
        </Reveal>
      </div>
    </section>
  );
}
