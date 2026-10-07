import { content } from "@/lib/data/content";
import { RiseLine, Wipe } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollDrift, MagneticLink } from "./HomeMotion";
import styles from "./Interior.module.css";

const previews = [
  {
    photo: "/media/raw/hrvista1_feb03.jpg",
    alt: "An HR VISTA 1.0 delegate taking part in a conversation in February 2025",
    caption: "A delegate conversation · February 2025",
    recap: "The first edition brought around 50 HR delegates to Lavasa for keynotes, mentorship and conversations about the changing world of work.",
    anchor: "hr-vista-1",
    month: "FEBRUARY",
  },
  {
    photo: "/media/flickr/editions-1.jpg",
    alt: "A speaker at the podium during HR VISTA 2.0 in November 2025",
    caption: "Perspectives from the stage · November 2025",
    recap: "The second edition explored leadership in a post-AI world through four panels, two round tables and connections across the HR community.",
    anchor: "hr-vista-2",
    month: "NOVEMBER",
  },
];

/**
 * 04 — THE JOURNEY
 * Two edition cards, stacked and offset. The media wipes in and drifts on
 * scroll; the year numerals sit on the photograph like a poster stamp.
 */
export function PastEditions() {
  return (
    <section id="work" aria-labelledby="editions-title" className={`hv-section ${styles.section} ${styles.wash}`}>
      <div className={styles.opener}>
        <Marquee
          items={["THE JOURNEY SO FAR", "2025", "THE JOURNEY SO FAR", "2025"]}
          speed={38}
          reverse
          velocitySkew
          itemPadding="0 0.35em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.chapterRow}>
          <p className="hv-eyebrow">04 / The journey so far</p>
          <MagneticLink href="/work" className="hv-link">
            Explore the archive <span aria-hidden="true">↗</span>
          </MagneticLink>
        </div>

        <h2 id="editions-title" className={styles.giant}>
          <RiseLine as="span" className={styles.giantLine} y={88}>THE NEXT CHAPTER</RiseLine>
          <RiseLine as="span" className={`${styles.giantLine} ${styles.ink}`} delay={0.12} y={88}>STARTED HERE.</RiseLine>
        </h2>

        <div className={styles.stack} style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          {content.pastEditions.map((edition, index) => (
            <article
              key={edition.edition}
              className={styles.editionCard}
              style={{ marginLeft: index === 1 ? "clamp(0px, 6vw, 96px)" : 0 }}
            >
              <div className={styles.editionTopline}>
                <span>{edition.edition}</span>
                <span>CHRIST · LAVASA</span>
              </div>

              <ScrollDrift distance={index === 0 ? 16 : -16}>
                <Wipe className={styles.editionMedia}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previews[index].photo} alt={previews[index].alt} width={1600} height={900} loading="lazy" />
                  <span className={styles.editionYear} aria-hidden="true">2025</span>
                  <span className={styles.editionMonth} aria-hidden="true">{previews[index].month}</span>
                </Wipe>
              </ScrollDrift>
              <p className={styles.editionCaption}>{previews[index].caption}</p>

              <div className={styles.editionBody}>
                <div>
                  <p className={styles.editionDate}>{edition.dates}</p>
                  <h3 className={styles.editionTheme}>{edition.theme}</h3>
                </div>
                <div>
                  <p className="hv-copy" style={{ margin: 0 }}>{previews[index].recap}</p>
                  <p style={{ margin: "18px 0 0" }}>
                    <MagneticLink href={`/work#${previews[index].anchor}`} className="hv-link">
                      Revisit {edition.edition} <span aria-hidden="true">↗</span>
                    </MagneticLink>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
