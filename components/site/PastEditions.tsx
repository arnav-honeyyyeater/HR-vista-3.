import { content } from "@/lib/data/content";
import { RiseLine, Wipe } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { StickyStack } from "@/components/ui/StickyStack";
import { ScrollVelocitySkew } from "@/components/ui/ScrollVelocity";
import { ScrollDrift, MagneticLink } from "./HomeMotion";
import { Tilt } from "./PointerFX";
import styles from "./Interior.module.css";

const previews = [
  {
    photo: "/media/raw/hrvista1_feb03.jpg",
    alt: "An HR VISTA 1.0 delegate taking part in a conversation in February 2025",
    caption: "A delegate conversation · February 2025",
    recap: "The first edition brought around 50 HR delegates to Lavasa for keynotes, mentorship and conversations about the changing world of work.",
    anchor: "hr-vista-1",
    month: "FEBRUARY",
    extra: [
      { src: "/media/flickr/story-2.jpg", alt: "A cultural dance performance on the HR VISTA stage in February 2025" },
      { src: "/media/flickr/room-3.jpg", alt: "HR VISTA 1.0 delegates seated on tiered amphitheatre seating" },
    ],
  },
  {
    photo: "/media/flickr/editions-1.jpg",
    alt: "A speaker at the podium during HR VISTA 2.0 in November 2025",
    caption: "Perspectives from the stage · November 2025",
    recap: "The second edition explored leadership in a post-AI world through four panels, two round tables and connections across the HR community.",
    anchor: "hr-vista-2",
    month: "NOVEMBER",
    extra: [
      { src: "/media/flickr/editions-3.jpg", alt: "The lamp-lighting ceremony opening HR VISTA 2.0 in November 2025" },
      { src: "/media/flickr/editions-2.jpg", alt: "A cultural night dance performance with stage lighting at HR VISTA 2.0" },
    ],
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

        <ScrollVelocitySkew max={4}>
          <h2 id="editions-title" className={styles.giant}>
            <RiseLine as="span" className={styles.giantLine} y={88}>THE NEXT CHAPTER</RiseLine>
            <RiseLine as="span" className={`${styles.giantLine} ${styles.ink}`} delay={0.12} y={88}>STARTED HERE.</RiseLine>
          </h2>
        </ScrollVelocitySkew>

        <div style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <StickyStack
            className={styles.stack}
            stickyTop="10vh"
            step={22}
            shrink={0.96}
            rotate={1.2}
            cards={content.pastEditions.map((edition, index) => (
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

              <div className={`${styles.mediaRow} ${styles.mediaRow2}`}>
                <Tilt className={styles.tilt}>
                  <Wipe className={styles.mediaCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previews[index].extra[0].src} alt={previews[index].extra[0].alt} width={1600} height={900} loading="lazy" />
                  </Wipe>
                </Tilt>
                <Tilt className={styles.tilt}>
                  <Wipe className={styles.mediaCard} delay={0.1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previews[index].extra[1].src} alt={previews[index].extra[1].alt} width={1600} height={900} loading="lazy" />
                  </Wipe>
                </Tilt>
              </div>
            </article>
          ))}
          />
        </div>
      </div>
    </section>
  );
}
