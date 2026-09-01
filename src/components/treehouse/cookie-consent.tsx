"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { studioEase } from "./lib/motion";

const STORAGE_KEY = "th-cookie-consent";

/**
 * CookieConsent — a GDPR-style consent banner.
 *
 * Appears at the bottom of the screen on first visit (after the intro
 * curtain), asking the visitor to accept or decline cookies. The choice
 * is persisted in `localStorage` so the banner never reappears for
 * returning visitors. Slides up with a spring animation.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Delay so it doesn't clash with the page-load intro curtain.
        const t = setTimeout(() => setShow(true), 2400);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable — show the banner */
      setShow(true);
    }
  }, []);

  const decide = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[85] flex justify-center p-4 md:p-6"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: studioEase }}
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-md md:p-6">
            {/* Close (dismiss without storing) */}
            <button
              type="button"
              onClick={() => setShow(false)}
              aria-label="Dismiss"
              className="absolute right-3 top-3 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4 pr-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-th-blue/10">
                <Cookie className="h-5 w-5 text-th-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-base font-bold text-zinc-800">
                  Cookies &amp; privacy
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  We use a single cookie to remember your choice — no
                  tracking, no third-party analytics. Nothing else is
                  stored.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => decide("accepted")}
                    className="rounded-full bg-th-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
                  >
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => decide("declined")}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-800"
                  >
                    Essential only
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
