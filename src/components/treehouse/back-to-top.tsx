"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { studioEase } from "./lib/motion";

/**
 * BackToTop — a floating button that appears when a scrollable panel is
 * scrolled past its first viewport.
 *
 * Clicking it smoothly scrolls the active `.th-scroll` panel back to
 * the top. Hidden on hero (no scrollable panel) and when the lightbox
 * is open. Fades in/out with the studio easing.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  // Find the active scrollable panel (same logic as ScrollProgressIndicator).
  useEffect(() => {
    const find = () => {
      const dialogOpen = document.querySelector(
        "[role='dialog'][aria-modal='true']",
      );
      if (dialogOpen) {
        setScrollEl(null);
        setVisible(false);
        return;
      }
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

  // Track scroll position.
  useEffect(() => {
    if (!scrollEl) {
      setVisible(false);
      return;
    }
    const onScroll = () => {
      setVisible(scrollEl.scrollTop > 320);
    };
    onScroll();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [scrollEl]);

  const scrollToTop = () => {
    scrollEl?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          data-cursor="link"
          className="group fixed bottom-20 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/70 bg-white/70 text-zinc-600 shadow-lg backdrop-blur-md transition-colors duration-300 hover:border-th-blue hover:text-th-blue md:bottom-24 md:right-8"
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.3, ease: studioEase }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
