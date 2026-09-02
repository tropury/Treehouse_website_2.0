"use client";

import { motion } from "framer-motion";
import { siteConfig } from "../data/site";
import { fadeUp, studioEase } from "../lib/motion";

interface HeroPanelProps {
  active: boolean;
}

/**
 * The hero headline broken into lines, each rendered with a distinct
 * typographic treatment (weight / size / style) to create rhythm and
 * hierarchy — an editorial "stacked" composition rather than a flat
 * shouty block.
 *
 * The "Persuasion" line gets an additional per-character stagger reveal
 * for a premium, kinetic-typography feel. Copy is preserved verbatim;
 * only the per-line styling and motion vary.
 */
const HEADLINE_LINES: {
  text: string;
  className: string;
  /** Whether to animate per-character (used for the hero hook word). */
  perChar?: boolean;
}[] = [
  { text: "We Make", className: "text-zinc-400 font-light" },
  { text: "Visual", className: "text-zinc-900 font-black tracking-tight" },
  {
    text: "Persuasion",
    className: "font-serif italic font-medium text-th-blue",
    perChar: true,
  },
  { text: "& Some Art", className: "text-zinc-700 font-bold" },
];

export function HeroPanel({ active }: HeroPanelProps) {
  return (
    <div
      className="absolute bottom-0 right-0 top-auto z-10 flex h-2/3 w-full flex-col items-center justify-center overflow-hidden bg-white p-8 pb-24 md:bottom-auto md:top-0 md:h-full md:w-1/2 md:pb-16 md:p-16"
      aria-hidden={!active}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {/* Subtle paper grain on the white panel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "5px 5px",
        }}
      />

      {/* Faint editorial index */}
      <span className="absolute left-6 top-6 z-10 font-serif text-[10px] uppercase tracking-[0.3em] text-zinc-400 md:left-10 md:top-10">
        01 — Studio
      </span>

      <motion.div
        className="relative flex max-w-lg flex-col items-center text-center"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: studioEase, delay: active ? 0.3 : 0 }}
      >
        <h1 className="mb-8 text-4xl uppercase md:text-6xl">
          {HEADLINE_LINES.map((line, i) => (
            <motion.span
              key={line.text}
              className={`block leading-[1.05] ${line.className}`}
              variants={fadeUp}
              initial="hidden"
              animate={active ? "visible" : "hidden"}
              custom={i * 90 + 200}
            >
              {line.perChar ? (
                <span className="inline-flex" aria-label={line.text}>
                  {line.text.split("").map((ch, ci) => (
                    <motion.span
                      key={`${ch}-${ci}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: "0.4em", rotateX: -90 }}
                      animate={
                        active
                          ? { opacity: 1, y: 0, rotateX: 0 }
                          : { opacity: 0, y: "0.4em", rotateX: -90 }
                      }
                      transition={{
                        duration: 0.6,
                        ease: studioEase,
                        delay: (i * 90 + 200) / 1000 + ci * 0.045,
                      }}
                      style={{ transformOrigin: "bottom center" }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                  ))}
                </span>
              ) : (
                line.text
              )}
            </motion.span>
          ))}
        </h1>

        {/* Divider */}
        <motion.div
          className="mb-6 h-px w-16 bg-zinc-300"
          variants={fadeUp}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          custom={560}
        />

        <motion.p
          className="max-w-xs text-sm text-zinc-500 md:text-base"
          variants={fadeUp}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          custom={620}
        >
          {siteConfig.heroSubtitle}
        </motion.p>

        {/* Hint to interact */}
        <motion.div
          className="mt-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400"
          variants={fadeUp}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          custom={780}
        >
          <span>Tap to explore</span>
          <span className="th-float inline-block">→</span>
        </motion.div>
      </motion.div>

      {/* Bottom-right corner index */}
      <span className="absolute bottom-6 right-6 z-10 font-serif text-[10px] uppercase tracking-[0.3em] text-zinc-400 md:right-10">
        Visual Persuasion
      </span>
    </div>
  );
}
