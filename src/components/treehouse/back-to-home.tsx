"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Home } from "lucide-react";
import { studioEase } from "./lib/motion";

interface BackToHomeProps {
  /** Whether the button should be visible (hidden on the hero view). */
  visible: boolean;
  /** Navigate back to the hero view. */
  onHome: () => void;
}

/**
 * BackToHome — a persistent "return to start" affordance.
 *
 * Appears in the top-left corner whenever the visitor is not on the hero
 * view, giving them a one-tap way back to the opening scene. Hidden on
 * hero (where there's nothing to go "back" to) and animated in/out.
 */
export function BackToHome({ visible, onHome }: BackToHomeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onHome}
          aria-label="Back to studio intro"
          data-cursor="link"
          className="group fixed left-6 top-6 z-50 flex h-10 items-center gap-2 rounded-full border border-zinc-300/70 bg-white/70 px-3.5 text-zinc-600 backdrop-blur-md transition-colors duration-300 hover:border-th-blue hover:text-th-blue md:left-8 md:top-8"
          initial={{ opacity: 0, x: -12, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -12, scale: 0.9 }}
          transition={{ duration: 0.4, ease: studioEase }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <Home className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
            Studio
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
