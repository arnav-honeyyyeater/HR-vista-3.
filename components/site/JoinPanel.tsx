import { MagneticLink, SignalField } from "./HomeMotion";
import styles from "./HomeInterior.module.css";

export function JoinPanel() {
  return (
    <section id="join" aria-labelledby="join-title" className={`hv-section ${styles.join}`}>
      <span id="involved" className={styles.hashAlias} aria-hidden="true" />
      <SignalField className={styles.joinField} strength={85}>
        <div className={styles.joinOrb} aria-hidden="true"><span /><span /><span /></div>
        <div className="hv-container">
          <div className={styles.chapterLabel}><p className="hv-eyebrow">06 / Keep the conversation moving</p><span>HR VISTA 3.0 ↗</span></div>
          <h2 id="join-title" className={styles.joinTitle}>THE NEXT<br /><span>CHAPTER.</span></h2>
          <div className={styles.joinGrid}>
            <div className={styles.joinCopy}><p className={styles.joinCity}>MUMBAI / 2026</p><p className="hv-copy">New ground. More perspectives. A shared future of work. Explore the vision for HR VISTA 3.0 in the brochure, or follow the conversations that brought us here.</p><div className={styles.joinActions}><MagneticLink href="/brochure" className={`hv-button hv-button--light ${styles.joinPrimary}`}>Read the brochure <span aria-hidden="true">↗</span></MagneticLink><MagneticLink href="/work" className={`hv-button ${styles.participationTrigger}`}>Revisit the editions <span aria-hidden="true">↗</span></MagneticLink></div><p className={styles.joinDate}>21–22 November 2026<br /><span>Mumbai · BKC · Jio Grounds</span></p></div>
            <MagneticLink href="/brochure" className={styles.brochurePreview} label="Preview the 12-page HR VISTA 3.0 brochure"><span id="brochure" className={styles.brochureAlias} /><div className={styles.brochureImage}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brochure/page-01.png" alt="Cover of the HR VISTA 3.0 brochure" width={834} height={1053} loading="lazy" /></div><div className={styles.brochureCaption}><span>KEEP EXPLORING</span><strong>The HR VISTA<br />3.0 brochure</strong><p>12 pages · Read online</p><span className={styles.brochureArrow} aria-hidden="true">↗</span></div></MagneticLink>
          </div>
        </div>
      </SignalField>
    </section>
  );
}
