"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

/**
 * HERO — opraah.in's carousel, ported 1:1.
 * ========================================
 * The reference's hero is not a row of tiles scaled by angle — it is a real
 * twelve-sided drum seen from INSIDE, and every number below was read off the
 * live site (DOM geometry + the carousel component's own source, both captured
 * in _shots/). Reproducing the numbers is what reproduces the look:
 *
 *   container   300 × 420 px, centred in the hero, `perspective: 500px`
 *   panels      12, one every 360/12 = 30°
 *   radius      570 px — each panel sits `translateZ(−570px)` from the drum's
 *               axis with `transform-origin: 50% 50% 570px`
 *   facing      `rotateY(−k·30°)` per panel, the whole drum pre-turned 180°
 *   culling     panels outside the projected view are dropped (see `cull` below)
 *
 * WHY IT LOOKS LIKE THAT
 *   Perspective 500 against radius 570 puts the viewer's eye essentially ON the
 *   drum's axis. The panel opposite the eye is therefore 500+570 = 1070px away
 *   and drawn at 500/1070 = 0.47× — the small panel in the middle. The panels
 *   level with the eye sit at depth 500 and draw at 1.0×, and the ones at ±90°
 *   are seen almost exactly edge-on while sitting very close, which is why they
 *   smear into the huge panels filling each end of the wall. That is the whole
 *   effect: a 300px box on the page, projected into a wall that spans the
 *   viewport and bows at both rims.
 *
 * MOTION
 *   · Drag: `angle = angleAtGrab − dx · 0.5`, exactly the reference's ratio, fed
 *     through the same overdamped spring (stiffness 100, damping 30) so the wall
 *     lags the hand slightly and settles without wobble. Released off-phase, the
 *     drum eases to the nearest framing for a consistent resting composition.
 *   · Idle: one framing every `DWELL_MS`, on the same spring. The reference is
 *     inert unless dragged and leans on its panels being video for life; ours are
 *     stills, so the drum steps — but only between framings, never resting
 *     between two (see DWELL_MS for why that matters).
 *   · Each panel also breathes `translateY 0 → −15px → 0` over 3s, staggered
 *     0.2s per panel, straight from the reference component, and carries a slow
 *     push-in so a still photograph reads a little like a locked-off shot.
 *
 * SAFETY
 *   `prefers-reduced-motion` gets the drum frozen at its opening angle, which is
 *   already the reference's own resting composition: no stepping, no drag, no
 *   breathing, no push-in. The stage stays focusable and ←/→ step it a framing at
 *   a time, through the same spring the drag uses.
 */

/**
 * The drum's media — HR VISTA's own photography, in the order it wraps the drum.
 *
 * Two rules govern the running order, because neighbours on the drum are
 * neighbours on screen and the drum never stops turning:
 *
 *   1. No panel may be carried by TEXT. The crop is a hard 5:7 portrait, so a
 *      banner, a standee or a sponsor board gets sliced mid-word the moment the
 *      drum turns — which reads as a broken layout, not a photo. Faces and
 *      action survive any crop; signage does not.
 *   2. Landscape and portrait sources alternate, and the warm frames are spaced
 *      out, so the wall never presents two similar panels side by side.
 *
 * `pos` is the crop's focus, chosen per photo to keep heads and eyelines inside
 * the panel as it sweeps around the drum.
 */
const PANELS = [
  { src: "/media/flickr/hero-1.jpg", pos: "50% 32%" },
  { src: "/media/raw/speaker_sujeet_patil.jpg", pos: "50% 24%" },
  { src: "/media/flickr/statement-1.jpg", pos: "50% 30%" },
  { src: "/media/flickr/raw/hrvista20_nov11.jpg", pos: "50% 32%" },
  { src: "/media/flickr/raw/flickr_55562132467.jpg", pos: "50% 28%" },
  { src: "/media/flickr/editions-4.jpg", pos: "50% 34%" },
  { src: "/media/flickr/room-3.jpg", pos: "50% 34%" },
  { src: "/media/flickr/raw/flickr_27876789.jpg", pos: "50% 30%" },
  { src: "/media/flickr/raw/flickr_55319877059.jpg", pos: "50% 26%" },
  { src: "/media/flickr/editions-1.jpg", pos: "50% 36%" },
  { src: "/media/flickr/raw/hrvista20_nov91.jpg", pos: "50% 32%" },
  { src: "/media/flickr/raw/hrvista20_nov01.jpg", pos: "50% 36%" },
] as const;

const COUNT = PANELS.length;
/** Angular width of one panel around the drum. 12 panels → 30°. */
const STEP = 360 / COUNT;

/* --------------------------------------------------------------- physics -- */
/** Opening angle of the drum — the reference's `rotateY(180deg)`. */
const START = 180;
/** Degrees of drum rotation per pixel of drag. The reference's 0.5. */
const SENSITIVITY = 0.5;
/** Spring constants — the reference's `{ stiffness: 100, damping: 30 }`, mass 1. */
const SPRING_K = 100;
const SPRING_C = 30;
/**
 * Hold on one framing before stepping to the next, and the drum's rest phase.
 *
 * Rest on a multiple of `STEP` so a photograph is centred after each turn.
 */
const DWELL_MS = 4600;
/** Quiet period after a drag before the stepping resumes. */
const RESUME_MS = 6000;
/** Longest step the integrator will take, so a stalled tab cannot explode it. */
const MAX_DT = 1 / 30;

/**
 * Net Y-rotation of panel `k`, folded into [−180, 180).
 */
const netAngle = (k: number, drumAngle: number) =>
  ((((drumAngle - k * STEP) % 360) + 540) % 360) - 180;

const inOpeningArc = (k: number) => {
  const n = netAngle(k, START);
  // Conservative server-rendered pose, before the responsive geometry is known.
  return n >= -90.01 && n <= 90.01;
};

export function Hero() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drumRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = stageRef.current?.closest<HTMLElement>("[data-hero]");
      if (!hero) return;
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: hero, start: "top top", end: "bottom top", scrub: .6,
      } });
      timeline.to(stageRef.current, { yPercent: 18, scale: .94, opacity: .25, ease: "none" }, 0)
        .to(hero.querySelector("[data-hero-copy]"), { y: 70, opacity: .15, ease: "none" }, 0)
        .to(hero.querySelector("[data-hero-floor]"), { yPercent: -10, opacity: .08, ease: "none" }, 0);
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const drum = drumRef.current;
    const viewport = drum?.parentElement;
    if (!stage || !drum || !viewport) return;

    let angle = START; // rendered angle
    let target = START; // spring's target
    let vel = 0; // deg/s
    let raf = 0;
    let last = 0;
    let visible = true;
    let hover = false;
    let dragging = false;
    let startX = 0;
    let startAngle = 0;
    let resumeAt = 0;
    let culledMask = -1;
    let radius = 0;
    let perspective = 0;
    let halfPanel = 0;
    let halfView = 0;

    /**
     * Cull in perspective space. At ±90° an outer panel still covers the screen:
     * hiding it by angle makes the wall blink during each drag or idle step.
     * Keep it until both horizontal corners lie outside the same view plane.
     * Testing before perspective division also handles corners behind the eye.
     */
    const cull = () => {
      let next = 0;
      for (let k = 0; k < COUNT; k++) {
        const radians = netAngle(k, angle) * Math.PI / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        // The eye is displaced from the drum axis by the perspective distance.
        if (radius + perspective * cos <= 0) continue;
        const x = -radius * sin;
        const depth = perspective + radius * cos;
        const leftX = x - halfPanel * cos;
        const rightX = x + halfPanel * cos;
        const leftDepth = depth - halfPanel * sin;
        const rightDepth = depth + halfPanel * sin;
        if (leftDepth <= 0 && rightDepth <= 0) continue;
        if (perspective * leftX < -halfView * leftDepth &&
            perspective * rightX < -halfView * rightDepth) continue;
        if (perspective * leftX > halfView * leftDepth &&
            perspective * rightX > halfView * rightDepth) continue;
        next |= 1 << k;
      }
      if (next === culledMask) return;
      culledMask = next;
      for (let k = 0; k < COUNT; k++) {
        const el = panelRefs.current[k];
        if (el) el.style.visibility = next & (1 << k) ? "" : "hidden";
      }
    };

    const draw = () => {
      drum.style.transform = `rotateY(${angle.toFixed(3)}deg)`;
      cull();
    };
    const resize = () => {
      const geometry = getComputedStyle(viewport);
      radius = parseFloat(geometry.getPropertyValue("--radius"));
      perspective = parseFloat(geometry.perspective);
      halfPanel = viewport.clientWidth / 2;
      // A small overscan keeps rounding at the clip edge from toggling panels.
      halfView = stage.clientWidth / 2 + 2;
      draw();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    const updatePreference = () => {
      reduced = preference.matches;
      stage.dataset.static = String(reduced);
      if (reduced) {
        dragging = false;
        vel = 0;
        target = Math.round(target / STEP) * STEP;
        angle = target;
        stage.classList.remove(styles["is-dragging"]!);
        draw();
      }
      resumeAt = performance.now() + DWELL_MS;
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, MAX_DT);
      last = now;
      if (!visible || reduced) return;
      const intro = document.documentElement.dataset.intro;
      if (intro === "loading" || intro === "opening") {
        resumeAt = now + DWELL_MS;
        return;
      }

      // Advance one framing at a time. `target` only ever holds multiples of
      // STEP, so the drum is never parked between two framings. The first
      // frame only arms the timer — the opening pose gets a full dwell.
      if (resumeAt === 0) {
        resumeAt = now + DWELL_MS;
      } else if (!dragging && !hover && now >= resumeAt) {
        target -= STEP;
        resumeAt = now + DWELL_MS;
      }

      // Overdamped spring (ζ = 1.5) — the reference's useSpring(100, 30).
      vel += (-SPRING_K * (angle - target) - SPRING_C * vel) * dt;
      angle += vel * dt;

      // Land exactly rather than leaving the spring to drift around its target.
      if (Math.abs(angle - target) < 0.002 && Math.abs(vel) < 0.002) {
        angle = target;
        vel = 0;
      }
      draw();
    };

    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; }, { threshold: 0 });
    io.observe(drum);

    const onEnter = () => { hover = true; };
    const onLeave = () => { hover = false; };

    const onDown = (e: PointerEvent) => {
      if (reduced || !e.isPrimary) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startAngle = target;
      stage.classList.add(styles["is-dragging"]!);
      try {
        stage.setPointerCapture?.(e.pointerId);
      } catch {
        /* a second finger, or a pointer the browser has already released */
      }
      e.preventDefault();
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      // Written straight to the spring's target in the handler, never gated on
      // rAF: a throttled tab must still track the hand.
      target = startAngle - (e.clientX - startX) * SENSITIVITY;
    };

    const onUp = (e?: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove(styles["is-dragging"]!);
      // Let go anywhere and the drum eases to the nearest centred photograph.
      target = Math.round(target / STEP) * STEP;
      resumeAt = performance.now() + RESUME_MS;
      try {
        if (e?.pointerId !== undefined) stage.releasePointerCapture?.(e.pointerId);
      } catch {
        /* already released */
      }
      hover = stage.matches(":hover");
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      // Nudge the TARGET, so the arrow keys ride the same spring as the drag
      // instead of snapping the drum to a fixed angle.
      target += e.key === "ArrowRight" ? -STEP : STEP;
      if (reduced) { angle = target; draw(); }
      resumeAt = performance.now() + RESUME_MS;
    };

    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("keydown", onKey);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      resizeObserver.disconnect();
      preference.removeEventListener("change", updatePreference);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("keydown", onKey);
      stage.classList.remove(styles["is-dragging"]!);
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-hero>
      {/* The retro perspective floor. The reference draws this as a 3016×1075
          PNG bleeding 120px past each edge at 32% opacity; ours is the same
          plate. It sits behind the drum so the drum's base cuts into it. */}
      <div className={styles.floor} aria-hidden data-hero-floor>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/ref/ref-hero-banner.png" alt="" draggable={false} />
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        data-hero-drag
        role="group"
        tabIndex={0}
        aria-label="HR VISTA 3.0 — two editions of the conclave, on a drum. Drag to turn it."
      >
        {/* The 300×420 window the drum is projected through. Its size and the
            radius are set per breakpoint in Hero.module.css. */}
        <div className={styles.viewport} data-wall-enter>
          <div ref={drumRef} className={styles.drum} style={{ transform: `rotateY(${START}deg)` }}>
            {PANELS.map((panel, k) => (
              <div
                key={panel.src + k}
                ref={(el) => {
                  panelRefs.current[k] = el;
                }}
                className={styles.panel}
                data-hero-panel
                style={
                  {
                    "--ry": `${-k * STEP}deg`,
                    "--d": `${(k * 0.2).toFixed(2)}s`,
                    // Seat the cull in the server-rendered markup too, so the
                    // near wall never flashes across the screen before hydration.
                    visibility: inOpeningArc(k) ? undefined : "hidden",
                  } as CSSProperties
                }
              >
                <div className={styles.breathe}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={panel.src}
                    alt=""
                    draggable={false}
                    // Every panel can enter the view during the first drag.
                    loading="eager"
                    fetchPriority={k === 6 ? "high" : "auto"}
                    width={300}
                    height={420}
                    decoding="async"
                    style={{ objectPosition: panel.pos }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copy — the reference's eyebrow over a two-line display headline. */}
      <div className={styles.copy} data-hero-copy>
        <p className={styles.caption}>HR VISTA 3.0 · 21–22 NOV 2026 · BKC, MUMBAI</p>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.titleLine}><span>The Future of Work.</span></span>
          <br />
          <span className={styles.titleLine}><span>The People Who Shape It.</span></span>
        </h1>
      </div>

      <div className={styles.cue} aria-hidden>
        <span>DRAG THE WALL</span>
        <span className={styles["cue-line"]} />
      </div>
      <a href="#lavasa" className={styles.storyLink}>Explore the journey <span aria-hidden="true">↓</span></a>
    </section>
  );
}
