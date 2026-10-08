"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

export type JourneyMotion = { progress: number; x: number; y: number };
type Geography = {
  features: {
    geometry: { type: string; coordinates: number[][][] | number[][][][] };
  }[];
};

/** Decorative renderer only: all geographic labels and story content live in HTML. */
export default function JourneyGlobe({
  motion,
}: {
  motion: MutableRefObject<JourneyMotion>;
}) {
  const host = useRef<HTMLDivElement>(null);
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
    renderer.domElement.addEventListener("webglcontextlost", onLoss);
    const render = () => {
      if (!visible || document.hidden || disposed || contextLost) return;
      const p = motion.current.progress;
      if (p > 0.5) return; // The regional map has replaced the globe; stop GPU work.
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
  return <div ref={host} className="journey-globe" aria-hidden="true" />;
}
