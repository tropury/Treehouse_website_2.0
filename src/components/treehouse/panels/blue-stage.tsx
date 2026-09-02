"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PortfolioItem, ViewId } from "../types";
import { studioEase } from "../lib/motion";
import { PortfolioContent } from "./portfolio-content";
import { StudioContent } from "./studio-content";
import { LabContent } from "./lab-content";
import { ContactContent } from "./contact-content";

/** Lightbox handlers passed down from the scene (enables deep links). */
export interface PortfolioHandlers {
  open: (item: PortfolioItem) => void;
  close: () => void;
  navigate: (direction: 1 | -1) => void;
}

interface BlueStageProps {
  view: ViewId;
  portfolioHandlers: PortfolioHandlers;
  /** Navigate back to the hero (the logo is the home affordance). */
  onHome: () => void;
}

/**
 * The expanding blue stage.
 *
 * Collapses to a hairline on the inactive axis (height on mobile, width on
 * desktop) and sweeps to full-bleed for the portfolio & contact views.
 * The expansion uses a CSS transition (matching the original easing) so it
 * stays perfectly responsive without measuring the viewport.
 *
 * Inner content crossfades with AnimatePresence based on the active view.
 */
export function BlueStage({ view, portfolioHandlers, onHome }: BlueStageProps) {
  const expanded = view !== "hero";

  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-20 overflow-hidden bg-th-blue transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]",
        expanded ? "h-full w-full" : "h-0 w-full md:h-full md:w-0",
      )}
    >
      {/* White logo — top-left; clicking it returns to the studio intro */}
      <button
        type="button"
        onClick={onHome}
        aria-label="Tree House — back to studio intro"
        data-cursor="link"
        className={cn(
          "absolute left-6 top-6 z-50 cursor-pointer transition-opacity duration-500 md:left-10 md:top-10",
          expanded ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <img
          src="/treehouse-logo-white.png"
          alt="Tree House"
          className="h-8 w-16 select-none object-contain md:h-10 md:w-20"
          draggable={false}
        />
      </button>

      {/* Mobile scrim — scrolled content fades out before reaching the
          fixed logo (top-left) and hub ball (top-right), so nothing
          collides with the chrome on small screens. */}
      {expanded && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-28 bg-gradient-to-t from-transparent via-th-blue/70 to-th-blue md:hidden"
        />
      )}

      {/* Content layers */}
      <AnimatePresence mode="wait">
        {view === "portfolio" && (
          <motion.div
            key="portfolio"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: studioEase, delay: 0.4 }}
          >
            <PortfolioContent visible={expanded} handlers={portfolioHandlers} />
          </motion.div>
        )}
        {view === "studio" && (
          <motion.div
            key="studio"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: studioEase, delay: 0.4 }}
          >
            <StudioContent visible={expanded} />
          </motion.div>
        )}
        {view === "lab" && (
          <motion.div
            key="lab"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: studioEase, delay: 0.4 }}
          >
            <LabContent visible={expanded} />
          </motion.div>
        )}
        {view === "contact" && (
          <motion.div
            key="contact"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: studioEase }}
          >
            <ContactContent visible={expanded} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { PortfolioItem };
