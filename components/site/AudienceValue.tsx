"use client";

import { useState } from "react";
import { content } from "@/lib/data/content";
import { RiseLine, Wipe } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollVelocitySkew } from "@/components/ui/ScrollVelocity";
import { MagneticLink, SignalField } from "./HomeMotion";
import { Tilt } from "./PointerFX";
import styles from "./Interior.module.css";

const pathways = [
  { label: "Corporate leaders", prompt: "Bring your leadership perspective.", focus: "Leadership · Future of work · Emerging talent" },
  { label: "HR professionals", prompt: "Connect practice with fresh perspectives.", focus: "People practices · Knowledge exchange · Professional connections" },
  { label: "Organisations", prompt: "Start a conversation with the HR ecosystem.", focus: "Employer visibility · Industry engagement · Talent connections" },
  { label: "Students", prompt: "Take your learning beyond the classroom.", focus: "Industry exposure · Career awareness · Professional connections" },
  { label: "Academia", prompt: "Build a bridge between learning and practice.", focus: "Management education · Research · Industry perspectives" },
];

/**
 * 03 — YOUR PERSPECTIVE
 * Five full-width rows. Opening one grows its panel in place — the page never
 * jumps, the row simply becomes the focus. Keyboard and touch get the same
 * behaviour as hover, via real buttons.
 */
export function AudienceValue() {
  const [open, setOpen] = useState(1);

  return (
    <section id="audience" aria-labelledby="audience-title" className={`hv-section ${styles.section} ${styles.dark}`}>
      <span id="room" className={styles.hashAlias} aria-hidden="true" />
      <SignalField className={styles.fieldWrap} strength={60}>
      <span className={styles.pointerGlow} aria-hidden="true" />

      <div className={styles.opener}>
        <Marquee
          items={["YOUR PERSPECTIVE", "A PLACE FOR EVERY VOICE", "YOUR PERSPECTIVE", "A PLACE FOR EVERY VOICE"]}
          speed={42}
          velocitySkew
          itemPadding="0 0.35em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.chapterRow}>
          <p className="hv-eyebrow">03 / Your perspective matters</p>
          <p className={styles.chapterNote}>Choose who you are</p>
        </div>

        <ScrollVelocitySkew max={4}>
          <h2 id="audience-title" className={styles.giant}>
            <RiseLine as="span" className={styles.giantLine} y={88}>A PLACE FOR</RiseLine>
            <RiseLine as="span" className={`${styles.giantLine} ${styles.ink}`} delay={0.12} y={88}>YOUR PERSPECTIVE.</RiseLine>
          </h2>
        </ScrollVelocitySkew>

        <div className={styles.rows} style={{ marginTop: "clamp(40px, 6vw, 80px)", borderTop: "none" }}>
          {pathways.map((item, index) => (
            <div key={item.label} className={`${styles.audienceRow} ${open === index ? styles.audienceRowOpen : ""}`}>
              <button
                type="button"
                className={styles.audienceHead}
                aria-expanded={open === index}
                aria-controls={`audience-panel-${index}`}
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                <span className={styles.rowNum}>0{index + 1}</span>
                <span className={styles.audienceLabel}>{item.label}</span>
                <span className={styles.audiencePrompt}>{item.prompt}</span>
                <span className={styles.rowIcon} aria-hidden="true" />
              </button>
              <div
                id={`audience-panel-${index}`}
                className={`${styles.audiencePanel} ${open === index ? styles.audiencePanelOpen : ""}`}
              >
                <div className={styles.audiencePanelInner}>
                  <p className="hv-copy" style={{ margin: 0 }}>
                    {content.whyHrVista.audiences[index].description}
                  </p>
                  <div>
                    <p className={styles.audienceFocus}>{item.focus}</p>
                    <MagneticLink
                      className="hv-button hv-button--light"
                      href="/brochure?page=11"
                    >
                      Explore your perspective
                      <span aria-hidden="true">↗</span>
                    </MagneticLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.mediaRow} ${styles.mediaRow2}`}>
          <Tilt className={styles.tilt}>
            <Wipe className={styles.mediaCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/flickr/room-4.jpg" alt="Senior front-row attendees during a session at HR VISTA 2.0" width={1600} height={901} loading="lazy" />
              <span className={styles.mediaTag}>Leaders in the room</span>
            </Wipe>
          </Tilt>
          <Tilt className={styles.tilt}>
            <Wipe className={styles.mediaCard} delay={0.12}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/flickr/stats-2.jpg" alt="An attendee at the CHRIST (Deemed to be University) venue signage wall" width={1600} height={900} loading="lazy" />
              <span className={styles.mediaTag}>Students & academia</span>
            </Wipe>
          </Tilt>
        </div>
      </div>
      </SignalField>
    </section>
  );
}
