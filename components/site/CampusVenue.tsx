import { RiseLine, Wipe } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollDrift, MagneticLink } from "./HomeMotion";
import styles from "./Interior.module.css";

/**
 * 05 — NEW GROUND
 * One full-bleed photograph between two statements: the institution that grew
 * the conclave, and the city that hosts it this year. Facts stay scannable.
 */
export function CampusVenue() {
  return (
    <section id="venue" aria-labelledby="venue-title" className={`hv-section ${styles.section} ${styles.dark}`}>
      <span id="organisers" className={styles.hashAlias} aria-hidden="true" />

      <div className={styles.opener}>
        <Marquee
          items={["NEW GROUND", "SHARED ROOTS", "LAVASA → MUMBAI", "NEW GROUND", "SHARED ROOTS", "LAVASA → MUMBAI"]}
          speed={42}
          velocitySkew
          itemPadding="0 0.35em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.chapterRow}>
          <p className="hv-eyebrow">05 / New ground. Shared roots.</p>
          <p className={styles.chapterNote}>From the campus to the country’s stage</p>
        </div>

        <h2 id="venue-title" className={styles.giant}>
          <RiseLine as="span" className={styles.giantLine} y={88}>LAVASA</RiseLine>
          <RiseLine as="span" className={`${styles.giantLine} ${styles.ink}`} delay={0.12} y={88}>MUMBAI.</RiseLine>
        </h2>
      </div>

      <ScrollDrift distance={22}>
        <figure className={styles.heroPhoto} style={{ marginInline: "clamp(20px, 4vw, 64px)" }}>
          <Wipe>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/flickr/story-4.jpg" alt="Lavasa lake surrounded by green Sahyadri hills" width={1024} height={576} loading="lazy" />
          </Wipe>
        </figure>
      </ScrollDrift>
      <div className="hv-container">
        <p className={styles.photoCaption}>Lavasa landscape · the campus’s surrounding setting</p>

        <div className={`${styles.mediaRow} ${styles.mediaRow2}`}>
          <Wipe className={styles.mediaCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/flickr/editions-4.jpg" alt="Delegates and volunteers in a group photograph at HR VISTA 2.0" width={1600} height={900} loading="lazy" />
            <span className={styles.mediaTag}>The community</span>
          </Wipe>
          <Wipe className={styles.mediaCard} delay={0.12}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/flickr/story-5.jpg" alt="The traditional lamp-lighting inauguration at HR VISTA 2.0" width={1600} height={901} loading="lazy" />
            <span className={styles.mediaTag}>The tradition</span>
          </Wipe>
        </div>

        <div className={styles.split} style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <article>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.institutionLogo}
              src="/media/raw/logo_christ_lavasa.png"
              alt="CHRIST (Deemed to be University)"
              width={1794}
              height={608}
              loading="lazy"
            />
            <p className="hv-eyebrow">The organising institution</p>
            <h3 className={styles.editionTheme} style={{ fontSize: "clamp(24px, 2.6vw, 36px)" }}>
              CHRIST, Pune Lavasa Campus
            </h3>
            <p className="hv-copy" style={{ maxWidth: "58ch" }}>
              Known as the university’s Analytical Hub, the Lavasa campus combines academic rigour
              with experiential learning. Its Centre for Placement and Career Guidance connects
              students, academia and industry through career initiatives, corporate engagement and
              professional development.
            </p>
            <p style={{ margin: "20px 0 0" }}>
              <MagneticLink href="/brochure" className="hv-link">
                Read about CHRIST &amp; CPCG <span aria-hidden="true">↗</span>
              </MagneticLink>
            </p>
          </article>

          <article className={styles.venueCard}>
            <p className="hv-eyebrow">HR VISTA 3.0 / 2026 venue</p>
            <p className={styles.venueDate}>
              <span>21—22</span>
              <strong>NOV / 2026</strong>
            </p>
            <h3 className={styles.editionTheme} style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}>
              At the heart of the conversation.
            </h3>
            <p className="hv-copy">
              Bandra Kurla Complex brings together business, finance, technology and talent—a
              natural setting for the next HR VISTA gathering.
            </p>
            <dl className={styles.facts}>
              <div>
                <dt>When</dt>
                <dd>21–22 November 2026</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>
                  Jio Grounds
                  <br />
                  <span>Bandra Kurla Complex, Mumbai</span>
                </dd>
              </div>
              <div>
                <dt>Presented by</dt>
                <dd>
                  Centre for Placement
                  <br />
                  and Career Guidance
                </dd>
              </div>
            </dl>
            <p style={{ margin: "22px 0 0" }}>
              <MagneticLink
                href="https://www.google.com/maps/search/?api=1&query=Jio+Grounds+Bandra+Kurla+Complex+Mumbai"
                className="hv-link"
              >
                Explore the location <span aria-hidden="true">↗</span>
              </MagneticLink>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
