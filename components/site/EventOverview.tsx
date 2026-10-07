import { MagneticLink, ScrollDrift, SignalField } from "./HomeMotion";
import styles from "./HomeInterior.module.css";

const highlights = [
  ["500+", "Professionals expected"],
  ["50+", "Organisations anticipated"],
  ["02", "Days of dialogue & discovery"],
  ["01", "Platform connecting academia & industry"],
];

export function EventOverview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className={styles.overview}>
      <span id="story" className={styles.hashAlias} aria-hidden="true" />
      <SignalField className={styles.overviewField} strength={52}>
        <div className={styles.overviewOrbit} aria-hidden="true"><span /><span /><span /></div>
        <div className="hv-container">
          <div className={styles.chapterLabel}><p className="hv-eyebrow">01 / Human signals</p><span>HR VISTA 3.0 · Mumbai 2026</span></div>
          <div className={styles.overviewPoster}>
            <h2 id="overview-title" className={styles.posterTitle}><span>PEOPLE.</span><span className={styles.outlineWord}>IDEAS.</span><span>FUTURES<span className={styles.titleDot}>.</span></span></h2>
            <ScrollDrift className={styles.overviewAside} distance={18}>
              <span className={styles.circularStamp} aria-hidden="true">ACADEMIA<br /><b>↗</b><br />INDUSTRY</span>
              <p className={styles.overviewStatement}>Different perspectives.<br />A shared future of work.</p>
            </ScrollDrift>
          </div>
          <div className={styles.overviewBottom}>
            <p className={styles.overviewLead}>The people who<br />shape what comes next.</p>
            <p className="hv-copy">HR VISTA 3.0 is the flagship Human Resources conclave of CHRIST (Deemed to be University), Pune Lavasa Campus, presented by the Centre for Placement and Career Guidance (CPCG). It brings HR professionals, business leaders, students and academia together to explore the future of work. Building on two editions, the 2026 gathering moves to Mumbai for two days of conversation, connection and knowledge exchange. From workplace culture and talent to AI-led transformation and leadership, it creates space for industry experience and academic perspectives to meet—and for ideas to travel beyond the room.</p>
          </div>
          <div className={styles.eventBar}><p><strong>21–22 NOVEMBER 2026</strong><span>MUMBAI · BKC · JIO GROUNDS</span></p><MagneticLink href="#experience" className={styles.roundLink} label="Explore the HR VISTA experience"><span aria-hidden="true">↓</span></MagneticLink></div>
        </div>
      </SignalField>
      <dl className={styles.highlights}>{highlights.map(([value, label]) => <div key={value}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
    </section>
  );
}
