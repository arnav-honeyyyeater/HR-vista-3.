import { content } from "@/lib/data/content";
import { MagneticLink, ScrollDrift, SignalField } from "./HomeMotion";
import styles from "./HomeInterior.module.css";

const previews = [
  { photo: "/media/raw/hrvista1_feb03.jpg", alt: "An HR VISTA 1.0 delegate taking part in a conversation in February 2025", caption: "A delegate conversation · February 2025", recap: "The first edition brought around 50 HR delegates to Lavasa for keynotes, mentorship and conversations about the changing world of work.", anchor: "hr-vista-1", number: "01", month: "FEBRUARY" },
  { photo: "/media/flickr/editions-1.jpg", alt: "A speaker at the podium during HR VISTA 2.0 in November 2025", caption: "Perspectives from the stage · November 2025", recap: "The second edition explored leadership in a post-AI world through four panels, two round tables and connections across the HR community.", anchor: "hr-vista-2", number: "02", month: "NOVEMBER" },
];

export function PastEditions() {
  return (
    <section id="work" aria-labelledby="editions-title" className={`hv-section ${styles.editions}`}>
      <div className="hv-container">
        <div className={styles.sectionHeading}><p className="hv-eyebrow">04 / The journey so far</p><MagneticLink href="/work" className={styles.archiveLink}>Explore the archive <span aria-hidden="true">↗</span></MagneticLink></div>
        <h2 id="editions-title" className={styles.editionsTitle}>THE NEXT CHAPTER<br /><span>STARTED HERE.</span></h2>
        <div className={styles.editionGrid}>{content.pastEditions.map((edition, index) => <SignalField key={edition.edition} className={`${styles.editionCard} ${index === 1 ? styles.editionCardSecond : ""}`} strength={18}>
          <article>
            <div className={styles.editionTopline}><span>{edition.edition}</span><span>CHRIST · LAVASA</span></div>
            <ScrollDrift className={styles.editionPoster} distance={index === 0 ? 18 : -18}>
              <figure><div className={styles.editionImage}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={previews[index].photo} alt={previews[index].alt} width={1600} height={900} loading="lazy" /><div className={styles.editionYear} aria-hidden="true"><span>20</span><span>25</span></div><span className={styles.editionMonth} aria-hidden="true">{previews[index].month}</span></div><figcaption>{previews[index].caption}</figcaption></figure>
            </ScrollDrift>
            <div className={styles.editionCopy}><p className={styles.editionDate}>{edition.dates}</p><h3>{edition.theme}</h3><p className="hv-copy">{previews[index].recap}</p><MagneticLink href={`/work#${previews[index].anchor}`} className={styles.editionAction}>Revisit {edition.edition} <span aria-hidden="true">↗</span></MagneticLink></div>
          </article>
        </SignalField>)}</div>
      </div>
    </section>
  );
}
