"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { studioEase } from "./lib/motion";
import { useScrollProgress } from "./lib/use-scroll-progress";

/**
 * ScrollProgressIndicator — a thin vertical progress bar on the right
 * edge that fills as the visitor scrolls a long scrollable panel.
 *
 * Observes the active scrollable panel (the `.th-scroll` inside the
 * visible blue-stage content layer) and tracks its scroll position.
 * Appears only when the panel can scroll (i.e. content overflows).
 * Hidden when the lightbox is open.
 */
export function ScrollProgressIndicator() {
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  // Find the active scrollable panel (re-checked on DOM changes so it
  // updates when the scene swaps content layers).
  useEffect(() => {
    const find = () => {
      const dialogOpen = document.querySelector(
        "[role='dialog'][aria-modal='true']",
      );
      if (dialogOpen) {
        setScrollEl(null);
        return;
      }
      // The expanded blue stage hosts the active .th-scroll panel.
      const stage = document.querySelector(".bg-th-blue.h-full.w-full");
      const scrollable = (stage?.querySelector(".th-scroll") ??
        null) as HTMLElement | null;
      setScrollEl(scrollable);
    };
    find();
    const mo = new MutationObserver(find);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  const progress = useScrollProgress(scrollEl);

  const canScroll = scrollEl
    ? scrollEl.scrollHeight - scrollEl.clientHeight > 8
    : false;

  return (
    <AnimatePresence>
      {canScroll && (
        <motion.div
          className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-32 w-1 -translate-y-1/2 rounded-full bg-white/15 md:block"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.4, ease: studioEase }}
          aria-hidden="true"
        >
          <motion.div
            className="w-full rounded-full bg-th-blue"
            style={{ height: `${Math.max(4, progress * 100)}%` }}
            initial={false}
            transition={{ duration: 0.15 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

