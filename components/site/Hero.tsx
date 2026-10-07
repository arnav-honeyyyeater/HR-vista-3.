"use client";

import { useEffect, useRef, type CSSProperties } from "react";
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
 *   culling     the near half of the drum is dropped (see `cull` below)
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
 *     drum eases to the nearest framing — the reference does not do this, and
 *     without it its wall can come to rest short of both screen edges.
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
 * WHY THE DRUM RESTS ON A MULTIPLE OF `STEP`
 * A twelve-sided drum only fills the frame at the angles where one of its faces
 * is exactly edge-on — that face is the one that smears out to the screen edge.
 * Half a step off, the outermost face still facing the viewer sits at 75° rather
 * than 90°, projects ~270px short, and the wall retreats from both edges into a
 * centred band on a black field. The reference avoids this by never turning at
 * all; we step between framings and always land on one, so the wall is either
 * full-bleed or visibly mid-turn, and never parked in the flat in-between.
 */
const DWELL_MS = 4600;
/** Quiet period after a drag before the stepping resumes. */
const RESUME_MS = 6000;
/** Longest step the integrator will take, so a stalled tab cannot explode it. */
const MAX_DT = 1 / 30;

/**
 * Net Y-rotation of panel `k` when the drum sits at `drumAngle`, folded into
 * (−180, 180]. A panel is on the viewer's side of the drum — and so is culled —
 * once this passes ±90°.
 */
const netAngle = (k: number, drumAngle: number) =>
  ((((drumAngle - k * STEP) % 360) + 540) % 360) - 180;

const facesViewer = (k: number, drumAngle: number) => {
  const n = netAngle(k, drumAngle);
  // Inclusive: a panel exactly edge-on is kept, because at that angle it is the
  // huge smeared panel at the end of the wall rather than a sliver to discard.
  // The tolerance covers the spring's residue so an edge-on panel cannot flicker
  // in and out while the drum sits at rest (see the snap in `frame`).
  return n >= -90.01 && n <= 90.01;
};

export function Hero() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drumRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const drum = drumRef.current;
    if (!stage || !drum) return;

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

    /**
     * Hide the half of the drum that faces away from the eye.
     *
     * The reference relies on `backface-visibility: hidden` for this, and the
     * math says it should work — a panel whose accumulated Y-rotation is past
     * 90° has its back to the viewer. Blink does not cull these reliably though
     * (a panel whose back is turned is still painted whenever it happens to sit
     * in front of the eye), and that is exactly the case on phones, where the
     * drum's radius is smaller than the perspective distance. Left alone, the
     * near wall sweeps across the screen as giant flat portraits and the band
     * silhouette is destroyed.
     *
     * So the cull is done here, from the angle this component already knows.
     * The bound is INCLUSIVE at ±90°: a panel exactly edge-on is not culled by
     * the reference either, and it is not a bug — it is the enormous smeared
     * panel at each end of the wall, and the wall looks flat without it.
     */
    const cull = () => {
      let next = 0;
      for (let k = 0; k < COUNT; k++) {
        if (facesViewer(k, angle)) next |= 1 << k;
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
    draw();

    // Reduced motion: the opening pose is the whole hero. No stepping, no drag.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.dataset.static = "true";
      return;
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, MAX_DT);
      last = now;
      if (!visible) return;

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

      // Land EXACTLY, don't asymptote. A spring never quite arrives, and at a
      // framing the residue leaves the edge-on panels a hair off ±90° — enough
      // that they can flicker in and out of the cull while the drum is at rest.
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
      // Let go anywhere and the drum eases to the nearest framing rather than
      // resting wherever the hand stopped. This is the one place we improve on
      // the reference: released off-phase, its wall sits short of both edges
      // until the next drag.
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
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* The retro perspective floor. The reference draws this as a 3016×1075
          PNG bleeding 120px past each edge at 32% opacity; ours is the same
          plate. It sits behind the drum so the drum's base cuts into it. */}
      <div className={styles.floor} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/ref/ref-hero-banner.png" alt="" draggable={false} />
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        role="img"
        tabIndex={0}
        aria-label="HR VISTA 3.0 — two editions of the conclave, on a drum. Drag to turn it."
      >
        {/* The 300×420 window the drum is projected through. Its size and the
            radius are set per breakpoint in Hero.module.css. */}
        <div className={styles.viewport}>
          <div ref={drumRef} className={styles.drum} style={{ transform: `rotateY(${START}deg)` }}>
            {PANELS.map((panel, k) => (
              <div
                key={panel.src + k}
                ref={(el) => {
                  panelRefs.current[k] = el;
                }}
                className={styles.panel}
                style={
                  {
                    "--ry": `${-k * STEP}deg`,
                    "--d": `${(k * 0.2).toFixed(2)}s`,
                    // Seat the cull in the server-rendered markup too, so the
                    // near wall never flashes across the screen before hydration.
                    visibility: facesViewer(k, START) ? undefined : "hidden",
                  } as CSSProperties
                }
              >
                <div className={styles.breathe}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={panel.src}
                    alt=""
                    draggable={false}
                    loading={k < 2 ? "eager" : "lazy"}
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
      <div className={styles.copy}>
        <p className={styles.caption}>HR VISTA 3.0 · 21–22 NOV 2026 · BKC, MUMBAI</p>
        <h1 id="hero-title" className={styles.title}>
          The Future of Work.
          <br />
          The People Who Shape It.
        </h1>
      </div>

      <div className={styles.cue} aria-hidden>
        <span>DRAG THE WALL</span>
        <span className={styles["cue-line"]} />
      </div>
    </section>
  );
}
