"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { studioEase } from "./lib/motion";
import type { ViewId } from "./types";

interface HubButtonProps {
  /** Whether the split menu is currently open. */
  menuOpen: boolean;
  /** Whether the hero view is active (button rests at the bottom). */
  isHero: boolean;
  /** The active view — used to highlight the matching label. */
  view: ViewId;
  /** Open / close the menu. */
  onToggle: () => void;
  /** Jump straight to a destination from the flanking labels. */
  onGoTo: (view: ViewId) => void;
}

/**
 * Geometry of the parked ball, faithful to the original site: on a full
 * view the ball rests at the top-RIGHT with its centre 112px from the
 * right edge (80px margin + half of the 64px ball), flanked by the
 * "portfolio" / "contact" labels.
 */
const BALL_CENTER_FROM_RIGHT = 112;

/**
 * The TreeHouse hub button — the site's single persistent control.
 *
 * Faithful to the original studio site, the ball has three resting
 * states:
 *
 *  - hero        → bottom-centre, plain blue, invites the first click
 *  - menu open   → top-centre, charcoal, flanked by the two choices
 *  - full view   → top-RIGHT, warm cream, flanked by the same labels
 *
 * Choosing a destination slides the ball right (exactly like the
 * original), and clicking the ball inside any full view brings the
 * two-option menu back. Position + colour morph share the signature
 * studio easing (cubic-bezier(0.76, 0, 0.24, 1)) over ~0.7s.
 */
export function HubButton({
  menuOpen,
  isHero,
  view,
  onToggle,
  onGoTo,
}: HubButtonProps) {
  // Viewport width (px) so the ball can glide between the centre and
  // the top-right corner. 0 until mounted — renders centred first.
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const atTop = menuOpen || !isHero;
  /** Full view (menu closed): the ball is parked at the top-right. */
  const parkedRight = atTop && !menuOpen;

  const ballX =
    parkedRight && vw > 0 ? vw - BALL_CENTER_FROM_RIGHT : vw === 0 ? "50%" : vw / 2;
  const ballColor = parkedRight ? "#e8e0d5" : atTop ? "#27272a" : "#2563eb";

  const labelClass =
    "pointer-events-auto absolute top-1/2 -translate-y-1/2 cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-300";

  return (
    <>
      <motion.button
        type="button"
        onClick={onToggle}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        data-cursor="link"
        data-cursor-label={menuOpen ? "close" : "menu"}
        className="group absolute z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-xl outline-none ring-th-blue/40 transition-colors duration-300 focus-visible:ring-4 md:h-16 md:w-16"
        initial={false}
        animate={{
          left: ballX,
          x: "-50%",
          top: atTop ? 32 : "88%",
          backgroundColor: ballColor,
        }}
        transition={
          atTop
            ? { duration: 0.7, ease: studioEase }
            : { duration: 0.7, ease: studioEase, delay: 0.15 }
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* Pulsing invite ring — resting on the hero only */}
        {!atTop && (
          <span className="th-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-th-blue/40" />
        )}

        {/* Hover icon: X while the menu is open, plus otherwise */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {menuOpen ? (
            <X className="h-5 w-5 text-white/90 md:h-6 md:w-6" />
          ) : (
            <Plus
              className={`h-5 w-5 md:h-6 md:w-6 ${
                parkedRight ? "text-zinc-700" : "text-white/90"
              }`}
            />
          )}
        </span>

        {/* Tooltip (menu closed) */}
        {!menuOpen && (
          <span className="pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-th-charcoal/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-th-cream opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            menu
          </span>
        )}
      </motion.button>

      {/* ── Flanking destination labels (desktop) ──────────────────── */}
      {/* Menu open: the two choices flank the hub at the top-centre. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="hub-labels-menu"
            className="pointer-events-none absolute inset-x-0 top-8 z-40 hidden h-16 md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.45, duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <button
              type="button"
              onClick={() => onGoTo("portfolio")}
              data-cursor="link"
              className={`${labelClass} right-[calc(50%+3.25rem)] text-white/80 hover:text-white`}
            >
              portfolio
            </button>
            <button
              type="button"
              onClick={() => onGoTo("contact")}
              data-cursor="link"
              className={`${labelClass} left-[calc(50%+3.25rem)] text-zinc-600 hover:text-zinc-900`}
            >
              contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full view: the same labels flank the ball parked at the right. */}
      <AnimatePresence>
        {parkedRight && (
          <motion.div
            key="hub-labels-view"
            className="pointer-events-none absolute right-0 top-8 z-40 hidden h-16 w-72 md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <button
              type="button"
              onClick={() => onGoTo("portfolio")}
              data-cursor="link"
              aria-current={view === "portfolio" ? "true" : undefined}
              className={`${labelClass} right-[10.25rem] ${
                view === "portfolio" ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              portfolio
            </button>
            <button
              type="button"
              onClick={() => onGoTo("contact")}
              data-cursor="link"
              aria-current={view === "contact" ? "true" : undefined}
              className={`${labelClass} right-5 ${
                view === "contact" ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
