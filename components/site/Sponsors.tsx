"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Sponsors.module.css";

const concepts = [
  { name: "Centre stage", label: "START A CONVERSATION", copy: "A bold brand presence at the centre of the HR VISTA story.", color: "#c4d7ff", turn: "-13deg" },
  { name: "In the conversation", label: "MAKE A CONNECTION", copy: "An identity woven into the moments where people and ideas meet.", color: "#e7d7ad", turn: "7deg" },
  { name: "Beyond the event", label: "KEEP THE MOMENTUM", copy: "A lasting place in the community’s next chapter.", color: "#b4d8ca", turn: "-5deg" },
];

function BrandStage({ name = "YOUR BRAND", mode = 0, compact = false }: { name?: string; mode?: number; compact?: boolean }) {
  return <div className={`${styles.stage} ${compact ? styles.compact : ""}`} style={{ "--stage-accent": concepts[mode].color, "--stage-turn": concepts[mode].turn } as CSSProperties} aria-hidden="true">
    <div className={styles.stageFloor} />
    <div className={styles.stageAssembly}>
      <div className={`${styles.stagePanel} ${styles.backPanel}`}><span>PEOPLE.</span><span>POSSIBILITY.</span></div>
      <div className={`${styles.stagePanel} ${styles.midPanel}`}><span>HR VISTA</span><strong>3.0</strong><small>MUMBAI / 2026</small></div>
      <div className={`${styles.stagePanel} ${styles.frontPanel}`}><span>THE NEXT CHAPTER, TOGETHER.</span><strong data-long={name.trim().length > 16}><span>{name.trim() || "YOUR BRAND"}</span><i>↗</i></strong><small>SPONSOR SHOWCASE / PREVIEW</small></div>
    </div>
    <div className={styles.stageCaption}><i /><span>SPACE FOR A BIGGER IDEA.</span><span>03.0</span></div>
  </div>;
}

const stairCards = [
  { label: "A SHARED SPOTLIGHT", foot: "THE NEXT CHAPTER, TOGETHER", background: "#c4d7f2", ink: "#172b48" },
  { label: "A NEW CONNECTION", foot: "GOOD COMPANY. GREATER IMPACT.", background: "#152b47", ink: "#dce8f9" },
  { label: "A BIGGER STAGE", foot: "MUMBAI / NOVEMBER 2026", background: "#d9dfce", ink: "#233a38" },
  { label: "A WORLD OF POSSIBILITY", foot: "PEOPLE MEET POSSIBILITY", background: "#2d51ca", ink: "#e5eeff" },
  { label: "A LASTING IMPRESSION", foot: "LET’S MAKE WHAT’S NEXT", background: "#eae6db", ink: "#293c51" },
];

function SponsorStaircase({ name = "", paused = false, home = false }: { name?: string; paused?: boolean; home?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const brand = name.trim() || "YOUR BRAND";
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current;
      if (!section) return;
      const run = section.querySelector<HTMLElement>("[data-stair-run]");
      const cards = section.querySelectorAll<HTMLElement>("[data-sponsor-step]");
      const sequence = gsap.timeline({ scrollTrigger: {
        trigger: run, start: "top top", end: "bottom bottom", scrub: .65, invalidateOnRefresh: true,
      } });
      cards.forEach((card, i) => {
        sequence.fromTo(card, {
          xPercent: -50, yPercent: -50,
          x: () => window.innerWidth * (window.innerWidth < 700 ? -.1 + i * .13 : -.1 + i * .17),
          y: () => window.innerHeight * (.5 + i * .22),
          rotateY: -68, rotateZ: -8 + i * 3, scale: .9,
        }, {
          x: () => window.innerWidth * (window.innerWidth < 700 ? -.37 + i * .13 : -.45 + i * .17),
          y: () => window.innerHeight * (-.83 + i * .23),
          rotateY: 68, rotateZ: 7 - i * 3, scale: 1,
          duration: 1.25, ease: "none",
        }, i * .09);
      });
      sequence.fromTo(section.querySelector("[data-stair-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1.61, ease: "none" }, 0);
      timeline.current = sequence;
      if (pausedRef.current) sequence.scrollTrigger?.disable(false);
      const heading = section.querySelector("h2");
      gsap.fromTo(heading, { y: 50, opacity: .4 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 88%", toggleActions: "play none none reverse" } });
      return () => { timeline.current = null; };
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    const trigger = timeline.current?.scrollTrigger;
    if (paused) trigger?.disable(false);
    else trigger?.enable(false, false);
  }, [paused]);
  return <section ref={root} id={home ? "sponsors" : "sponsor-staircase"} className={styles.staircase} aria-labelledby={home ? "sponsor-teaser-title" : "staircase-title"}>
    <div className={styles.stairHeading}>
      <div><p className={styles.eyebrow}>06 / A SHARED SPOTLIGHT</p><h2 id={home ? "sponsor-teaser-title" : "staircase-title"}>Good company.<br /><em>Greater impact.</em></h2></div>
      <div className={styles.stairHeadingAside}><p>The right names.<br />The right conversations.<br />A bigger world of possibilities.</p><span className={styles.stairScroll}>SCROLL TO FIND YOUR PLACE <i>↓</i></span></div>
    </div>
    <div className={styles.stairRun} data-stair-run>
      <div className={styles.stairScene}>
        <div className={styles.stairSceneTop}><span>HR VISTA × WHAT’S NEXT</span><span>05 POSSIBILITIES / ONE COMMUNITY</span></div>
        <div className={styles.stairGuide} aria-hidden="true" />
        {stairCards.map((card, i) => <article key={card.label} className={styles.stairCard} data-sponsor-step={i} style={{ "--step": i, "--card-bg": card.background, "--card-ink": card.ink } as CSSProperties}>
          <div className={styles.stairCardTop}><span>{card.label}</span><span>0{i + 1}</span></div>
          <div className={styles.stairIdentity}>
            {i === 0 ? <><span className={styles.collabName}>HR VISTA <i>×</i></span><strong data-long={brand.length > 15}>{brand}</strong></> :
              i === 1 ? <><span className={styles.cardAsterisk} aria-hidden="true">✳</span><strong>Your next<br />connection.</strong></> :
              i === 2 ? <><strong className={styles.stairEdition}>3.0<span>↗</span></strong><span className={styles.cardSub}>A new dimension for your brand.</span></> :
              i === 3 ? <strong>People.<br />Possibility.</strong> : <><span className={styles.collabName}>THE NEXT CHAPTER</span><strong data-long={brand.length > 15}>{brand}<i className={styles.cardArrow}>↗</i></strong></>}
          </div>
          <div className={styles.stairCardFoot}><span>{card.foot}</span><span>↗</span></div>
        </article>)}
        <div className={styles.stairSceneFoot}><div><p>SHOWCASE CONCEPTS · SPONSORS TO BE ANNOUNCED</p><div className={styles.stairProgress}><span data-stair-progress /></div></div><Link href={home ? "/sponsors" : "#brand-preview"} className={styles.stairLink}>{home ? "Find your place" : "Try your brand"}<span>↗</span></Link></div>
      </div>
    </div>
  </section>;
}

export function SponsorTeaser() {
  return <SponsorStaircase home />;
}

export function Sponsors() {
  const [mode, setMode] = useState(0);
  const [name, setName] = useState("");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  return <main id="main-content" className={styles.page} data-paused={paused || !!reduced}>
    <section className={styles.hero} aria-labelledby="sponsor-title">
      <div className={styles.heroTop}><p className={styles.eyebrow}>HR VISTA 3.0 / PARTNERSHIPS</p><span className={styles.previewTag}>SHOWCASE PREVIEW</span></div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}><h1 id="sponsor-title">Amplify<br />what’s <em>next.</em><span className={styles.headArrow} aria-hidden="true">↗</span></h1><p>Extraordinary conversations deserve extraordinary company. Make room for your brand in the future of work.</p><a className={styles.cta} href="#brand-preview">Put your brand in the picture <span>↓</span></a></div>
        <BrandStage name={name} mode={mode} />
      </div>
      <div className={styles.heroFoot}><span>MUMBAI · 21—22 NOVEMBER 2026</span><p>One community. Many possibilities.</p><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Play motion ▶" : "Pause motion Ⅱ"}</button></div>
    </section>
    <div className={styles.ribbon} aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>PEOPLE MEET POSSIBILITY <i>✳</i> BETTER, TOGETHER <i>✳</i></span>)}</div></div>
    <SponsorStaircase name={name} paused={paused} />
    <section id="brand-preview" className={styles.preview} aria-labelledby="preview-title">
      <div className={styles.previewHeading}><div><p className={styles.eyebrow}>A LITTLE IMAGINATION. A BIG PRESENCE.</p><h2 id="preview-title">Your name.<br /><em>A new dimension.</em></h2></div><p>Explore the visual direction for our sponsor showcase. Try a name and choose a scene.</p></div>
      <div className={styles.previewGrid}>
        <div className={styles.editor}>
          <label htmlFor="brand-name">YOUR BRAND NAME</label><input id="brand-name" value={name} onChange={event => setName(event.target.value)} maxLength={24} placeholder="Your brand" autoComplete="organization" aria-describedby="brand-help" /><p id="brand-help">A live visual preview. Nothing is submitted or saved.</p>
          <div className={styles.sceneOptions} role="group" aria-label="Choose a sponsor showcase scene">{concepts.map((concept, i) => <button key={concept.name} type="button" aria-pressed={mode === i} onClick={() => setMode(i)}><span>0{i + 1}</span><strong>{concept.name}</strong><span>{mode === i ? "↗" : "+"}</span></button>)}</div>
          <div className={styles.sceneDescription} aria-live="polite"><span>{concepts[mode].label}</span><p>{concepts[mode].copy}</p></div>
        </div>
        <div className={styles.previewCanvas}><BrandStage name={name} mode={mode} /><p className={styles.previewNote}>ILLUSTRATIVE PLACEMENT · NOT A CONFIRMED SPONSOR</p></div>
      </div>
      <p className={styles.disclaimer}>These are visual concepts. Sponsorship categories, benefits and availability will be confirmed by the organising team.</p>
    </section>
    <section className={styles.future} aria-labelledby="future-sponsors-title">
      <motion.div initial={reduced ? false : { y: 35 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
        <p className={styles.eyebrow}>THE COMPANY WE KEEP</p><h2 id="future-sponsors-title">The next names<br />start <em>here.</em></h2><p>Our HR VISTA 3.0 sponsor lineup will be announced here.</p>
        <div className={styles.emptyLineup} aria-label="No confirmed sponsors announced"><span>SPONSORS</span><span className={styles.emptyDash}>—</span><span>TO BE ANNOUNCED</span></div>
        <a className={styles.cta} href="mailto:hrvista.lavasa@christuniversity.in?subject=HR%20VISTA%203.0%20%E2%80%94%20Partnership%20enquiry">Let’s start a conversation <span>↗</span></a><p className={styles.email}>hrvista.lavasa@christuniversity.in</p>
      </motion.div>
    </section>
  </main>;
}
