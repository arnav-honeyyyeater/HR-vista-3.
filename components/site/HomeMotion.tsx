"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "framer-motion";

export function SignalField({ children, className, strength = 32 }: { children: ReactNode; className?: string; strength?: number }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 95, damping: 24 });
  const smoothY = useSpring(y, { stiffness: 95, damping: 24 });
  const offsetX = useTransform(smoothX, value => `${value * strength}px`);
  const offsetY = useTransform(smoothY, value => `${value * strength}px`);
  return <motion.div className={className} style={reduced ? undefined : { "--signal-x": offsetX, "--signal-y": offsetY } as MotionStyle} onPointerMove={event => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - .5);
    y.set((event.clientY - bounds.top) / bounds.height - .5);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}

export function ScrollDrift({ children, className, distance = 24 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <motion.div ref={ref} className={className} style={reduced ? undefined : { y }}>{children}</motion.div>;
}

export function MagneticLink({ children, className, href, label }: { children: ReactNode; className?: string; href: string; label?: string }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 220, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 20 });
  return <motion.a href={href} aria-label={label} className={className} style={reduced ? undefined : { x: smoothX, y: smoothY }} onPointerMove={event => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * .12);
    y.set((event.clientY - bounds.top - bounds.height / 2) * .12);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} onBlur={() => { x.set(0); y.set(0); }}>{children}</motion.a>;
}
