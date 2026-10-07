"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * MediaTile — reusable media tile (OVERHAUL-PLAN §3 "hover = media scale 1.05,
 * 0.35s snappy"; DESIGN_SPEC §2 S8 work-card media).
 *
 * Geometry: rounded-2xl, overflow-hidden, hairline mist-200/10 border,
 * CSS aspect-ratio (default 16/9). Renders an <img object-cover> or,
 * when `video` is supplied, a <video muted playsInline loop poster>
 * with the same geometry (the after-movie slot — DESIGN_SPEC §2 S7).
 *
 * The root carries `group`, so consumers' `group-hover` and the tile's
 * own hover zoom both work; hover zoom is disabled under
 * prefers-reduced-motion (recipe #11). The zoom lives on an inner wrapper so
 * images AND videos both scale.
 *
 * `entrance` (optional, default false) adds the plan §3 scroll-in polish:
 * scale 0.94 → 1 + blur(4px) → 0 over 0.8s expo-out, once.
 */

/** Expo-out entrance ease. */
const ENTRANCE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface MediaTileProps {
  /** Image source (local path, e.g. /media/raw/...). */
  src: string;
  alt: string;
  /** CSS aspect ratio. Default "16/9". */
  aspect?: string;
  className?: string;
  /** Hover zoom (scale 1.05, 0.35s expo). Default true. */
  hoverScale?: boolean;
  /** Optional video source — renders a muted looping video instead. */
  video?: string;
  /** Poster frame for the video. */
  poster?: string;
  /** Scroll-in entrance polish. Default false (opt-in). */
  entrance?: boolean;
}

export function MediaTile({
  src,
  alt,
  aspect = "16/9",
  className = "",
  hoverScale = true,
  video,
  poster,
  entrance = false,
}: MediaTileProps) {
  const reduceMotion = useReducedMotion();
  const zoom = hoverScale && !reduceMotion;
  const reveal = entrance && !reduceMotion;

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--mist-200)_10%,transparent)] ${className}`}
      // Aspect ratio only when the tile sizes itself; a
      // consumer passing h-full wants the parent's height.
      style={aspect ? { aspectRatio: aspect } : undefined}
      initial={reveal ? { opacity: 0, scale: 0.94, filter: "blur(4px)" } : false}
      whileInView={
        reveal ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined
      }
      viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
      transition={{ duration: 0.8, ease: ENTRANCE_EASE }}
    >
      {/* Inner wrapper carries the hover zoom so img and video both scale. */}
      <div
        className={`h-full w-full ${
          zoom
            ? "transition-transform duration-[0.35s] ease-[var(--ease-expo)] group-hover:scale-[1.05]"
            : ""
        }`}
      >
        {video ? (
          <video
            src={video}
            poster={poster}
            muted
            playsInline
            loop
            autoPlay={!reduceMotion}
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
}
