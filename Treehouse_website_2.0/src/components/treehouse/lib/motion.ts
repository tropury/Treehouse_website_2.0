import type { Variants, Transition } from "framer-motion";

/**
 * Centralised motion presets.
 *
 * Reused across every panel so the whole site shares one rhythm.
 * Tweak the easing here and the entire experience follows.
 */

/** The signature easing used by the original studio site. */
export const studioEase: [number, number, number, number] = [
  0.76, 0, 0.24, 1,
];

/** Default transition for panel + content reveals. */
export const studioTransition: Transition = {
  duration: 0.9,
  ease: studioEase,
};

/** Quick fade for inner content crossfades. */
export const fadeTransition: Transition = {
  duration: 0.5,
  ease: studioEase,
};

/** Fade + lift in. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...fadeTransition, delay: delay / 1000 },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: studioEase } },
};

/** Pure opacity fade. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { ...fadeTransition, delay: delay / 1000 },
  }),
  exit: { opacity: 0, transition: { duration: 0.3, ease: studioEase } },
};

/** Scale + fade, used by the portfolio tiles. */
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: studioEase, delay: delay / 1000 },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3 } },
};
