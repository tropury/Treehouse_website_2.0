"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { statusItems } from "./data/status";
import { studioEase } from "./lib/motion";

/**
 * StatusTicker — an ambient "studio is alive" bar.
 *
 * Sits directly above the footer and rotates through pseudo-live status
 * messages every ~5s with a vertical crossfade. The current message is
 * prefixed by a small pulsing "live" dot and its category label.
 *
 * The rotation pauses when the tab is hidden (visibilitychange) and
 * respects prefers-reduced-motion (the crossfade becomes an instant
 * swap).
 */
export function StatusTicker() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let timer: ReturnType<typeof setInterval>;

    const start = () => {
      timer = setInterval(() => {
        if (document.visibilityState === "visible") {
          setIndex((i) => (i + 1) % statusItems.length);
        }
      }, 5000);
    };
    start();
    return () => clearInterval(timer);
  }, []);

  const current = statusItems[index];

  return (
    <div className="relative z-40 flex h-9 shrink-0 items-center overflow-hidden border-t border-zinc-200/70 bg-th-charcoal px-4 text-th-cream">
      {/* Live dot */}
      <span className="relative mr-2.5 flex h-2 w-2 shrink-0">
        <span className="th-pulse-ring absolute inline-flex h-full w-full rounded-full bg-th-blue/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-th-blue" />
      </span>

      <span className="mr-2.5 hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-th-blue-soft sm:inline">
        Live
      </span>

      {/* Rotating message */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: studioEase }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-th-cream/50">
              {current.label}
            </span>
            <span className="font-serif text-xs italic text-th-cream/90">
              {current.text}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Counter */}
      <span className="ml-3 hidden shrink-0 font-mono text-[9px] tracking-wider text-th-cream/30 md:inline">
        {String(index + 1).padStart(2, "0")} / {String(statusItems.length).padStart(2, "0")}
      </span>
    </div>
  );
}
