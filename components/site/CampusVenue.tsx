import { MagneticLink, ScrollDrift } from "./HomeMotion";
import styles from "./HomeInterior.module.css";

export function CampusVenue() {
  return (
    <section id="venue" aria-labelledby="venue-title" className={`hv-section ${styles.venue}`}>
      <span id="organisers" className={styles.hashAlias} aria-hidden="true" />
      <div className="hv-container">
        <p className="hv-eyebrow">05 / New ground. Shared roots.</p>
        <h2 id="venue-title" className={styles.venueTitle}>LAVASA <span aria-hidden="true">↗</span><br /><span>MUMBAI.</span></h2>
        <div className={styles.connectionLine} aria-hidden="true"><span>LAVASA / THE INSTITUTION</span><i /><span>MUMBAI / THE GATHERING</span></div>
        <div className={styles.venueGrid}>
          <article className={styles.institution}>
            <ScrollDrift className={styles.campusFrame} distance={20}><figure className={styles.campusPhoto}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/media/flickr/story-4.jpg" alt="Lavasa lake surrounded by green Sahyadri hills" width={1024} height={576} loading="lazy" /><figcaption>Lavasa landscape · the campus’s surrounding setting</figcaption></figure></ScrollDrift>
            <div className={styles.institutionCopy}>{/* eslint-disable-next-line @next/next/no-img-element */}<img className={styles.institutionLogo} src="/media/raw/logo_christ_lavasa.png" alt="CHRIST (Deemed to be University)" width={1794} height={608} loading="lazy" /><p className="hv-eyebrow">The organising institution</p><h3>CHRIST, Pune Lavasa Campus</h3><p className="hv-copy">Known as the university’s Analytical Hub, the Lavasa campus combines academic rigour with experiential learning. Its Centre for Placement and Career Guidance connects students, academia and industry through career initiatives, corporate engagement and professional development.</p><MagneticLink href="/brochure" className="hv-link">Read about CHRIST & CPCG <span aria-hidden="true">↗</span></MagneticLink></div>
          </article>
          <article className={styles.mumbaiVenue}>
            <span className={styles.venueOrbit} aria-hidden="true" />
            <p className="hv-eyebrow">HR VISTA 3.0 / 2026 venue</p>
            <div className={styles.venueDate} aria-hidden="true"><span>21—22</span><strong>NOV / 2026</strong></div>
            <h3>At the heart<br />of the conversation.</h3>
            <p className="hv-copy">Bandra Kurla Complex brings together business, finance, technology and talent—a natural setting for the next HR VISTA gathering.</p>
            <dl className={styles.venueFacts}><div><dt>When</dt><dd>21–22 November 2026</dd></div><div><dt>Where</dt><dd>Jio Grounds<br /><span>Bandra Kurla Complex, Mumbai</span></dd></div><div><dt>Presented by</dt><dd>Centre for Placement<br />and Career Guidance</dd></div></dl>
            <MagneticLink href="https://www.google.com/maps/search/?api=1&query=Jio+Grounds+Bandra+Kurla+Complex+Mumbai" className={styles.venueMapLink}>Explore the location <span aria-hidden="true">↗</span></MagneticLink>
          </article>
        </div>
      </div>
    </section>
  );
}
