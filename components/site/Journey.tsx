"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JourneyMotion } from "./JourneyGlobe";
import { content } from "@/lib/data/content";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./Journey.module.css";

const Globe = dynamic(() => import("./JourneyGlobe"), { ssr: false });
const PDF = "/brochure/HR-VISTA-3.0.pdf";

function RegionalMap({ completed = false }: { completed?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={styles.mapDrawing}
      viewBox="0 0 760 720"
      role="img"
      aria-label="Illustrated connection from Lavasa in the Pune region to Mumbai on India's west coast"
    >
      <defs>
        <pattern
          id={`${id}-grid`}
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
        <linearGradient id={`${id}-land`} x2="1" y2="1">
          <stop stopColor="#172d49" />
          <stop offset="1" stopColor="#091424" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <linearGradient id={`${id}-plane`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#a6c5ff" />
        </linearGradient>
      </defs>
      <rect width="760" height="720" fill={`url(#${id}-grid)`} />
      <path
        d="M280 0 269 65 285 107 262 148 277 178 266 211 281 234 272 257 290 281 283 306 304 332 300 367 315 395 310 426 333 470 339 512 366 568 373 610 401 674 406 720H760V0Z"
        fill={`url(#${id}-land)`}
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
        d="M493 450 Q480 255 294 278"
        fill="none"
        stroke="#afc8ef"
        strokeOpacity=".25"
        strokeWidth="1"
        strokeDasharray="3 7"
      />
      <path
        data-route
        d="M493 450 Q480 255 294 278"
        pathLength="1"
        strokeDasharray="1"
        fill="none"
        stroke="#78a5ff"
        strokeWidth="9"
        filter={`url(#${id}-glow)`}
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
        data-arrival-ring
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
      <g data-airplane transform={completed ? "translate(294 278) rotate(-97)" : "translate(493 450) rotate(-4)"}>
        <circle r="24" fill="#a6c5ff" opacity=".05" />
        <circle r="17" fill="none" stroke="#b7d1ff" strokeOpacity=".18" />
        <g className={styles.airplane}>
          <path d="M0-23C-2-23-3-18-3-13V-5L-19 5V9L-3 4V15L-9 20V23L0 20 9 23V20L3 15V4L19 9V5L3-5V-13C3-18 2-23 0-23Z" fill={`url(#${id}-plane)`} stroke="#e4eeff" strokeWidth=".7" />
          <path d="M0-17V16" stroke="#6789bd" strokeWidth="1" opacity=".55" />
          <path d="M-3-11Q0-14 3-11" fill="none" stroke="#355c8c" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}

function MumbaiSetting() {
  return (
    <figure className={styles.cityScene} data-city>
      <img
        className={styles.cityPhoto}
        src="/media/mumbai/marine-drive-blue-hour.webp"
        alt="Mumbai’s Marine Drive waterfront and skyline at blue hour, with golden lights along the bay"
        width={2000}
        height={1334}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.cityTopline}><span>A WIDER HORIZON</span><span>BOM / INDIA</span></div>
      <figcaption className={styles.cityCaption}>
        <div className={styles.cityLocation}><span>MARINE DRIVE · MUMBAI</span><strong>A city in motion.</strong></div>
        <div className={styles.cityCredits}>
          <span>Photo: <a href="https://commons.wikimedia.org/wiki/File:Marine_Lines_Mumbai_2021.jpg" target="_blank" rel="noreferrer">Dr Vikramjit Kakati</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></span>
          <span>Resized, compressed and cropped for display.</span>
        </div>
      </figcaption>
    </figure>
  );
}

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const motionState = useRef<JourneyMotion>({ progress: 0, x: 0, y: 0, visible: true });
  const reduced = useReducedMotionPreference();
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
    motionState.current.progress = 0;
    motionState.current.visible = true;
    const element = root.current;
    if (!element) return;
    const earth = element.querySelector<HTMLElement>("[data-earth]");
    const map = element.querySelector<HTMLElement>("[data-map]");
    const city = element.querySelector<HTMLElement>("[data-city]");
    const arrivalRing = element.querySelector<SVGCircleElement>("[data-map] [data-arrival-ring]");
    if (earth) earth.inert = false;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // One renderer owns all scene visibility. Independent opacity tweens
      // previously restored the map underneath the globe on reverse scroll.
      const scene = { origin: 0, arrival: 0 };
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const blend = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };
      const renderScene = () => {
        const focus = blend((scene.origin - .24) / .6);
        const handoff = blend((scene.origin - .68) / .3);
        const arrival = scene.arrival;
        const earthOpacity = 1 - handoff;
        const mapOpacity = handoff * (1 - blend(arrival / .8));
        motionState.current.progress = focus;
        motionState.current.visible = earthOpacity > .001;
        if (earth) {
          earth.style.opacity = String(earthOpacity);
          earth.style.visibility = earthOpacity < .001 ? "hidden" : "visible";
          earth.style.setProperty("--globe-controls", String(1 - blend(scene.origin / .36)));
          earth.style.setProperty("--earth-zoom", String(1 + focus * 4));
          earth.inert = scene.origin > .24;
          earth.setAttribute("aria-hidden", String(scene.origin > .24));
        }
        if (map) {
          map.style.opacity = String(mapOpacity);
          map.style.visibility = mapOpacity < .001 ? "hidden" : "visible";
          map.style.transform = `scale(${.72 + handoff * .28 + arrival * .12})`;
        }
      };
      renderScene();
      gsap.to(scene, { origin: 1, ease: "none", onUpdate: renderScene,
        scrollTrigger: {
          trigger: "#lavasa", start: "top top", end: "bottom top", scrub: .4,
          onRefresh: self => { scene.origin = self.progress; renderScene(); },
        },
      });
      gsap.to(scene, { arrival: 1, ease: "none", onUpdate: renderScene,
        scrollTrigger: {
          trigger: "#mumbai", start: "top 95%", end: "top 10%", scrub: .5,
          onRefresh: self => { scene.arrival = self.progress; renderScene(); },
        },
      });
      // Mumbai belongs to its own chapter, so its whole frame rises with the
      // document. A smaller inner drift adds depth without pinning the image.
      if (city) {
        gsap.fromTo(city, { y: 64 }, {
          y: -48, ease: "none",
          scrollTrigger: { trigger: "#mumbai", start: "top bottom", end: "bottom top", scrub: .65 },
        });
        const photo = city.querySelector("img");
        if (photo) gsap.fromTo(photo, { yPercent: 5, scale: 1.16 }, {
          yPercent: -5, scale: 1.08, ease: "none",
          scrollTrigger: { trigger: "#mumbai", start: "top bottom", end: "bottom top", scrub: .65 },
        });
      }

      const route = element.querySelector<SVGPathElement>("[data-map] [data-route]");
      const airplane = element.querySelector<SVGGElement>("[data-map] [data-airplane]");
      const routes = element.querySelectorAll<SVGPathElement>("[data-map] [data-route]");
      const rule = element.querySelector<HTMLElement>("[data-flight-rule]");
      const percent = element.querySelector<HTMLElement>("[data-flight-percent]");
      const status = element.querySelector<HTMLElement>("[data-flight-status]");
      const destination = element.querySelector<HTMLElement>("[data-destination]");
      if (route && airplane) {
        const length = route.getTotalLength();
        const flight = { progress: 0 };
        const renderFlight = () => {
          const p = flight.progress;
          const point = route.getPointAtLength(length * p);
          const before = route.getPointAtLength(Math.max(0, length * p - 1));
          const after = route.getPointAtLength(Math.min(length, length * p + 1));
          const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90;
          airplane.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
          routes.forEach(path => { path.style.strokeDashoffset = String(1 - p); });
          if (rule) rule.style.transform = `scaleX(${p})`;
          if (percent) percent.textContent = `${Math.round(p * 100).toString().padStart(2, "0")}%`;
          if (status) status.textContent = p < .02 ? "READY FOR TAKEOFF" : p > .98 ? "A NEW CHAPTER BEGINS" : "IDEAS IN TRANSIT";
          if (destination) destination.dataset.arrived = String(p > .98);
          if (arrivalRing) {
            arrivalRing.setAttribute("r", String(24 + Math.max(0, p - .8) * 70));
            arrivalRing.style.opacity = String(.4 + p * .6);
          }
        };
        renderFlight();
        gsap.to(flight, {
          progress: 1, ease: "none", onUpdate: renderFlight,
          scrollTrigger: {
            trigger: "#journey", start: "top top", end: "bottom bottom", scrub: .55,
            onRefresh: renderFlight,
          },
        });
      }

      root.current?.querySelectorAll<HTMLElement>(`.${styles.travelChapter}`).forEach(chapter => {
        const heading = chapter.querySelector("h2");
        const details = chapter.querySelectorAll(`.${styles.body}, .${styles.routeLegend}, .${styles.venue}, .${styles.flightReadout}`);
        gsap.fromTo(heading, { y: 55, opacity: .2 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 75%", end: "top 25%", scrub: .5 },
        });
        gsap.fromTo(details, { y: 30, opacity: .35 }, {
          y: 0, opacity: 1, duration: .85, stagger: .1, ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 65%", end: "top 20%", scrub: .5 },
        });
        const photograph = chapter.querySelector(`.${styles.lavasaPhoto}`);
        if (photograph) gsap.fromTo(photograph, { y: 35, rotate: -3 }, {
          y: -10, rotate: 0, ease: "none",
          scrollTrigger: { trigger: photograph, start: "top bottom", end: "bottom 25%", scrub: .8 },
        });
      });
    }, root);
    let refreshFrame = 0;
    let disposed = false;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const resize = new ResizeObserver(refresh);
    resize.observe(element);
    void document.fonts.ready.then(() => { if (!disposed) refresh(); });
    return () => {
      disposed = true;
      resize.disconnect();
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
      for (const layer of [earth, map, city]) {
        if (!layer) continue;
        layer.style.removeProperty("opacity");
        layer.style.removeProperty("visibility");
        layer.style.removeProperty("transform");
        layer.inert = false;
      }
      earth?.removeAttribute("aria-hidden");
      earth?.style.removeProperty("--globe-controls");
      earth?.style.removeProperty("--earth-zoom");
      if (city) gsap.set(city.querySelector("img"), { clearProps: "transform" });
      motionState.current.progress = 0;
      motionState.current.visible = true;
      // Staggered fromTo tweens can restore their initial pose on revert.
      // Clear those local reveal styles so a live preference change leaves
      // every paragraph and action fully visible.
      gsap.set(element.querySelectorAll(
        `.${styles.travelChapter} h2, .${styles.travelChapter} .${styles.body}, .${styles.routeLegend}, .${styles.venue}, .${styles.flightReadout}, .${styles.lavasaPhoto}`,
      ), { clearProps: "opacity,transform" });
      element.querySelectorAll<SVGPathElement>("[data-route]").forEach(path => path.style.removeProperty("stroke-dashoffset"));
      element.querySelectorAll<SVGGElement>("[data-airplane]").forEach(plane => plane.setAttribute("transform", "translate(294 278) rotate(-97)"));
      const rule = element.querySelector<HTMLElement>("[data-flight-rule]");
      if (rule) rule.style.transform = "scaleX(1)";
      const percent = element.querySelector<HTMLElement>("[data-flight-percent]");
      if (percent) percent.textContent = "100%";
      const status = element.querySelector<HTMLElement>("[data-flight-status]");
      if (status) status.textContent = "LAVASA → MUMBAI";
      element.querySelector("[data-destination]")?.removeAttribute("data-arrived");
      if (arrivalRing) { arrivalRing.setAttribute("r", "24"); arrivalRing.style.removeProperty("opacity"); }
      if (earth) earth.inert = false;
    };
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
      <div className={styles.scene}>
        <div className={styles.sceneGrid} />
        <div className={styles.earth} data-earth>
          <div className={styles.globeFallback} />
          {near && <Globe motion={motionState} />}
        </div>
        <div className={styles.regionalMap} data-map aria-hidden="true">
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
        className={`${styles.travelChapter} ${styles.flightChapter}`}
        aria-labelledby="journey-title"
      >
        <div className={styles.flightStage}>
          <div className={styles.staticMap}><RegionalMap completed /></div>
          <div className={styles.chapterCopy}>
            <p className={styles.eyebrow}><span className={styles.departureDot} />02 / A NEW DIRECTION</p>
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
              <span data-destination>
                BOM<span>Mumbai</span>
              </span>
            </div>
            <div className={styles.flightReadout} aria-hidden="true">
              <div><span data-flight-status>READY FOR TAKEOFF</span><span data-flight-percent>00%</span></div>
              <div className={styles.flightRule}><i data-flight-rule /></div>
              <p>One shared purpose. A whole new horizon.</p>
            </div>
            <a className={styles.textLink} href="#mumbai">
              Meet our next destination <span>↓</span>
            </a>
          </div>
        </div>
      </section>
      <section
        id="mumbai"
        className={`${styles.travelChapter} ${styles.arrival}`}
        aria-labelledby="mumbai-title"
      >
        <div className={styles.arrivalVisual}><MumbaiSetting /></div>
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
