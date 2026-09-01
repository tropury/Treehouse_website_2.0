"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { studioEase } from "./lib/motion";

/** A single keyboard shortcut entry. */
interface Shortcut {
  keys: string[];
  description: string;
}

/** The full shortcut set. Kept here so it stays close to the legend UI. */
const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], description: "Open command palette" },
  { keys: ["→", "Space"], description: "Open the menu" },
  { keys: ["←"], description: "Previous view" },
  { keys: ["1", "2", "3", "4", "5"], description: "Jump to a view" },
  { keys: ["Esc"], description: "Close menu / dialog" },
  { keys: ["?"], description: "Toggle this panel" },
];

/**
 * KeyboardHints — a discoverable shortcut legend.
 *
 * A small keyboard-icon button sits in the bottom-left corner. Clicking
 * it (or pressing "?") opens a panel listing every keyboard shortcut.
 * The actual navigation is handled by the `useScene` hook and the
 * lightbox; this component is purely the discoverable legend + the
 * "?" toggle for it.
 *
 * The keydown listener is registered once (empty deps) and toggles via
 * a ref so it never goes stale.
 */
export function KeyboardHints() {
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Toggle the panel with "?" (Shift+/ on most layouts).
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        toggle();
        return;
      }

      // Escape closes the panel if open.
      if (e.key === "Escape" && openRef.current) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, close]);

  return (
    <>
      {/* Trigger button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Keyboard shortcuts"
        aria-expanded={open}
        data-cursor="link"
        className="group fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/70 bg-white/70 text-zinc-600 backdrop-blur-md transition-colors duration-300 hover:border-th-blue hover:text-th-blue md:bottom-8 md:left-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <Keyboard className="h-4 w-4" />
      </motion.button>

      {/* Legend panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 left-6 z-50 w-72 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-2xl backdrop-blur-md md:left-8"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: studioEase }}
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Keyboard className="h-3.5 w-3.5 text-th-blue" />
                <span className="font-serif text-sm font-semibold text-zinc-800">
                  Shortcuts
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close shortcuts"
                className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Shortcut list */}
            <ul className="divide-y divide-zinc-50">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.description}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <span className="text-xs text-zinc-600">{s.description}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="min-w-[1.4rem] rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-center font-mono text-[10px] font-medium text-zinc-700 shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            {/* Footer hint */}
            <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-2">
              <p className="font-serif text-[10px] italic text-zinc-400">
                Press <kbd className="font-mono not-italic">?</kbd> anytime to
                toggle this panel.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
