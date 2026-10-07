import { RiseLine } from "@/components/site/Reveal";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { Marquee } from "@/components/ui/Marquee";
import { Counter } from "@/components/ui/Counter";
import { MagneticLink } from "./HomeMotion";
import styles from "./Interior.module.css";

const stats: { value: string; label: string }[] = [
  { value: "500+", label: "Professionals expected" },
  { value: "50+", label: "Organisations anticipated" },
  { value: "02", label: "Days of dialogue & discovery" },
  { value: "01", label: "Platform connecting academia & industry" },
];

/**
 * 01 — THE STATEMENT
 * opraah's section rhythm: marquee opener → giant type → one idea per block.
 * Entrances are spring rises (RevealSafety-backed); the conclave copy is a
 * scroll-scrubbed tint statement, so reading it is the animation.
 */
export function EventOverview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className={`hv-section ${styles.section} ${styles.dark}`}>
      <span id="story" className={styles.hashAlias} aria-hidden="true" />

      <div className={styles.opener}>
        <Marquee
          items={["PEOPLE.", "IDEAS.", "FUTURES.", "MUMBAI 2026", "PEOPLE.", "IDEAS.", "FUTURES.", "MUMBAI 2026"]}
          speed={40}
          velocitySkew
          itemPadding="0 0.35em"
          className={styles.openerItem}
        />
      </div>

      <div className="hv-container">
        <div className={styles.chapterRow}>
          <p className="hv-eyebrow">01 / The statement</p>
          <p className={styles.chapterNote}>HR VISTA 3.0 · Mumbai 2026</p>
        </div>

        <h2 id="overview-title" className={styles.giant}>
          <RiseLine as="span" className={styles.giantLine} delay={0} y={96}>PEOPLE.</RiseLine>
          <RiseLine as="span" className={`${styles.giantLine} ${styles.outline}`} delay={0.12} y={96}>IDEAS.</RiseLine>
          <RiseLine as="span" className={styles.giantLine} delay={0.24} y={96}>FUTURES.</RiseLine>
        </h2>

        <div className={styles.split} style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <ScrollRevealText
            as="p"
            className={styles.statement}
            tint={["#8a97ad", "#ffffff"]}
            text="Different perspectives. A shared future of work. The people who shape what comes next."
          />
          <p className="hv-copy">
            HR VISTA 3.0 is the flagship Human Resources conclave of CHRIST (Deemed to be
            University), Pune Lavasa Campus, presented by the Centre for Placement and Career
            Guidance (CPCG). It brings HR professionals, business leaders, students and academia
            together to explore the future of work. Building on two editions, the 2026 gathering
            moves to Mumbai for two days of conversation, connection and knowledge exchange. From
            workplace culture and talent to AI-led transformation and leadership, it creates space
            for industry experience and academic perspectives to meet—and for ideas to travel
            beyond the room.
          </p>
        </div>

        <ul className={styles.stats} style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {stats.map((stat, i) => (
            <li key={stat.label} className={styles.statCell}>
              <Counter value={stat.value} label={stat.label} delay={i * 0.1} className={styles.stat} />
            </li>
          ))}
        </ul>

        <div className={styles.eventBar}>
          <p className={styles.eventDate}>
            21–22 NOVEMBER 2026
            <span>Mumbai · BKC · Jio Grounds</span>
          </p>
          <MagneticLink href="#experience" className={styles.roundLink} label="Explore the HR VISTA experience">
            <span aria-hidden="true">↓</span>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
