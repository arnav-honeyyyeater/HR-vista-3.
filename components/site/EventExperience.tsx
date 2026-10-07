"use client";

import { useState } from "react";
import { content } from "@/lib/data/content";
import { RiseLine, Wipe } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollVelocitySkew } from "@/components/ui/ScrollVelocity";
import styles from "./Interior.module.css";

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

/**
 * 02 — THE EXPERIENCE
 * One sticky photo stage, one column of big format rows. Hovering or focusing a
 * row crossfades the stage; opening it slides the detail in. The heading leans
 * with scroll velocity — subtle, settles flat.
 */
export function EventExperience() {
  const [active, setActive] = useState(1);

  return (
    <section id="experience" aria-labelledby="experience-title" className={`hv-section ${styles.section} ${styles.light}`}>
      <div className={styles.opener}>
        <Marquee
          items={["THE EXPERIENCE", "GOOD IDEAS NEED A ROOM", "THE EXPERIENCE", "GOOD IDEAS NEED A ROOM"]}
          speed={44}
          reverse
          velocitySkew
          itemPadding="0 0.35em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.chapterRow}>
          <p className="hv-eyebrow">02 / The experience</p>
          <p className={styles.chapterNote}>Five formats. One connected community.</p>
        </div>

        <ScrollVelocitySkew max={4}>
          <h2 id="experience-title" className={styles.giant}>
            <RiseLine as="span" className={styles.giantLine} y={88}>GOOD IDEAS</RiseLine>
            <RiseLine as="span" className={`${styles.giantLine} ${styles.ink}`} delay={0.12} y={88}>NEED A ROOM.</RiseLine>
          </h2>
        </ScrollVelocitySkew>

        <div className={styles.splitWide} style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <div>
            <p className={`hv-copy ${styles.copy}`} style={{ maxWidth: "58ch", marginBottom: "clamp(24px, 3vw, 40px)" }}>
              Two days in Mumbai built around conversation — keynotes, panels, round tables and the
              encounters that happen between them. Choose a format and follow the thread.
            </p>
            <div className={styles.rows}>
              {content.whatAwaits.map((format, index) => (
                <details
                  className={`${styles.row} ${active === index ? styles.rowActive : ""}`}
                  key={format.title}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <summary onClick={() => setActive(index)}>
                    <span className={styles.rowNum}>0{index + 1}</span>
                    <span>
                      <h3 className={styles.rowTitle}>{format.title.toLowerCase()}</h3>
                      <span className={styles.rowHint}>{format.description}</span>
                    </span>
                    <span className={styles.rowIcon} aria-hidden="true" />
                  </summary>
                  <p className={styles.rowDetail}>{furtherContext[index]}</p>
                </details>
              ))}
            </div>
            <p className={styles.note}>
              Photographs show previous editions. The 2026 programme and speakers are subject to
              confirmation.
            </p>
          </div>

          <div className={styles.stage}>
            <Wipe className={styles.stageFrame}>
              {photographs.map((photo, index) => (
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={index === active ? photo.alt : ""}
                  aria-hidden={index !== active}
                  width={1600}
                  height={900}
                  loading="lazy"
                  className={index === active ? styles.active : ""}
                />
              ))}
              <span className={styles.stageIndex} aria-hidden="true">0{active + 1}</span>
            </Wipe>
            <p className={styles.stageCaption}>
              <strong>{photographs[active].caption}</strong>
              <span>{photographs[active].edition} · Lavasa</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
