"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { studioEase } from "./lib/motion";

/**
 * PageIntro — a one-time curtain reveal.
 *
 * On first load a full-bleed charcoal panel with the TreeHouse logo
 * sweeps up to reveal the experience, framing the site like a gallery
 * opening. Runs once per session (guarded by sessionStorage) and is
 * skipped entirely for users who prefer reduced motion.
 */
export function PageIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    try {
      if (sessionStorage.getItem("th-intro-seen")) return;
    } catch {
      /* sessionStorage unavailable — fall through to show */
    }
    setShow(true);

    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem("th-intro-seen", "1");
      } catch {
        /* ignore */
      }
    }, 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="th-grain fixed inset-0 z-[90] flex items-center justify-center bg-th-charcoal"
          initial={{ y: "0%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-101%" }}
          transition={{ duration: 1.1, ease: studioEase }}
        >
          {/* Logo wordmark reveal */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: studioEase, delay: 0.15 }}
          >
            <img
              src="/treehouse-logo.png"
              alt=""
              className="h-20 w-20 select-none object-contain md:h-28 md:w-28"
              draggable={false}
            />
            <motion.span
              className="mt-4 font-serif text-xs uppercase tracking-[0.5em] text-th-cream/70"
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1, ease: studioEase, delay: 0.4 }}
            >
              TreeHouse Studio
            </motion.span>
          </motion.div>

          {/* Thin progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-th-blue"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: studioEase }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
