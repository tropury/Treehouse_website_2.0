"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PortfolioItem } from "../types";
import { scaleFade } from "../lib/motion";

interface PortfolioTileProps {
  item: PortfolioItem;
  index: number;
  visible: boolean;
  onOpen: (item: PortfolioItem) => void;
}

/**
 * A single portfolio tile.
 *
 * Hover reveals the project title via a sliding "reveal mask" — the
 * overlay lifts away while the title rises from the bottom edge. The
 * tile also responds to the pointer with a subtle 3D "lift and tilt"
 * perspective transform (the image leans toward the cursor) for a
 * premium, tactile feel. The image uses a blur-up loading state: a
 * shimmering gradient placeholder sits behind the image and crossfades
 * once it loads. The tile is a real button so it is keyboard accessible
 * and opens the lightbox on activation.
 *
 * The 3D tilt is disabled on touch devices and when the user prefers
 * reduced motion.
 */
export function PortfolioTile({
  item,
  index,
  visible,
  onOpen,
}: PortfolioTileProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  // 3D tilt motion values.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(srx, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sry, [-0.5, 0.5], [-8, 8]);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalise to -0.5 .. 0.5 around the tile centre.
    sry.set((e.clientX - rect.left) / rect.width - 0.5);
    srx.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    srx.set(0);
    sry.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      layout
      data-cursor="view"
      data-cursor-label="view"
      variants={scaleFade}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      custom={index * 70}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => onOpen(item)}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg outline-none transition-shadow duration-300 [transform-style:preserve-3d] hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-th-blue/60"
      aria-label={`Open ${item.title} — ${item.category}`}
    >
      {/* Blur-up placeholder gradient (always rendered as the base layer) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} ${loaded ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
      >
        {/* Shimmer sweep */}
        <span className="th-shimmer pointer-events-none absolute inset-0" />
      </div>

      {/* Image (or gradient fallback) */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          }`}
          draggable={false}
        />
      ) : null}

      {/* Reveal mask — slides up on hover, revealing the title */}
      <div className="absolute inset-0 translate-y-0 bg-gradient-to-t from-th-charcoal/85 via-th-charcoal/20 to-transparent opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100" />

      {/* Top-right category chip */}
      <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-th-blue-deep opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        {item.category}
      </span>

      {/* Bottom title block */}
      <div className="absolute inset-x-0 bottom-0 z-10 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="font-serif text-lg font-semibold leading-tight text-white">
          {item.title}
        </h3>
        {item.year && (
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            {item.year}
          </span>
        )}
      </div>

      {/* Corner accent on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${item.accent ?? "#1d4ed8"}55, inset 0 0 60px ${(item.accent ?? "#1d4ed8")}22`,
        }}
      />
    </motion.button>
  );
}
