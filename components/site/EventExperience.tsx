"use client";

import { useState } from "react";
import { content } from "@/lib/data/content";
import { SignalField } from "./HomeMotion";
import styles from "./HomeInterior.module.css";

const furtherContext = [
  "Explore how leadership, workplace culture and AI-led transformation are changing the world of work.",
  "Consider challenges in talent, employee experience and organisational change through perspectives from different industries.",
  "Connect the realities of today's workplace with the questions students and academia are exploring.",
  "Meet people across industries, functions and experience levels—and make room for conversations beyond a single session.",
  "Exchange emerging people practices and perspectives that can inform work beyond the conclave.",
];
const photographs = [
  { src: "/media/flickr/editions-1.jpg", alt: "A speaker at the HR VISTA 2.0 podium", caption: "A perspective from the stage", edition: "HR VISTA 2.0 · November 2025" },
  { src: "/media/flickr/story-1.jpg", alt: "Two speakers in conversation on the HR VISTA 2.0 stage", caption: "The conversation in motion", edition: "HR VISTA 2.0 · November 2025" },
  { src: "/media/flickr/room-2.jpg", alt: "Young audience members listening to a session at HR VISTA 2.0", caption: "Learning beyond the classroom", edition: "HR VISTA 2.0 · November 2025" },
  { src: "/media/raw/hrvista1_feb03.jpg", alt: "An HR VISTA 1.0 delegate in a conversation", caption: "Connections across the table", edition: "HR VISTA 1.0 · February 2025" },
  { src: "/media/flickr/room-1.jpg", alt: "Front-row delegates listening at HR VISTA 2.0", caption: "A room full of perspectives", edition: "HR VISTA 2.0 · November 2025" },
];

export function EventExperience() {
  const [active, setActive] = useState(1);
  return (
    <section id="experience" aria-labelledby="experience-title" className={`hv-section ${styles.experience}`}>
      <div className="hv-container">
        <div className={styles.sectionHeading}><p className="hv-eyebrow">02 / The experience</p><p className={styles.smallNote}>Five formats. One connected community.</p></div>
        <h2 id="experience-title" className={styles.experienceTitle}>GOOD IDEAS<br /><span>NEED A ROOM.</span><span className={styles.headingArrow} aria-hidden="true">↙</span></h2>
        <div className={styles.experienceGrid}>
          <SignalField className={styles.experiencePhoto} strength={28}>
            <figure>
              <div className={styles.photoStage}>{photographs.map((photo, index) => <img key={photo.src} src={photo.src} alt={index === active ? photo.alt : ""} aria-hidden={index !== active} width={1600} height={900} loading="lazy" className={index === active ? styles.photoActive : ""} />)}<span className={styles.stageNumber} aria-hidden="true">0{active + 1}</span></div>
              <figcaption><strong>{photographs[active].caption}</strong><span>{photographs[active].edition} · Lavasa</span></figcaption>
            </figure>
            <span className={styles.stageStamp} aria-hidden="true">REAL<br />CONVERSATIONS.<br /><b>↗</b></span>
          </SignalField>
          <div className={styles.programmePanel}>
            <p className={styles.exploreHint}>Choose a format. Follow the conversation. <span aria-hidden="true">↓</span></p>
            <div className={styles.formats}>
              {content.whatAwaits.map((format, index) => <details className={`${styles.format} ${active === index ? styles.formatActive : ""}`} key={format.title}>
                <summary onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span className={styles.rowNumber}>0{index + 1}</span><span><h3>{format.title.toLowerCase()}</h3><span className={styles.formatDescription}>{format.description}</span></span><span className={styles.expandIcon} aria-hidden="true" /></summary>
                <p className={styles.formatDetail}>{furtherContext[index]}</p>
              </details>)}
            </div>
            <p className={styles.programmeNote}>Photographs show previous editions. The 2026 programme and speakers are subject to confirmation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
