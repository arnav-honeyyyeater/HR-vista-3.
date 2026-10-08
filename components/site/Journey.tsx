"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import type { JourneyMotion } from "./JourneyGlobe";
import { content } from "@/lib/data/content";
import styles from "./Journey.module.css";

const Globe = dynamic(() => import("./JourneyGlobe"), { ssr: false });
const PDF = "/brochure/HR-VISTA-3.0.pdf";

function RegionalMap() {
  return (
    <svg
      className={styles.mapDrawing}
      viewBox="0 0 760 720"
      role="img"
      aria-label="Illustrated connection from Lavasa in the Pune region to Mumbai on India's west coast"
    >
      <defs>
        <pattern
          id="map-grid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M60 0H0V60"
            fill="none"
            stroke="#7997bc"
            strokeOpacity=".12"
          />
        </pattern>
        <linearGradient id="land" x2="1" y2="1">
          <stop stopColor="#172d49" />
          <stop offset="1" stopColor="#091424" />
        </linearGradient>
        <filter id="route-glow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width="760" height="720" fill="url(#map-grid)" />
      <path
        d="M280 0 269 65 285 107 262 148 277 178 266 211 281 234 272 257 290 281 283 306 304 332 300 367 315 395 310 426 333 470 339 512 366 568 373 610 401 674 406 720H760V0Z"
        fill="url(#land)"
        stroke="#6585a7"
        strokeWidth="1.5"
      />
      {[0, 1, 2, 3, 4].map((n) => (
        <path
          key={n}
          d={`M${360 + n * 32} 0 Q${300 + n * 45} 180 ${380 + n * 34} 345 T${440 + n * 30} 720`}
          fill="none"
          stroke="#91aed0"
          strokeOpacity=".09"
        />
      ))}
      <text
        x="73"
        y="430"
        fill="#8195b0"
        fontSize="13"
        letterSpacing="4"
        transform="rotate(-72 73 430)"
      >
        ARABIAN SEA
      </text>
      <text x="450" y="160" fill="#91a8c6" fontSize="12" letterSpacing="5">
        MAHARASHTRA
      </text>
      <path
        data-route
        d="M493 450 Q480 255 294 278"
        pathLength="1"
        strokeDasharray="1"
        fill="none"
        stroke="#78a5ff"
        strokeWidth="9"
        filter="url(#route-glow)"
        opacity=".5"
      />
      <path
        data-route
        d="M493 450 Q480 255 294 278"
        pathLength="1"
        fill="none"
        stroke="#a8c6ff"
        strokeWidth="2"
        strokeDasharray="1"
      />
      <circle cx="493" cy="450" r="6" fill="#efc58a" />
      <circle
        cx="493"
        cy="450"
        r="17"
        fill="none"
        stroke="#efc58a"
        strokeOpacity=".45"
      />
      <circle cx="294" cy="278" r="7" fill="#bfd5ff" />
      <circle
        cx="294"
        cy="278"
        r="24"
        fill="none"
        stroke="#93b9ff"
        strokeOpacity=".5"
      />
      <text x="514" y="451" fill="#fff" fontSize="21">
        Lavasa
      </text>
      <text x="514" y="475" fill="#a4b5cc" fontSize="11" letterSpacing="2">
        PUNE REGION
      </text>
      <text x="272" y="242" textAnchor="end" fill="#fff" fontSize="26">
        Mumbai
      </text>
      <text
        x="272"
        y="264"
        textAnchor="end"
        fill="#afc8ef"
        fontSize="11"
        letterSpacing="2"
      >
        BKC · NEXT CHAPTER
      </text>
      <circle cx="603" cy="443" r="3" fill="#91a8c6" />
      <text x="615" y="448" fill="#91a8c6" fontSize="12">
        Pune
      </text>
      <path d="M697 72V35m-7 10 7-10 7 10" stroke="#afc8ef" fill="none" />
      <text x="691" y="23" fill="#afc8ef" fontSize="11">
        N
      </text>
    </svg>
  );
}

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const motionState = useRef<JourneyMotion>({ progress: 0, x: 0, y: 0 });
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          onUpdate: (self) => {
            motionState.current.progress = self.progress;
          },
        },
      });
      timeline
        .to("[data-earth]", { opacity: 0, scale: 1.12, duration: 0.18 }, 0.28)
        .fromTo(
          "[data-map]",
          { opacity: 0, scale: 0.76 },
          { opacity: 1, scale: 1, duration: 0.24 },
          0.26,
        )
        .fromTo(
          "[data-route]",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.32 },
          0.39,
        )
        .to("[data-map]", { xPercent: -3, scale: 1.08, duration: 0.29 }, 0.71);
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <div
      className={styles.journey}
      ref={root}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        motionState.current.x = (e.clientX - r.left) / r.width - 0.5;
        motionState.current.y = e.clientY / window.innerHeight - 0.5;
        e.currentTarget.style.setProperty(
          "--map-x",
          `${motionState.current.x * 12}px`,
        );
        e.currentTarget.style.setProperty(
          "--map-y",
          `${motionState.current.y * 8}px`,
        );
      }}
      onPointerLeave={(e) => {
        motionState.current.x = 0;
        motionState.current.y = 0;
        e.currentTarget.style.setProperty("--map-x", "0px");
        e.currentTarget.style.setProperty("--map-y", "0px");
      }}
    >
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.sceneGrid} />
        <div className={styles.earth} data-earth>
          <div className={styles.globeFallback} />
          {near && !reduced && <Globe motion={motionState} />}
          <span className={styles.orbitLabel}>
            18.4° N / 73.5° E <i /> WHERE IT BEGAN
          </span>
        </div>
        <div className={styles.regionalMap} data-map>
          <RegionalMap />
          <span className={styles.mapNote}>
            A SYMBOLIC JOURNEY · NOT A NAVIGATION MAP
          </span>
        </div>
        <div className={styles.sceneShade} />
      </div>
      <section
        id="lavasa"
        className={styles.travelChapter}
        aria-labelledby="lavasa-title"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>
            <span>01 / THE ORIGIN</span>
            <span>LAVASA, PUNE</span>
          </p>
          <h2 id="lavasa-title">
            Big ideas.
            <br />
            Quiet <em>beginnings.</em>
          </h2>
          <p className={styles.body}>
            Before the bigger stage, there was a meeting of minds in the hills.
            A campus. A community. A conversation that kept growing.
          </p>
          <figure className={styles.lavasaPhoto}>
            <img
              src="/media/flickr/story-4.jpg"
              alt="Lavasa lake and the surrounding Sahyadri hills"
              width={1024}
              height={576}
              loading="lazy"
            />
            <figcaption>
              ROOTED IN LAVASA <span>CHRIST UNIVERSITY ↗</span>
            </figcaption>
          </figure>
          <a className={styles.textLink} href="#journey">
            Follow the journey <span>↓</span>
          </a>
        </div>
      </section>
      <section
        id="journey"
        className={styles.travelChapter}
        aria-labelledby="journey-title"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>02 / A NEW DIRECTION</p>
          <h2 id="journey-title">
            Ideas travel.
            <br />
            So <em>do we.</em>
          </h2>
          <p className={styles.body}>
            From the Sahyadri hills to the pulse of Mumbai. Taking the spirit of
            Lavasa to a wider world of people, possibilities and perspectives.
          </p>
          <div className={styles.routeLegend}>
            <span>
              LV<span>Lavasa</span>
            </span>
            <i />
            <span>
              BOM<span>Mumbai</span>
            </span>
          </div>
          <p className={styles.small}>
            One shared purpose. A whole new horizon.
          </p>
          <a className={styles.textLink} href="#mumbai">
            Meet our next destination <span>↓</span>
          </a>
        </div>
      </section>
      <section
        id="mumbai"
        className={`${styles.travelChapter} ${styles.arrival}`}
        aria-labelledby="mumbai-title"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>03 / THE NEXT DESTINATION</p>
          <h2 id="mumbai-title">
            Hello,
            <br />
            <em>Mumbai.</em>
          </h2>
          <p className={styles.body}>
            A bigger stage for the people shaping the future of work. HR VISTA
            3.0 arrives at the heart of India’s corporate conversation.
          </p>
          <div className={styles.venue}>
            <span>21—22 NOVEMBER 2026</span>
            <strong>Jio Grounds, BKC</strong>
            <details>
              <summary>
                Explore the setting <span>+</span>
              </summary>
              <p>
                Bandra Kurla Complex connects Mumbai’s business, finance and
                professional communities. The next chapter brings our Lavasa
                roots into this wider ecosystem.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jio+Grounds+Bandra+Kurla+Complex+Mumbai"
                target="_blank"
                rel="noreferrer"
              >
                Open location in Maps ↗
              </a>
            </details>
          </div>
          <a className={styles.textLink} href="#editions">
            See how we got here <span>↓</span>
          </a>
        </div>
      </section>
    </div>
  );
}

const editions = [
  {
    number: "1.0",
    kicker: "FEBRUARY 2025 · LAVASA",
    title: "The first spark.",
    copy: "A meeting of minds in the hills. Around 50 HR delegates came together for conversations, mentorship and a shared vision of work reimagined.",
    image: "/media/flickr/raw/hrvista1_feb21.jpg",
    alt: "HR VISTA 1.0 delegates gathered in the Lavasa amphitheatre",
    caption: "The community takes shape · HR VISTA 1.0",
    href: "/work#hr-vista-1",
    label: "Explore the first edition",
  },
  {
    number: "2.0",
    kicker: "NOVEMBER 2025 · LAVASA",
    title: "The conversation grows.",
    copy: "Leadership in a post-AI world. Four panels, two round tables, and a community finding new connections—on the stage and beyond it.",
    image: "/media/flickr/story-1.jpg",
    alt: "Two speakers in conversation on stage at HR VISTA 2.0",
    caption: "Perspectives in conversation · HR VISTA 2.0",
    href: "/work#hr-vista-2",
    label: "Revisit the second edition",
  },
  {
    number: "3.0",
    kicker: "NOVEMBER 2026 · MUMBAI",
    title: "A wider horizon.",
    copy: "Our most ambitious chapter yet. Two days in Mumbai, with 500+ professionals and representation from 50+ organisations expected. The same purpose, imagined at a new scale.",
    image: "/media/flickr/editions-4.jpg",
    alt: "The HR VISTA 2.0 community whose story continues into the planned third edition",
    caption: "Our community, looking ahead · Photograph from HR VISTA 2.0",
    href: "/brochure",
    label: "Discover the vision for 3.0",
  },
];

export function EditionJourney() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.edition));
        });
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: 0 },
    );
    root.current
      ?.querySelectorAll("[data-edition]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="editions"
      className={styles.editions}
      ref={root}
      aria-labelledby="editions-heading"
    >
      <div className={styles.editionsHeader}>
        <p className={styles.eyebrow}>04 / THE EVOLUTION</p>
        <h2 id="editions-heading">
          Every chapter.
          <br />
          <em>More possibility.</em>
        </h2>
        <p>Built on conversations. Grown through connection.</p>
      </div>
      <nav className={styles.editionNav} aria-label="Edition timeline">
        {editions.map((edition, i) => (
          <a
            key={edition.number}
            href={`#edition-${i + 1}`}
            aria-current={active === i ? "step" : undefined}
          >
            <span>HR VISTA</span>
            <strong>{edition.number}</strong>
            <span>{i === 2 ? "THE NEXT CHAPTER" : "THE STORY SO FAR"}</span>
          </a>
        ))}
      </nav>
      {editions.map((edition, i) => (
        <article
          className={styles.edition}
          id={`edition-${i + 1}`}
          data-edition={i}
          key={edition.number}
        >
          <div className={styles.editionInfo}>
            <p className={styles.eyebrow}>{edition.kicker}</p>
            <span className={styles.editionNumber} aria-hidden="true">
              {edition.number}
            </span>
            <h3>{edition.title}</h3>
            <p className={styles.body}>{edition.copy}</p>
            <a href={edition.href} className={styles.textLink}>
              {edition.label}
              <span>↗</span>
            </a>
          </div>
          <motion.figure
            className={styles.editionPhoto}
            initial={false}
            whileInView={reduced ? {} : { y: 0, rotate: i % 2 ? 2 : -2 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            whileHover={reduced ? {} : { rotate: 0 }}
          >
            <a href={edition.href}>
              <img
                src={edition.image}
                alt={edition.alt}
                width={1600}
                height={900}
                loading="lazy"
              />
              <span className={styles.photoArrow} aria-hidden="true">
                ↗
              </span>
            </a>
            <figcaption>{edition.caption}</figcaption>
          </motion.figure>
        </article>
      ))}
    </section>
  );
}

export function JourneyFinale() {
  return (
    <section id="next" className={styles.finale} aria-labelledby="finale-title">
      <div className={styles.finaleOrbit} aria-hidden="true" />
      <p className={styles.eyebrow}>LAVASA ROOTS. MUMBAI HORIZONS.</p>
      <h2 id="finale-title">
        The future of work.
        <br />
        <em>Closer than ever.</em>
      </h2>
      <p>
        Keynote conversations. Leadership panels. New connections.
        <br />
        Discover what’s ahead at HR VISTA 3.0.
      </p>
      <div className={styles.finaleActions}>
        <a className={styles.button} href={PDF} download>
          Download brochure <span>↓</span>
        </a>
        <a className={styles.textLink} href="/brochure">
          Read online <span>↗</span>
        </a>
      </div>
      <div className={styles.finaleMeta}>
        <span>{content.hero.dates}</span>
        <span>JIO GROUNDS · BKC · MUMBAI</span>
        <span>HR VISTA 3.0</span>
      </div>
    </section>
  );
}
