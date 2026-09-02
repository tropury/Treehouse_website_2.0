"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { fade, studioEase } from "../lib/motion";

interface DarkPanelProps {
  /** Whether the hero (split) layout is currently active. */
  active: boolean;
}

/**
 * The charcoal left half of the split-screen hero.
 *
 * Hosts the colour TreeHouse logo and a faint vertical studio marker.
 * Layered radial gradients add atmospheric depth (vignette + glow) so the
 * panel feels printed and tactile rather than a flat fill. Fades out when
 * the blue panel takes over the stage.
 *
 * A subtle multi-layer mouse parallax gives the panel cinematic depth:
 * the logo, vignette, and glow shift at different rates as the pointer
 * moves, creating a multi-plane effect. Disabled on touch devices and
 * when the user prefers reduced motion.
 */
export function DarkPanel({ active }: DarkPanelProps) {
  // Parallax motion values — spring-smoothed for a fluid feel.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 });

  // Each layer moves at a different rate (depth illusion).
  const logoX = useTransform(smx, [-0.5, 0.5], [-14, 14]);
  const logoY = useTransform(smy, [-0.5, 0.5], [-10, 10]);
  const glowX = useTransform(smx, [-0.5, 0.5], [-40, 0]);
  const vignetteX = useTransform(smx, [-0.5, 0.5], [10, -10]);
  const markerY = useTransform(smy, [-0.5, 0.5], [-20, 20]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalise to -0.5 .. 0.5 around the panel centre.
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [active, mx, my]);

  return (
    <motion.div
      ref={ref}
      className="th-grain absolute left-0 top-0 z-10 flex h-1/2 w-full items-center justify-center overflow-hidden bg-th-charcoal md:h-full md:w-1/2"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.7, ease: studioEase }}
      aria-hidden={!active}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {/* Atmospheric vignette — lighter center, darker edges (parallax layer 3) */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          x: vignetteX,
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(70,70,70,0.55) 0%, rgba(42,42,42,0) 45%, rgba(15,15,15,0.65) 100%)",
        }}
      />

      {/* Logo (parallax layer 1 — moves most) */}
      <motion.img
        src="/treehouse-logo.png"
        alt="Tree House"
        className="relative z-10 h-32 w-32 select-none object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)] md:h-48 md:w-48"
        variants={fade}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        custom={200}
        draggable={false}
        style={{ x: logoX, y: logoY }}
      />

      {/* Vertical edge marker (parallax layer 2 — moves opposite) */}
      <motion.span
        className="writing-vertical absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 font-serif text-xs uppercase tracking-[0.4em] text-th-cream/30 md:block"
        style={{ y: markerY }}
      >
        TreeHouse Studio
      </motion.span>

      {/* Ambient blue glow bleeding from the seam (parallax layer 4) */}
      <motion.div
        className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-th-blue/20 blur-3xl"
        style={{ x: glowX }}
      />

      {/* Bottom corner coordinates */}
      <div className="absolute bottom-6 left-6 z-10 hidden font-mono text-[10px] tracking-wider text-th-cream/30 md:block">
        — 2026
      </div>
    </motion.div>
  );
}
