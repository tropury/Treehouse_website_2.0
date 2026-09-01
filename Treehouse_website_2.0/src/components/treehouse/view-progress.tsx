"use client";

import { motion } from "framer-motion";
import { views } from "./data/site";
import type { ViewId } from "./types";
import { studioEase } from "./lib/motion";

interface ViewProgressProps {
  view: ViewId;
}

/**
 * ViewProgress — a thin progress bar pinned to the very top of the
 * viewport that fills according to the current view's position in the
 * cycle. Provides a subtle, always-visible sense of how far through the
 * experience the visitor is. The fill animates with the studio easing
 * whenever the view changes.
 */
export function ViewProgress({ view }: ViewProgressProps) {
  const index = views.findIndex((v) => v.id === view);
  const pct = ((index + 1) / views.length) * 100;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5 bg-white/10"
      aria-hidden="true"
    >
      <motion.div
        className="h-full bg-th-blue"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: studioEase }}
      />
    </div>
  );
}
