"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { studioEase } from "./lib/motion";
import { portfolio } from "./data/portfolio";
import { socials } from "./data/socials";
import { views } from "./data/site";
import type { ViewId } from "./types";

interface MenuOverlayProps {
  /** Whether the menu is open (mounted). */
  open: boolean;
  /** The active view (used to highlight / for a11y state). */
  view: ViewId;
  /** Choose a destination — closes the menu and switches the stage. */
  onChoose: (view: ViewId) => void;
  /** Close without choosing. */
  onClose: () => void;
  /** Navigate back to the hero (the logo is the home affordance). */
  onHome: () => void;
}

/** The split-panel slide duration, matching the original's 700ms sweep. */
const slide = { duration: 0.7, ease: studioEase };

/** Preview tiles — first four works keep the menu light and fast. */
const PREVIEW = portfolio.slice(0, 4);

/** Secondary destinations (everything besides the two headline choices). */
const SECONDARY = views.filter(
  (v) => v.id !== "portfolio" && v.id !== "contact" && v.id !== "hero",
);

/**
 * MenuOverlay — the signature split menu from the original studio site.
 *
 * Opening it sweeps a blue panel in from the top (mobile) / left (desktop)
 * with a portfolio preview — a 2×2 grid of recent works — and a white
 * panel in from the bottom (mobile) / right (desktop) with the studio's
 * social links. The two headline destinations also flank the hub ball
 * as small labels at the top — "portfolio" on the blue side, "contact"
 * on the white side — while the remaining scenes stay reachable through
 * a discreet mono link row at the bottom of the white panel. The logo
 * sits top-left, outside the panels, and returns to the studio intro.
 *
 * Motion: both panels share the studio easing over 0.7s, exactly like
 * the original's expanding panel.
 */
export function MenuOverlay({ open, onChoose, onClose, onHome }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-30 overflow-hidden"
          role="dialog"
          aria-label="Menu — choose a destination"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* ── Left (desktop) / top (mobile): blue portfolio preview ─ */}
          <motion.button
            type="button"
            onClick={() => onChoose("portfolio")}
            aria-label="Portfolio — see the selected work"
            data-cursor="link"
            data-cursor-label="open"
            className="group/p absolute inset-x-0 top-0 h-[46%] cursor-pointer overflow-hidden bg-th-blue text-left md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-1/2"
            initial={{ x: 0, y: "-100%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 0, y: "-100%" }}
            transition={slide}
          >
            {/* Giant watermark, echoing the full portfolio view */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none font-serif text-[22vw] font-bold italic leading-none text-white/10 md:text-[11vw]"
            >
              portfolio
            </span>

            {/* Works grid (2×2) — top padding clears the logo only (the
                hub ball now rests on the seam, not over the preview);
                bottom padding keeps the grid clear of the ball's upper
                half on short viewports. */}
            <span className="absolute inset-0 flex items-center justify-center p-6 pt-16 pb-6 md:p-16 md:pt-28 md:pb-16">
              <span className="grid w-full max-w-xl grid-cols-2 gap-3 md:gap-5">
                {PREVIEW.map((item, i) => (
                  <motion.span
                    key={item.id}
                    className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-white/20 shadow-lg ring-1 ring-white/20 md:rounded-2xl"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.5,
                      ease: studioEase,
                      delay: 0.35 + i * 0.08,
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-full select-none object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/p:scale-[1.06]"
                      />
                    ) : (
                      <span
                        className={`block h-full w-full bg-gradient-to-br ${item.gradient}`}
                      />
                    )}
                    {/* Title chip reveals as the panel is hovered */}
                    <span className="absolute inset-x-2 bottom-2 rounded-lg bg-th-charcoal/70 px-2.5 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/p:opacity-100 md:inset-x-3 md:bottom-3">
                      {item.title}
                    </span>
                  </motion.span>
                ))}
              </span>
            </span>
          </motion.button>

          {/* ── Right (desktop) / bottom (mobile): white contact panel ─ */}
          <motion.div
            onClick={() => onChoose("contact")}
            className="group/c absolute inset-x-0 bottom-0 h-[54%] cursor-pointer overflow-hidden bg-white md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-1/2"
            initial={{ x: 0, y: "100%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 0, y: "100%" }}
            transition={slide}
            data-cursor="link"
            data-cursor-label="open"
          >
            {/* Paper grain, same as the hero's white half */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
                backgroundSize: "5px 5px",
              }}
            />

            {/* Vertical seam marker — verbatim from the original */}
            <span
              aria-hidden
              className="writing-vertical absolute bottom-6 left-4 hidden select-none font-mono text-[10px] uppercase tracking-[0.4em] text-th-blue/70 md:left-6 md:block"
            >
              Seeking Visual
            </span>

            {/* Socials stack — big grey names, darkening on hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 md:gap-2">
              {socials.map((social, i) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-cursor="link"
                  data-cursor-label="open"
                  className="group/s flex items-baseline gap-2 text-zinc-400 transition-colors duration-300 hover:text-zinc-900 md:text-zinc-300"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.45,
                    ease: studioEase,
                    delay: 0.35 + i * 0.06,
                  }}
                >
                  <span className="text-2xl font-bold tracking-tight md:text-4xl">
                    {social.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 opacity-0 transition-opacity duration-300 group-hover/s:opacity-100 md:text-zinc-400">
                    {social.tag}
                  </span>
                </motion.a>
              ))}

              {/* Explicit "go to contact" affordance (keyboard friendly) */}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChoose("contact");
                }}
                data-cursor="link"
                className="mt-4 flex cursor-pointer items-center gap-1.5 font-serif text-xs italic text-zinc-400 transition-colors duration-300 hover:text-th-blue group-hover/c:text-th-blue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                start a project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* Secondary destinations + close, docked to the white side */}
            <motion.div
              className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              {SECONDARY.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChoose(v.id);
                  }}
                  data-cursor="link"
                  className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 transition-colors duration-300 hover:text-zinc-900"
                >
                  {v.label}
                </button>
              ))}
              <span aria-hidden className="h-3 w-px bg-zinc-300" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                data-cursor="link"
                aria-label="Dismiss menu"
                className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 transition-colors duration-300 hover:text-zinc-900"
              >
                close
              </button>
            </motion.div>
          </motion.div>

          {/* ── Logo — top-left, outside the panels; click returns home ── */}
          <motion.button
            type="button"
            onClick={onHome}
            aria-label="Tree House — back to studio intro"
            data-cursor="link"
            className="pointer-events-auto absolute left-6 top-6 z-20 cursor-pointer md:left-10 md:top-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/treehouse-logo-white.png"
              alt="Tree House"
              draggable={false}
              className="h-8 w-16 select-none object-contain md:h-10 md:w-20"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
