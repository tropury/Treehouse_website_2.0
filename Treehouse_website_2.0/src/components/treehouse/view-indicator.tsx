"use client";

import { motion } from "framer-motion";
import { views } from "./data/site";
import type { ViewId } from "./types";
import { studioEase } from "./lib/motion";

interface ViewIndicatorProps {
  view: ViewId;
  onGoTo: (id: ViewId) => void;
}

/**
 * Minimal progress dots — fixed to the bottom-right corner.
 * Lets visitors jump straight to any scene and shows where they are
 * in the cycle.
 */
export function ViewIndicator({ view, onGoTo }: ViewIndicatorProps) {
  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-th-charcoal/70 px-4 py-2.5 backdrop-blur-md">
      {views.map((v) => {
        const active = v.id === view;
        return (
          <motion.button
            key={v.id}
            type="button"
            onClick={() => onGoTo(v.id)}
            aria-label={`${v.label} view`}
            aria-current={active ? "true" : undefined}
            className="group relative flex h-2.5 w-2.5 items-center justify-center"
          >
            <motion.span
              className="block rounded-full"
              animate={{
                width: active ? 24 : 10,
                height: 10,
                backgroundColor: active ? "#2563eb" : "#e8e0d580",
              }}
              transition={{ duration: 0.4, ease: studioEase }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
