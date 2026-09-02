"use client";

import { motion } from "framer-motion";
import { socials } from "../data/socials";
import { fadeUp, studioEase } from "../lib/motion";
import { ContactForm } from "./contact-form";

interface ContactContentProps {
  visible: boolean;
}

/** Words cycling through the background marquee ticker. */
const MARQUEE_WORDS = [
  "VISUAL PERSUASION",
  "TREEHOUSE STUDIO",
  "EST. STUDIO",
  "ARCHITECTURE",
  "INTERIOR",
  "ART",
];

/**
 * The contact view rendered inside the blue stage.
 *
 * Two columns on desktop: the studio's social destinations (links &
 * labels preserved verbatim from the original site) on the left, and a
 * multi-step project-planner form on the right. Behind them a slow
 * marquee ticker of studio vocabulary drifts horizontally, giving the
 * section ambient energy. Each social link expands its letter-spacing
 * and draws an underline on hover.
 */
export function ContactContent({ visible }: ContactContentProps) {
  // Duplicate the word list so the marquee loops seamlessly.
  const ticker = [...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div className="th-scroll relative h-full w-full overflow-y-auto px-6 pb-28 pt-24 md:px-12 md:pt-24">
      {/* Marquee background ticker */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="th-marquee flex w-max whitespace-nowrap">
          {ticker.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="mx-6 font-serif text-[12vw] font-light italic text-white/[0.04] md:text-[8vw]"
            >
              {word}
              <span className="mx-4 text-white/[0.06]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Section header */}
      <motion.div
        className="relative z-10 mb-6 flex items-baseline gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: studioEase, delay: 0.2 }}
      >
        <span className="font-serif text-lg italic text-white md:text-xl">
          contact
        </span>
        <span className="h-px flex-1 bg-white/20" />
      </motion.div>

      <motion.h2
        className="relative z-10 max-w-md font-serif text-2xl font-bold leading-tight text-white md:text-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: studioEase, delay: 0.35 }}
      >
        Let&apos;s build something.
      </motion.h2>

      {/* Two-column: social links + form */}
      <div className="relative z-10 mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Social links */}
        <div>
          <span className="mb-4 block font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
            Follow the studio
          </span>
          <div className="flex flex-col gap-3 md:gap-4">
            {socials.map((social) => (
              <motion.a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                data-cursor-label="open"
                variants={fadeUp}
                initial="hidden"
                animate={visible ? "visible" : "hidden"}
                custom={social.delay + 300}
                className="group relative flex cursor-pointer flex-col text-white transition-colors duration-300 hover:text-th-cream"
              >
                <span className="text-2xl font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:tracking-[0.06em] md:text-3xl">
                  {social.label}
                </span>
                <span className="text-xs font-light text-white/70 transition-opacity duration-300 group-hover:text-white/40 md:text-sm">
                  {social.tag}
                </span>
                {/* Animated underline */}
                <span className="relative mt-1 h-px w-full overflow-hidden bg-white/20">
                  <span className="absolute left-0 top-0 h-full w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
                </span>
              </motion.a>
            ))}
          </div>

          <motion.p
            className="mt-6 font-serif text-xs italic text-white/60"
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Say hello — we make visuals.
          </motion.p>
        </div>

        {/* Contact form */}
        <div>
          <span className="mb-4 block font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
            Start a project
          </span>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
