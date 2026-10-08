"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { people } from "@/lib/data/people";
import { Tilt } from "./PointerFX";
import styles from "./People.module.css";

const filters = ["Everyone", "Faculty & leadership", "Team & community"] as const;

export function People() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Everyone");
  const reduced = useReducedMotionPreference();
  const shown = people.filter(person => filter === "Everyone" || person.group === filter);
  return <section id="people" className={styles.section} aria-labelledby="people-title">
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>05 / THE HUMAN ELEMENT</p><h2 id="people-title">Big vision.<br /><em>Human energy.</em></h2></div>
      <div className={styles.intro}><span className={styles.spark} aria-hidden="true">✳</span><p>The faculty, organisers and community behind the conversation.</p><a href="https://www.linkedin.com/company/cpcgchristlavasa/" target="_blank" rel="noopener noreferrer">Meet CPCG on LinkedIn ↗</a></div>
    </div>
    <div className={styles.toolbar}>
      <div className={styles.filters} role="group" aria-label="Filter the people directory">{filters.map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
      <span className={styles.count} role="status">{String(shown.length).padStart(2, "0")} PEOPLE</span>
    </div>
    <motion.div layout={!reduced} className={styles.grid}>
      {shown.map((person, index) => <motion.article layout={!reduced} key={person.name} initial={reduced ? false : { y: 40, rotate: index % 2 ? 2 : -2 }} whileInView={{ y: 0, rotate: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay: Math.min(index * .055, .2) }}>
        <Tilt className={styles.card} max={5} lift={8}>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn (opens in a new tab)`}>
            <div className={styles.cardTop}><span>{person.group === "Faculty & leadership" ? "CHRIST / LAVASA" : "HR VISTA / COMMUNITY"}</span><span className={styles.linkedin}>in ↗</span></div>
            <div className={styles.art} aria-hidden="true"><i /><i /><span>{person.initials}</span><b>HUMAN CONNECTION</b></div>
            <div className={styles.identity}><h3>{person.name}</h3><p>{person.role}</p><span className={styles.profile}>View LinkedIn profile <b>↗</b></span></div>
          </a>
        </Tilt>
      </motion.article>)}
    </motion.div>
    <p className={styles.source}>People and roles from <a href="https://www.hrvista.live/contact" target="_blank" rel="noopener noreferrer">HR VISTA 2.0</a>. The 3.0 organising committee will be confirmed separately.</p>
    <div id="guests" className={styles.guestEmpty}>
      <span className={styles.emptyIcon} aria-hidden="true">↗</span><div><p className={styles.eyebrow}>HR VISTA 3.0 / GUESTS</p><h3>The next voices.<br /><em>Yet to be revealed.</em></h3></div><p>Guest announcements are on their way.<br />Watch this space.</p>
    </div>
  </section>;
}
