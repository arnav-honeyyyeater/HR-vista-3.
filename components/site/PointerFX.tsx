"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

/**
 * Tilt — mouse-following 3D card tilt with a specular shine.
 * The reference's cards lean toward the cursor and light up where it sits.
 * Mouse only; reduced-motion and touch get a plain card.
 */
export function Tilt({
  children,
  className = "",
  max = 6,
  lift = 10,
}: {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** TranslateZ lift at the cursor, px. */
  lift?: number;
}) {
  const reduced = useReducedMotionPreference();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const z = useMotionValue(0);
  const smoothRx = useSpring(rx, { stiffness: 180, damping: 18 });
  const smoothRy = useSpring(ry, { stiffness: 180, damping: 18 });
  const smoothZ = useSpring(z, { stiffness: 220, damping: 20 });
  const [shine, setShine] = useState({ x: "50%", y: "50%", on: false });

  return (
    <motion.div
      className={className}
      style={
        reduced
          ? ({ transform: "none", "--shine-on": 0 } as CSSProperties)
          : ({
              rotateX: smoothRx,
              rotateY: smoothRy,
              translateZ: smoothZ,
              transformPerspective: 900,
              "--shine-x": shine.x,
              "--shine-y": shine.y,
              "--shine-on": shine.on ? 1 : 0,
            } as CSSProperties)
      }
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const b = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - b.left) / b.width;
        const py = (event.clientY - b.top) / b.height;
        ry.set((px - 0.5) * 2 * max);
        rx.set(-(py - 0.5) * 2 * max);
        z.set(lift);
        setShine({ x: `${px * 100}%`, y: `${py * 100}%`, on: true });
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        z.set(0);
        setShine((s) => ({ ...s, on: false }));
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * DragStrip — a horizontal gallery the mouse can grab and throw.
 * Native scrolling underneath (touch + wheel work for free); pointer drag
 * maps 1:1 to scrollLeft with no easing tricks that would fight the wheel.
 */
export function DragStrip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  return (
    <div
      ref={ref}
      className={className}
      data-drag-strip
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        const el = ref.current;
        if (!el) return;
        drag.current = {
          active: true,
          startX: event.clientX,
          startLeft: el.scrollLeft,
          moved: false,
        };
        el.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el || !drag.current.active) return;
        const dx = event.clientX - drag.current.startX;
        if (Math.abs(dx) > 3) drag.current.moved = true;
        el.scrollLeft = drag.current.startLeft - dx;
      }}
      onPointerUp={(event) => {
        const el = ref.current;
        drag.current.active = false;
        if (el) el.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        drag.current.active = false;
      }}
      onClickCapture={(event) => {
        // A drag must not fire the click under it.
        if (drag.current.moved) {
          event.preventDefault();
          event.stopPropagation();
          drag.current.moved = false;
        }
      }}
    >
      {children}
    </div>
  );
}
