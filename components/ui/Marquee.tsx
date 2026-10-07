"use client";

import type { CSSProperties, ReactNode } from "react";
import { useVelocitySkew, MAX_VELOCITY_SKEW } from "./ScrollVelocity";

/**
 * Infinite horizontal marquee — DESIGN_SPEC §3 recipe book #5, rebuilt for
 * OVERHAUL-PLAN §3:
 *
 *   translateX(0 → -50%), linear infinite, 30–40s loops (default 34s),
 *   pause on hover, NO opacity/flicker animation anywhere.
 *   Content is duplicated for a seamless loop; the duplicate is aria-hidden.
 *   Keyframes `marquee-x` / `marquee-x-rev` live in app/globals.css, and
 *   prefers-reduced-motion kills them there (static final state).
 *
 * Optional `velocitySkew` leans the whole strip with scroll velocity
 * (≤ `maxSkew` deg) and settles flat — for the PastEditions / statement
 * marquees. The skew lives on its own wrapper, so the -50% keyframe on the
 * track is never overridden.
 *
 * Usage:
 *   <Marquee items={[...]} speed={34} reverse />
 *   <Marquee items={[...]} speed={36} velocitySkew />
 */

export interface MarqueeProps {
  /** Items to scroll — strings or React nodes. */
  items: ReactNode[] | string[];
  /** Loop duration in seconds (plan: 30–40s). Default 34. */
  speed?: number;
  /** Reverse scroll direction (marquee-x-rev keyframes). */
  reverse?: boolean;
  /** Pause the loop while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Lean the strip with scroll velocity. Default false. */
  velocitySkew?: boolean;
  /** Max skew in degrees when `velocitySkew` is on. Default 6. */
  maxSkew?: number;
  /**
   * Horizontal padding on each item. A repeated phrase with no gap between
   * copies reads as one broken string, so any marquee whose content is a
   * doubled phrase (the reference's card titles) needs a visible space.
   */
  itemPadding?: string;
  className?: string;
}

export function Marquee({
  items,
  speed = 34,
  reverse = false,
  pauseOnHover = true,
  velocitySkew = false,
  maxSkew = MAX_VELOCITY_SKEW,
  itemPadding,
  className = "",
}: MarqueeProps) {
  const direction = reverse ? "marquee-x-rev" : "marquee-x";
  // Hook always runs (rules of hooks); it stays at 0 unless skew is enabled.
  const skewX = useVelocitySkew(maxSkew, velocitySkew);

  const pad = itemPadding ? { paddingInline: itemPadding } : undefined;

  const renderSet = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <div
          key={`${hidden ? "dup" : "orig"}-${i}`}
          className="flex shrink-0 items-center"
          style={pad}
        >
          {typeof item === "string" ? <span>{item}</span> : item}
        </div>
      ))}
    </div>
  );

  const track = (
    <div className={`flex w-max ${direction}`}>
      {renderSet(false)}
      {renderSet(true)}
    </div>
  );

  return (
    <div
      className={`${pauseOnHover ? "marquee-hover-pause" : ""} overflow-hidden ${className}`}
      style={{ "--marquee-duration": `${speed}s` } as CSSProperties}
    >
      {velocitySkew ? (
        <div style={{ skewX, willChange: "transform" } as CSSProperties}>
          {track}
        </div>
      ) : (
        track
      )}
    </div>
  );
}
