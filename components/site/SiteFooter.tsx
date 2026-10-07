import { Marquee } from "@/components/ui/Marquee";
import styles from "./Interior.module.css";

const chapterLinks = [
  { href: "#overview", label: "The statement" },
  { href: "#experience", label: "The experience" },
  { href: "#audience", label: "Your perspective" },
  { href: "#work", label: "The journey" },
  { href: "#venue", label: "New ground" },
  { href: "#join", label: "The next chapter" },
];

const exploreLinks = [
  { href: "/work", label: "Editions archive" },
  { href: "/brochure", label: "Brochure reader" },
  { href: "/brochure?page=11", label: "Get involved" },
];

/**
 * Footer — the wordmark runs as one last marquee, then plain link columns.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWord}>
        <Marquee
          items={["HR VISTA 3.0", "MUMBAI 2026", "HR VISTA 3.0", "MUMBAI 2026"]}
          speed={46}
          velocitySkew
          itemPadding="0 0.4em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h3>Chapters</h3>
            <ul>
              {chapterLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h3>Explore</h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h3>The conclave</h3>
            <ul>
              <li>
                <a href="https://www.google.com/maps/search/?api=1&query=Jio+Grounds+Bandra+Kurla+Complex+Mumbai">
                  Jio Grounds, BKC, Mumbai
                </a>
              </li>
              <li>
                <a href="#top">Back to top</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerMeta}>
          <span>
            CHRIST (Deemed to be University), Pune Lavasa Campus · Centre for Placement and Career
            Guidance
          </span>
          <span>
            Photographs show previous editions. 500+ professionals and 50+ organisations are
            projections, not live registrations.
          </span>
        </div>
      </div>
    </footer>
  );
}
