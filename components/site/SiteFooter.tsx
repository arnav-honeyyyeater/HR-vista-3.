import styles from "./StoryFooter.module.css";
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <a href="/" className={styles.wordmark}>
          HR VISTA <span>3.0</span>
        </a>
        <p>
          New ground.
          <br />
          Shared roots.
        </p>
        <a
          href="/#top"
          className={styles.back}
          aria-label="Back to homepage top"
        >
          ↑
        </a>
      </div>
      <div className={styles.grid}>
        <div className={styles.institution}>
          <img
            src="/media/raw/logo_christ_lavasa.png"
            alt="CHRIST (Deemed to be University), Pune Lavasa Campus"
            width={280}
            height={100}
          />
          <p>
            Presented by the Centre for Placement
            <br />
            and Career Guidance.
          </p>
        </div>
        <nav aria-label="Journey chapters">
          <span>FOLLOW THE STORY</span>
          <a href="/#lavasa">Our Lavasa roots</a>
          <a href="/#journey">The journey</a>
          <a href="/#mumbai">Hello, Mumbai</a>
          <a href="/#editions">1.0 → 2.0 → 3.0</a>
        </nav>
        <nav aria-label="More about HR Vista">
          <span>TAKE A CLOSER LOOK</span>
          <a href="/work">The edition archive ↗</a>
          <a href="/#people">The people behind it ↗</a>
          <a href="/sponsors">Sponsor showcase ↗</a>
          <a href="/brochure">Read the brochure ↗</a>
          <a href="/brochure/HR-VISTA-3.0.pdf" download>
            Download brochure ↓
          </a>
        </nav>
      </div>
      <div className={styles.bottom}>
        <span>HR VISTA 3.0 · MUMBAI · 2026</span>
        <p>
          Photography from past editions. Participation figures for 3.0 are
          expectations.
        </p>
      </div>
    </footer>
  );
}
