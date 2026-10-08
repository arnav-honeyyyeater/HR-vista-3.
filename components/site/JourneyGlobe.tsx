"use client";

import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import * as THREE from "three";
import styles from "./GlobeControls.module.css";

export type JourneyMotion = { progress: number; x: number; y: number };
type Geography = {
  features: {
    geometry: { type: string; coordinates: number[][][] | number[][][][] };
  }[];
};

/** Spin the earth normally; quick direction changes reveal a temporary Easter egg. */
export default function JourneyGlobe({
  motion,
}: {
  motion: MutableRefObject<JourneyMotion>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const spin = useRef({ angle: 0, target: 0, velocity: 0, dragging: false, x: 0, time: 0,
    direction: 0, leg: 0, turns: 0, travel: 0, shakeAt: 0 });
  const [discovery, setDiscovery] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  const reducedRef = useRef(false);
  const revealAt = useRef(-10000);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reset = () => {
    spin.current.velocity = 0;
    spin.current.target = Math.round(spin.current.angle / (Math.PI * 2)) * Math.PI * 2;
    if (reducedRef.current) spin.current.angle = spin.current.target;
  };
  const discover = () => {
    const now = performance.now();
    if (now - revealAt.current < 4000) return;
    revealAt.current = now;
    spin.current.velocity = 0;
    spin.current.turns = 0;
    setDiscovery(value => value + 1);
    setRevealing(true);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => setRevealing(false), reducedRef.current ? 5000 : 3800);
  };

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedRef.current = preference.matches; };
    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    let disposed = false;
    let visible = false;
    let contextLost = false;
    const abort = new AbortController();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    const globe = new THREE.Group();
    scene.add(globe);
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 48);
    const surface = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const earth = new THREE.Mesh(sphereGeometry, surface);
    globe.add(earth);
    const gridGeometry = new THREE.SphereGeometry(1.003, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x769bda,
      wireframe: true,
      transparent: true,
      opacity: 0.065,
    });
    globe.add(new THREE.Mesh(gridGeometry, gridMaterial));
    const rimGeometry = new THREE.SphereGeometry(1.045, 64, 32);
    const rimMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader:
        "varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }",
      fragmentShader:
        "varying vec3 n; varying vec3 v; void main(){float a=pow(1.0-abs(dot(n,v)),3.0);gl_FragColor=vec4(0.24,0.48,1.0,a*0.65);}",
    });
    globe.add(new THREE.Mesh(rimGeometry, rimMaterial));
    const point = (lat: number, lon: number, radius = 1) => {
      const phi = THREE.MathUtils.degToRad(90 - lat),
        theta = THREE.MathUtils.degToRad(lon + 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    };
    const markerGeometry = new THREE.SphereGeometry(0.012, 12, 8);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xf4c980 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(point(18.4, 73.5, 1.015));
    globe.add(marker);
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    let texture: THREE.CanvasTexture | undefined;
    if (ctx) {
      ctx.fillStyle = "#06142b";
      ctx.fillRect(0, 0, 2048, 1024);
      texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      surface.map = texture;
      fetch("/media/journey/world.geojson", { signal: abort.signal })
        .then((r) => {
          if (!r.ok) throw new Error("Geography unavailable");
          return r.json();
        })
        .then((data: Geography) => {
          if (disposed) return;
          ctx.fillStyle = "#254c77";
          ctx.strokeStyle = "#6488ad";
          ctx.lineWidth = 0.7;
          data.features.forEach((feature) => {
            const polygons =
              feature.geometry.type === "Polygon"
                ? [feature.geometry.coordinates as number[][][]]
                : (feature.geometry.coordinates as number[][][][]);
            polygons.forEach((polygon) => {
              ctx.beginPath();
              polygon.forEach((ring) =>
                ring.forEach(([lon, lat], i) => {
                  const x = ((lon + 180) / 360) * 2048,
                    y = ((90 - lat) / 180) * 1024;
                  if (!i) ctx.moveTo(x, y);
                  else ctx.lineTo(x, y);
                }),
              );
              ctx.closePath();
              ctx.fill("evenodd");
              ctx.stroke();
            });
          });
          if (texture) texture.needsUpdate = true;
        })
        .catch(() => {
          /* Grid globe remains usable without geography. */
        });
    }
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75),
    );
    element.appendChild(renderer.domElement);
    const resize = () => {
      const w = element.clientWidth,
        h = element.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const onLoss = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      renderer.setAnimationLoop(null);
      element.dataset.failed = "true";
    };
    const onRestore = () => { contextLost = false; element.dataset.failed = "false"; updateLoop(); };
    renderer.domElement.addEventListener("webglcontextlost", onLoss);
    renderer.domElement.addEventListener("webglcontextrestored", onRestore);
    let lastTime = 0;
    const render = (time: number) => {
      if (!visible || document.hidden || disposed || contextLost) return;
      const p = motion.current.progress;
      if (shell.current) shell.current.inert = !reducedRef.current && p > 0.27;
      if (p > 0.5 && !reducedRef.current) return;
      const dt = Math.min((time - lastTime) / 16.67 || 1, 3);
      lastTime = time;
      const state = spin.current;
      if (!state.dragging && !pauseRef.current) {
        state.target += state.velocity * dt;
        state.velocity *= Math.pow(0.94, dt);
      }
      state.angle += (state.target - state.angle) * (reducedRef.current ? 1 : 1 - Math.pow(0.86, dt));
      globe.rotation.y = state.angle;
      const elapsed = time - revealAt.current;
      globe.rotation.z = reducedRef.current ? 0 : Math.sin(elapsed / 43) * Math.exp(-elapsed / 220) * .055;
      const zoom = THREE.MathUtils.smoothstep(p, 0.06, 0.43);
      // Fit the whole sphere before zooming, including tall tablet canvases.
      const horizontalHalfFov = Math.atan(
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect,
      );
      const distance = Math.max(3.55, 1.05 / Math.sin(horizontalHalfFov));
      camera.position.copy(
        point(
          23 - zoom * 4 + motion.current.y * 2,
          54 + zoom * 20 + motion.current.x * 3,
          distance * (1 - zoom * 0.32),
        ),
      );
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      globe.updateMatrixWorld();
      renderer.render(scene, camera);
    };
    const updateLoop = () =>
      renderer.setAnimationLoop(visible && !document.hidden && !contextLost ? render : null);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateLoop();
    });
    intersection.observe(element);
    document.addEventListener("visibilitychange", updateLoop);
    return () => {
      disposed = true;
      abort.abort();
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", updateLoop);
      renderer.domElement.removeEventListener("webglcontextlost", onLoss);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestore);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      renderer.domElement.remove();
      [
        sphereGeometry,
        gridGeometry,
        rimGeometry,
        markerGeometry,
        surface,
        gridMaterial,
        rimMaterial,
        markerMaterial,
      ].forEach((resource) => resource.dispose());
      texture?.dispose();
    };
  }, [motion]);
  return (
    <div ref={shell} className={styles.shell} data-globe-interactive data-discovering={revealing}>
      <div className={styles.dragSurface} tabIndex={0} role="group" aria-label="Interactive earth. Drag or use arrow keys to spin. Shake back and forth to find a surprise, or press Space. Home resets the globe."
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", " ", "Enter"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === " " || event.key === "Enter") { discover(); return; }
          spin.current.velocity = 0;
          if (event.key === "Home") reset();
          else spin.current.target += event.key === "ArrowRight" ? Math.PI / 6 : -Math.PI / 6;
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          spin.current.dragging = true; spin.current.x = event.clientX; spin.current.time = event.timeStamp; spin.current.velocity = 0;
          spin.current.direction = 0; spin.current.leg = 0; spin.current.turns = 0; spin.current.travel = 0; spin.current.shakeAt = event.timeStamp;
        }}
        onPointerMove={(event) => {
          const state = spin.current;
          if (!state.dragging) return;
          const dx = event.clientX - state.x;
          const delta = dx * .009;
          const elapsed = Math.max(event.timeStamp - state.time, 8);
          if (event.timeStamp - state.shakeAt > 1100) {
            state.turns = 0; state.travel = 0; state.leg = 0; state.direction = 0; state.shakeAt = event.timeStamp;
          }
          if (Math.abs(dx) > 1) {
            const direction = Math.sign(dx);
            if (state.direction && direction !== state.direction) {
              if (state.leg >= 22) state.turns++;
              state.leg = 0;
            }
            state.direction = direction;
            state.leg += Math.abs(dx);
            state.travel += Math.abs(dx);
            if (state.turns >= 3 && state.travel >= 140) discover();
          }
          state.target += delta;
          state.velocity = reducedRef.current || pauseRef.current ? 0 : THREE.MathUtils.clamp(delta * 16.67 / elapsed, -.12, .12);
          state.x = event.clientX; state.time = event.timeStamp;
        }}
        onPointerUp={(event) => {
          spin.current.dragging = false;
          if (event.timeStamp - spin.current.time > 100) spin.current.velocity = 0;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { spin.current.dragging = false; spin.current.velocity = 0; }}
        onLostPointerCapture={() => { spin.current.dragging = false; }}>
        <div ref={host} className="journey-globe" aria-hidden="true" />
        {revealing && <div key={discovery} className={styles.discovery} aria-hidden="true" data-globe-egg>
          <div className={styles.shockwave} />
          {["HR VISTA", "CHRIST"].map((name, i) => <div key={name} className={styles.eggBadge} data-brand={name} style={{ "--brand": i, "--tilt": i ? "7deg" : "-9deg", "--drift": i ? "1" : "-1" } as CSSProperties}>
            <div className={styles.eggBacking} />
            <div className={styles.logo}>
              {Array.from({ length: 12 }, (_, slice) => <span key={slice} className={styles.logoSlice} style={{ "--slice": slice, clipPath: `inset(${slice * 100 / 12}% 0 ${100 - (slice + 1) * 100 / 12}% 0)` } as CSSProperties}>
                <img src={i === 0 ? "/media/raw/logo_hr_vista.png" : "/media/raw/logo_christ_lavasa.png"} alt="" width={220} height={120} draggable={false} />
              </span>)}
            </div>
            <span className={styles.eggLabel}>{i === 0 ? "A WORLD OF POSSIBILITIES" : "WHERE OUR STORY BEGINS"}</span>
            {Array.from({ length: 6 }, (_, particle) => <i key={particle} className={styles.spark} style={{ "--particle": particle } as CSSProperties} />)}
          </div>)}
          <span className={styles.found}>TWO IDENTITIES. ONE WORLD. <i>✳</i></span>
        </div>}
      </div>
      <div className={styles.controls}>
        <p>DRAG TO EXPLORE <span>·</span> A LITTLE SHAKE. A LITTLE SURPRISE.</p>
        <div className={styles.buttons}>
          <button type="button" onClick={discover} aria-label="Shake the globe to reveal the Easter egg">Give it a shake <span>↔</span></button>
          <button type="button" onClick={reset} aria-label="Reset globe rotation">Reset <span>↺</span></button>
          <button type="button" aria-pressed={paused} aria-label={paused ? "Enable globe momentum" : "Pause globe momentum"} onClick={() => { pauseRef.current = !paused; spin.current.velocity = 0; setPaused(!paused); }}>{paused ? "▶" : "Ⅱ"}</button>
        </div>
        <span className={styles.srOnly} role="status">{revealing ? "You found the Easter egg: HR VISTA and CHRIST University. Two identities, one world." : discovery ? "Easter egg discovered. Shake the globe to see it again." : ""}</span>
      </div>
    </div>
  );
}
