"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { people } from "@/lib/data/people";
import styles from "./People.module.css";

const filters = ["Everyone", "Faculty & leadership", "Team & community"] as const;

// The letters are a graphic identity for each connection, not portrait imagery.
const nodePositions = [
  { x: 19, y: 23, turn: -12 },
  { x: 53, y: 13, turn: 9 },
  { x: 84, y: 32, turn: -8 },
  { x: 82, y: 72, turn: 12 },
  { x: 49, y: 85, turn: -10 },
  { x: 15, y: 66, turn: 8 },
  { x: 36, y: 44, turn: -5 },
];

function Initials({ value, echo = false }: { value: string; echo?: boolean }) {
  return <span className={echo ? styles.initialEcho : styles.initialLetters}>{[...value].map((letter, index) => <span key={`${letter}-${index}`} style={{ "--letter": index } as CSSProperties}>{letter}</span>)}</span>;
}

export function People() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Everyone");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  const shown = people.filter(person => filter === "Everyone" || person.group === filter);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const observed = [stage.current, ...section.querySelectorAll<HTMLElement>("[data-person-signal]"), section.querySelector<HTMLElement>("[data-guest-signal]")].filter((element): element is HTMLElement => !!element);
    const visible = new Set<HTMLElement>();
    const update = () => observed.forEach(element => {
      element.dataset.active = String(visible.has(element) && !document.hidden);
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
        else visible.delete(entry.target as HTMLElement);
      });
      update();
    }, { threshold: .08 });
    observed.forEach(element => observer.observe(element));
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [filter]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const scene = stage.current;
      if (!scene || paused) return;
      const context = gsap.context(() => {
        const network = scene.querySelector<HTMLElement>("[data-network]");
        const nodes = scene.querySelectorAll<HTMLElement>("[data-network-node]");
        const paths = scene.querySelectorAll<SVGPathElement>("[data-network-path]");
        const sequence = gsap.timeline({ scrollTrigger: { trigger: scene, start: "top 88%", end: "top 12%", scrub: .75, invalidateOnRefresh: true } });
        sequence.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: .065, ease: "none" }, 0);
        nodes.forEach((node, index) => {
          const position = nodePositions[index];
          sequence.fromTo(node, {
            xPercent: -50,
            yPercent: -50,
            x: () => (50 - position.x) * (scene.clientWidth < 700 ? 3 : 5),
            y: (50 - position.y) * 4,
            scale: .4,
            rotate: -position.turn * 3,
          }, { x: 0, y: 0, xPercent: -50, yPercent: -50, scale: 1, rotate: 0, duration: 1.2, ease: "power2.out" }, index * .07);
        });
        sequence.fromTo(scene.querySelector("[data-signal-core]"), { x: 0, y: 0, xPercent: -50, yPercent: -50, scale: .6, rotate: -90 }, { scale: 1, rotate: 0, duration: 1.5, ease: "power2.out" }, 0);
        gsap.fromTo(network, { y: 45 }, { y: -45, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.fromTo(scene.querySelector("[data-human-energy]"), { x: -35 }, { x: 25, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1 } });
      }, scene);
      return () => context.revert();
    });
    return () => media.revert();
  }, [paused]);

  return <section ref={root} id="people" className={styles.section} aria-labelledby="people-title" data-paused={paused || reduced}>
    <div ref={stage} className={styles.signalStage}>
      <div className={styles.stageTop}><p className={styles.eyebrow}>05 / THE HUMAN ELEMENT</p><span className={styles.stageLabel}>A COMMUNITY IN MOTION</span></div>
      <div className={styles.stageCopy}>
        <h2 id="people-title">Big vision.<br /><em>Human<br /><span data-human-energy>energy.</span></em></h2>
        <p>The faculty, organisers and community behind the conversation. Every connection brings a different kind of energy.</p>
        <a className={styles.communityLink} href="https://www.linkedin.com/company/cpcgchristlavasa/" target="_blank" rel="noopener noreferrer">Meet CPCG on LinkedIn <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.network} data-network aria-hidden="true">
        <div className={styles.networkOrbit}><i /><i /><i /></div>
        <svg className={styles.connections} viewBox="0 0 800 660" fill="none">
          {nodePositions.map((position, index) => <g key={index}>
            <path data-network-path pathLength="1" strokeDasharray="1" d={`M416 343 Q${position.x * 8} 343 ${position.x * 8} ${position.y * 6.6}`} />
            <path className={styles.signalTrail} pathLength="1" strokeDasharray=".045 .955" style={{ "--trail-delay": `${index * -.9}s` } as CSSProperties} d={`M416 343 Q${position.x * 8} 343 ${position.x * 8} ${position.y * 6.6}`} />
          </g>)}
        </svg>
        <div className={styles.signalCore} data-signal-core><span>✳</span><i /><i /></div>
        {people.map((person, index) => <div key={person.name} className={styles.networkNode} data-network-node style={{ "--node-x": `${nodePositions[index].x}%`, "--node-y": `${nodePositions[index].y}%`, "--node-turn": `${nodePositions[index].turn}deg`, "--node-delay": `${index * -.7}s` } as CSSProperties}>
          <div className={styles.nodeFloat}><span className={styles.nodeNumber}>0{index + 1}</span><Initials value={person.initials} /><Initials value={person.initials} echo /><i /></div>
        </div>)}
        <span className={styles.networkAnnotation}>DIFFERENT VOICES.<br />ONE SHARED MOMENTUM.</span>
      </div>
      <div className={styles.stageFoot}><span><i aria-hidden="true" />PEOPLE MAKE THE DIFFERENCE.</span><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)} disabled={reduced}>{reduced ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}<span aria-hidden="true">{paused || reduced ? "▶" : "Ⅱ"}</span></button><a href="#people-directory">Meet the people <span aria-hidden="true">↓</span></a></div>
    </div>

    <div id="people-directory" className={styles.directory}>
      <div className={styles.directoryHeading}><h3>The people<br /><em>behind it.</em></h3><p>A look at the people who helped shape the previous chapter of HR VISTA.</p></div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter the people directory">{filters.map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
        <span className={styles.count} role="status" aria-live="polite">{String(shown.length).padStart(2, "0")} PEOPLE</span>
      </div>
      <motion.div layout={!reduced} className={styles.grid}>
        {shown.map(person => {
          const index = people.indexOf(person);
          return <motion.article layout={!reduced} key={person.name} className={styles.person} data-person-signal style={{ "--person": index, "--signal-delay": `${index * -.45}s` } as CSSProperties} initial={reduced ? false : { y: 35 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay: Math.min(index * .045, .18) }}>
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn (opens in a new tab)`}>
              <div className={styles.personArt} aria-hidden="true"><span className={styles.personNumber}>0{index + 1}</span><div className={styles.glyphTrack}><Initials value={person.initials} /><Initials value={person.initials} echo /></div><div className={styles.waveform}>{Array.from({ length: 13 }, (_, bar) => <i key={bar} style={{ "--bar": bar, "--bar-height": `${12 + ((bar * 7 + index * 3) % 24)}px` } as CSSProperties} />)}</div></div>
              <div className={styles.identity}><span className={styles.group}>{person.group}</span><h4>{person.name}</h4><p>{person.role}</p><span className={styles.profile}>LinkedIn profile <b aria-hidden="true">↗</b></span></div>
            </a>
          </motion.article>;
        })}
      </motion.div>
      <p className={styles.source}>People and roles from <a href="https://www.hrvista.live/contact" target="_blank" rel="noopener noreferrer">HR VISTA 2.0</a>. The 3.0 organising committee will be confirmed separately.</p>
    </div>

    <div id="guests" className={styles.guestEmpty} data-guest-signal>
      <div className={styles.guestSignal} aria-hidden="true"><span>?</span><i /><i /><i /></div>
      <div><p className={styles.eyebrow}>HR VISTA 3.0 / GUESTS</p><h3>The next voices.<br /><em>Yet to be revealed.</em></h3></div><p>Guest announcements are on their way.<br />Watch this space.</p>
    </div>
  </section>;
}
