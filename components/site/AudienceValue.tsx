"use client";

import { useState } from "react";
import { content } from "@/lib/data/content";
import { MagneticLink, SignalField } from "./HomeMotion";
import styles from "./HomeInterior.module.css";

const pathways = [
  { label: "Corporate leaders", slug: "corporate-leaders", prompt: "Bring your leadership perspective.", focus: "Leadership · Future of work · Emerging talent" },
  { label: "HR professionals", slug: "hr-professionals", prompt: "Connect practice with fresh perspectives.", focus: "People practices · Knowledge exchange · Professional connections" },
  { label: "Organisations", slug: "organisations", prompt: "Start a conversation with the HR ecosystem.", focus: "Employer visibility · Industry engagement · Talent connections" },
  { label: "Students", slug: "students", prompt: "Take your learning beyond the classroom.", focus: "Industry exposure · Career awareness · Professional connections" },
  { label: "Academia", slug: "academia", prompt: "Build a bridge between learning and practice.", focus: "Management education · Research · Industry perspectives" },
];

export function AudienceValue() {
  const [selected, setSelected] = useState(1);
  const pathway = pathways[selected];
  return (
    <section id="audience" aria-labelledby="audience-title" className={`hv-section ${styles.audience}`}>
      <span id="room" className={styles.hashAlias} aria-hidden="true" />
      <div className="hv-container">
        <div className={styles.chapterLabel}><p className="hv-eyebrow">03 / Your perspective matters</p><span>Select your signal ↘</span></div>
        <h2 id="audience-title" className={styles.audienceTitle}>A PLACE FOR<br /><span>YOUR PERSPECTIVE.</span></h2>
        <div className={styles.audienceGrid}>
          <SignalField className={styles.radarField} strength={42}>
            <div className={styles.radarRings} aria-hidden="true"><span /><span /><span /><i /></div>
            <div className={styles.radarControls} aria-label="Choose your audience">
              {pathways.map((item, index) => <button key={item.slug} type="button" aria-pressed={selected === index} aria-controls="audience-pathway" className={`${styles.radarNode} ${styles[`radarNode${index}`]} ${selected === index ? styles.radarNodeActive : ""}`} onClick={() => setSelected(index)}><span aria-hidden="true">0{index + 1}</span><strong>{item.label}</strong></button>)}
            </div>
            <aside id="audience-pathway" className={styles.radarCore} aria-label="Your perspective"><span className={styles.coreMark} aria-hidden="true">↗</span><div aria-live="polite" aria-atomic="true"><p>{pathway.label}</p><h3>{pathway.prompt}</h3></div></aside>
            <div className={styles.radarCoordinate} aria-hidden="true">HUMAN CONNECTION / 03.0</div>
          </SignalField>
          <div className={styles.audienceContent}>
            <p className={styles.audienceIntro}>Different ambitions.<br />One future to shape together.</p>
            <div className={styles.audienceBenefits} aria-label="Benefits for every audience">{pathways.map((item, index) => <div key={item.slug} className={selected === index ? styles.benefitActive : ""}><span aria-hidden="true">0{index + 1}</span><div><h3>{item.label}</h3><p>{content.whyHrVista.audiences[index].description}</p></div></div>)}</div>
            <p className={styles.pathwayFocus}>{pathway.focus}</p>
            <MagneticLink className={`hv-button hv-button--light ${styles.pathwayAction}`} href="/brochure?page=11">Explore your perspective<span aria-hidden="true">↗</span></MagneticLink>
            <p className={styles.pathwayFootnote}>Read how each audience connects with HR VISTA.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
