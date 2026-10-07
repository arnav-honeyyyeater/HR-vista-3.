import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={["hv", styles.footer].join(" ")}>
      <div className="hv-container">
        <div className={styles.columns}>
          <div>
            <Link className={styles.wordmark} href="/">HR VISTA <span>3.0</span></Link>
            <p className={styles.description}>The future of work.<br />The people who shape it.</p>
            <p className={styles.event}>21–22 November 2026<br />BKC · Jio Grounds · Mumbai</p>
          </div>
          <nav aria-label="Footer" className={styles.navigation}>
            <p className={styles.label}>Explore</p>
            <Link href="/#overview">About the conclave</Link>
            <Link href="/work">Past editions</Link>
            <Link href="/brochure">Read the brochure</Link>
            <Link href="/#experience">Explore the experience ↗</Link>
          </nav>
          <div className={styles.presented}>
            <p className={styles.label}>Presented by</p>
            <p>Centre for Placement and<br />Career Guidance</p>
            <p className={styles.institution}>CHRIST (Deemed to be University)<br />Pune Lavasa Campus</p>
            <Link href="/#venue" className={styles.enquiry}>The institution &amp; the setting ↗</Link>
          </div>
        </div>
        <div className={styles.signature} aria-hidden="true">HR VISTA<span>3.0</span></div>
        <div className={styles.bottom}>
          <p>© 2026 HR VISTA · CHRIST Pune Lavasa Campus</p>
          <Link href="/#top">Back to the beginning <span aria-hidden="true">↑</span></Link>
        </div>
      </div>
    </footer>
  );
}
