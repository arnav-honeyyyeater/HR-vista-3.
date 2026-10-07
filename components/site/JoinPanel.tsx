import { RiseLine } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { MagneticLink } from "./HomeMotion";
import styles from "./Interior.module.css";

/**
 * 06 — THE NEXT CHAPTER
 * The page's one colour moment: the whole section flips to brand blue and the
 * CTAs go white. The brochure card lifts and straightens under the pointer.
 */
export function JoinPanel() {
  return (
    <section id="join" aria-labelledby="join-title" className={`hv-section ${styles.section} ${styles.brand}`}>
      <span id="involved" className={styles.hashAlias} aria-hidden="true" />

      <div className={styles.opener}>
        <Marquee
          items={["KEEP THE CONVERSATION MOVING", "MUMBAI 2026", "KEEP THE CONVERSATION MOVING", "MUMBAI 2026"]}
          speed={40}
          reverse
          velocitySkew
          itemPadding="0 0.35em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.chapterRow}>
          <p className="hv-eyebrow" style={{ color: "#dfe7ff" }}>06 / Keep the conversation moving</p>
          <p className={styles.chapterNote}>HR VISTA 3.0</p>
        </div>

        <h2 id="join-title" className={styles.giant}>
          <RiseLine as="span" className={styles.giantLine} y={88}>THE NEXT</RiseLine>
          <RiseLine as="span" className={`${styles.giantLine} ${styles.outline}`} delay={0.12} y={88}>CHAPTER.</RiseLine>
        </h2>

        <div className={styles.joinGrid} style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <div>
            <p className={styles.audienceFocus} style={{ color: "#dfe7ff" }}>MUMBAI / 2026</p>
            <p className={`hv-copy ${styles.copy}`} style={{ maxWidth: "52ch", marginTop: 14 }}>
              New ground. More perspectives. A shared future of work. Explore the vision for HR
              VISTA 3.0 in the brochure, or follow the conversations that brought us here.
            </p>
            <div className={styles.joinActions}>
              <MagneticLink href="/brochure" className="hv-button hv-button--light">
                Read the brochure <span aria-hidden="true">↗</span>
              </MagneticLink>
              <MagneticLink href="/work" className={`hv-button ${styles.ghostButton}`}>
                Revisit the editions <span aria-hidden="true">↗</span>
              </MagneticLink>
            </div>
            <p className={styles.joinDate}>
              21–22 November 2026
              <br />
              <span>Mumbai · BKC · Jio Grounds</span>
            </p>
          </div>

          <MagneticLink
            href="/brochure"
            className={styles.brochureCard}
            label="Preview the 12-page HR VISTA 3.0 brochure"
          >
            <span id="brochure" className={styles.hashAlias} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brochure/page-01.png" alt="Cover of the HR VISTA 3.0 brochure" width={834} height={1053} loading="lazy" />
            <span className={styles.brochureCaption}>
              <span>Keep exploring</span>
              <strong>The HR VISTA 3.0 brochure</strong>
              <span>12 pages · Read online</span>
            </span>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
