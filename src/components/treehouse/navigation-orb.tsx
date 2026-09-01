"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { studioEase } from "./lib/motion";
import { views } from "./data/site";
import type { ViewId } from "./types";

interface NavigationOrbProps {
  view: ViewId;
  onNext: () => void;
}

/**
 * The circular blue navigation button.
 *
 * Sits at the centre on mobile and bottom-centre on desktop, mirroring
 * the original composition. A pulsing ring invites the tap; the tooltip
 * previews the next destination.
 */
export function NavigationOrb({ view, onNext }: NavigationOrbProps) {
  const currentIndex = views.findIndex((v) => v.id === view);
  const nextView = views[(currentIndex + 1) % views.length];

  return (
    <motion.button
      type="button"
      onClick={onNext}
      aria-label={`Go to ${nextView.label} view`}
      className="group absolute bottom-5 left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-th-blue shadow-[0_8px_30px_rgba(37,99,235,0.45)] outline-none ring-th-blue/40 transition-colors duration-300 hover:bg-th-blue-deep focus-visible:ring-4 md:bottom-6 md:h-16 md:w-16"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: studioEase, delay: 0.6 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Pulsing invite ring */}
      <span className="th-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-th-blue/40" />

      <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 md:h-6 md:w-6" />

      {/* Hover tooltip with the next view label */}
      <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-th-charcoal/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-th-cream opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        {nextView.label}
      </span>
    </motion.button>
  );
}
