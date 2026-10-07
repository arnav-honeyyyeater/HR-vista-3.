"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { content, type PastEdition } from "@/lib/data/content";
import { PhotoLightbox, type GalleryPhoto } from "./PhotoLightbox";
import styles from "./EditionsArchive.module.css";

const galleries: { id: string; edition: string; photos: GalleryPhoto[] }[] = [
  {
    id: "hr-vista-2", edition: "HR VISTA 2.0",
    photos: [
      { src: "/media/flickr/editions-3.jpg", alt: "Participants lighting the ceremonial lamp at HR VISTA 2.0", caption: "The lamp-lighting ceremony opened HR VISTA 2.0 in November 2025.", source: "https://www.flickr.com/photos/christ_lavasa/54929146843" },
      { src: "/media/flickr/editions-1.jpg", alt: "A speaker addressing delegates from the HR VISTA 2.0 podium", caption: "A speaker at the podium during the November 2025 edition.", source: "https://www.flickr.com/photos/christ_lavasa/54928176262" },
      { src: "/media/flickr/story-1.jpg", alt: "Two speakers seated on stage at HR VISTA 2.0", caption: "An on-stage conversation at HR VISTA 2.0.", source: "https://www.flickr.com/photos/christ_lavasa/54929281940" },
      { src: "/media/flickr/editions-2.jpg", alt: "Dancers performing on the HR VISTA 2.0 stage", caption: "Cultural performances brought the community together beyond the sessions.", source: "https://www.flickr.com/photos/christ_lavasa/54929402570" },
      { src: "/media/flickr/editions-4.jpg", alt: "HR VISTA 2.0 delegates and volunteers in a group photograph", caption: "Delegates and volunteers together at the November 2025 edition.", source: "https://www.flickr.com/photos/christ_lavasa/54929350865" },
    ],
  },
  {
    id: "hr-vista-1", edition: "HR VISTA 1.0",
    photos: [
      { src: "/media/flickr/raw/hrvista1_feb21.jpg", alt: "HR VISTA 1.0 delegates seated in the campus amphitheatre", caption: "Delegates gathered in the amphitheatre at the February 2025 edition.", source: "https://www.flickr.com/photos/christ_lavasa/54354549532" },
      { src: "/media/flickr/raw/hrvista1_feb01.jpg", alt: "Dancers performing on stage during HR VISTA 1.0", caption: "A cultural dance performance at HR VISTA 1.0.", source: "https://www.flickr.com/photos/christ_lavasa/54355631519" },
      { src: "/media/flickr/raw/hrvista1_feb08.jpg", alt: "A colourful cultural performance on the HR VISTA 1.0 stage", caption: "The first edition's cultural programme, February 2025.", source: "https://www.flickr.com/photos/christ_lavasa/54355832250" },
    ],
  },
];

function EditionChapter({ id, edition, photos }: { id: string; edition: PastEdition; photos: GalleryPhoto[] }) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const photo = photos[selected];
  return (
    <section id={id} className={`${styles.chapter} ${id === "hr-vista-1" ? styles.firstEdition : ""}`} aria-labelledby={`${id}-title`}>
      <div className="hv-container">
      <div className={styles.chapterHeader}>
        <div><p className="hv-eyebrow">Looking back · {edition.dates}</p><h2 id={`${id}-title`} className={styles.editionTitle}><span>HR VISTA</span>{edition.edition.replace("HR VISTA ", "")}</h2></div>
        <p className={styles.location}><span>Where it happened</span>{edition.venue}</p>
      </div>
      <div className={styles.chapterBody}>
        <div className={styles.recap}>
          <p className={styles.themeLabel}>The theme</p>
          <h3>{edition.theme}</h3>
          <p className="hv-copy">{edition.notes}</p>
          <p className={styles.galleryHint}>{photos.length} moments from this edition. Choose a photo to explore, or open it for a closer look.</p>
        </div>
        <div className={styles.gallery}>
          <div className={styles.galleryIndex}><span>From the archive</span><span>{String(selected + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span></div>
          <figure>
            <button type="button" className={styles.featurePhoto} onClick={() => setOpen(true)} aria-label={`Enlarge photo ${selected + 1}: ${photo.alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} width={1600} height={900} loading="lazy" />
              <span className={styles.enlarge}><span aria-hidden="true">↗</span> View larger</span>
            </button>
            <figcaption className={styles.caption} aria-live="polite">
              <span>{photo.caption}</span>
              <a href={photo.source} target="_blank" rel="noreferrer">Photo: CHRIST Lavasa / Flickr <span aria-hidden="true">↗</span></a>
            </figcaption>
          </figure>
          <div className={styles.photoPicker} aria-label={`${edition.edition} photos`}>
            {photos.map((item, index) => (
              <button type="button" key={item.src} aria-pressed={selected === index} aria-label={`Photo ${index + 1}: ${item.alt}`} onClick={() => setSelected(index)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" width={160} height={90} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
      {open && <PhotoLightbox photos={photos} index={selected} onChange={setSelected} onClose={() => setOpen(false)} label={`${edition.edition} photo gallery`} />}
    </section>
  );
}

export function EditionsArchive() {
  const masthead = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: masthead, offset: ["start start", "end start"] });
  const photoDrift = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const smallPhotoDrift = useTransform(scrollYProgress, [0, 1], [0, 40]);
  return (
    <main id="main-content" className={`hv ${styles.archive}`}>
        <header className={styles.masthead} ref={masthead}>
          <div className={`hv-container ${styles.mastheadInner}`}>
            <div className={styles.topline}><p>The HR VISTA archive</p><p>Lavasa, India <span aria-hidden="true">↗</span> 2025</p></div>
            <div className={styles.mastheadGrid}>
              <div className={styles.heroCopy}>
                <h1 className={styles.heroTitle}><span>Human</span><span>signals<span className={styles.titleDot}>.</span></span></h1>
                <p className={styles.heroDescription}>The conversations. The community.<br />The moments that stay with us.</p>
                <p className={styles.heroNote}>Two editions in Lavasa brought HR leaders, students and industry together. This is their story.</p>
              </div>
              <div className={styles.photoSpread}>
                <span className={styles.orbitMark} aria-hidden="true">✳</span>
                <motion.a className={styles.heroPhotoMain} href="#hr-vista-2" style={{ y: reduceMotion ? 0 : photoDrift, rotate: reduceMotion ? 0 : 5 }} whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.025 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/flickr/story-1.jpg" alt="Two speakers in conversation at HR VISTA 2.0, November 2025" width={1600} height={900} />
                  <span>02 / Conversations in motion <span aria-hidden="true">↗</span></span>
                </motion.a>
                <motion.a className={styles.heroPhotoSmall} href="#hr-vista-1" style={{ y: reduceMotion ? 0 : smallPhotoDrift, rotate: reduceMotion ? 0 : -9 }} whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.025 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/flickr/raw/hrvista1_feb21.jpg" alt="Delegates in the amphitheatre at HR VISTA 1.0, February 2025" width={1600} height={900} />
                  <span>01 / Where it began <span aria-hidden="true">↗</span></span>
                </motion.a>
              </div>
            </div>
          <nav className={styles.editionNav} aria-label="Jump to an edition">
            <a href="#hr-vista-2"><strong>2.0</strong><span>November 2025</span><span className={styles.navArrow} aria-hidden="true">↓</span></a>
            <a href="#hr-vista-1"><strong>1.0</strong><span>February 2025</span><span className={styles.navArrow} aria-hidden="true">↓</span></a>
            <p>Two editions.<br />One growing community.</p>
          </nav>
          </div>
        </header>
        <div className={styles.signalStrip} aria-hidden="true"><span>People make the future</span><span>↗</span><span>HR VISTA / 2025</span></div>
        {galleries.map((gallery) => {
          const edition = content.pastEditions.find((item) => item.edition === gallery.edition);
          return edition ? <EditionChapter key={gallery.id} id={gallery.id} edition={edition} photos={gallery.photos} /> : null;
        })}
      <section className={styles.upcoming} aria-labelledby="next-edition-title">
        <span className={styles.nextNumber} aria-hidden="true">3.0</span>
        <div className={`hv-container ${styles.upcomingInner}`}>
          <div><p className="hv-eyebrow">HR VISTA 3.0 · Upcoming</p><h2 id="next-edition-title" className={styles.nextTitle}>Next<br />chapter<span>↗</span></h2></div>
          <div>
            <p className={styles.upcomingDate}>{content.hero.dates}</p>
            <p className={styles.upcomingLocation}>Mumbai · BKC · Jio Grounds</p>
            <p className="hv-copy">{content.hero.theme}. Two days of keynote conversations, leadership panels and connections across the HR community.</p>
            <div className={styles.actions}>
              <Link className={styles.nextAction} href="/brochure">Read the brochure <span aria-hidden="true">↗</span></Link>
              <Link className="hv-link" href="/">Explore HR VISTA 3.0 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
