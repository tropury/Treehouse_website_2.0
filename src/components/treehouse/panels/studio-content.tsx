"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { studioPrinciples, studioMetrics } from "../data/studio";
import { fadeUp, studioEase } from "../lib/motion";
import { CapabilityRadar } from "./capability-radar";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { FaqAccordion } from "./faq-accordion";
import { ProcessTimeline } from "./process-timeline";
import { MetricCounter } from "./metric-counter";

interface StudioContentProps {
  visible: boolean;
}

/**
 * The studio / process view rendered inside the blue stage.
 *
 * Presents the studio's three working principles (with an interactive
 * "spotlight" — hovering or focusing one dims the others) alongside a
 * capability radar chart in a two-column desktop layout, so both are
 * visible without scrolling. A metrics row anchors the bottom.
 */
export function StudioContent({ visible }: StudioContentProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="th-scroll relative h-full w-full overflow-y-auto px-6 pb-28 pt-12 md:px-16 md:pt-16">
      {/* Section label */}
      <motion.div
        className="mb-4 flex items-baseline gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: studioEase, delay: 0.2 }}
      >
        <span className="font-serif text-lg italic text-white md:text-xl">
          process
        </span>
        <span className="h-px flex-1 bg-white/20" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          03 — Studio
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="max-w-2xl font-serif text-2xl font-bold leading-tight text-white md:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: studioEase, delay: 0.35 }}
      >
        We blend design, storytelling, and technology.
      </motion.h2>

      {/* Two-column: principles (left) + radar (right) on desktop */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Principles column */}
        <div
          className="relative flex flex-col gap-4"
          onMouseLeave={() => setActiveIdx(null)}
        >
          {/* Vertical connector line (desktop) */}
          <svg
            className="pointer-events-none absolute left-4 top-4 hidden h-[calc(100%-2rem)] w-2 lg:block"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox="0 0 2 100"
          >
            <line
              x1="1"
              y1="2"
              x2="1"
              y2="98"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.4"
              strokeDasharray="2 2"
            />
          </svg>

          {studioPrinciples.map((p, i) => {
            const dimmed = activeIdx !== null && activeIdx !== i;
            return (
              <motion.div
                key={p.id}
                variants={fadeUp}
                initial="hidden"
                animate={visible ? "visible" : "hidden"}
                custom={i * 120 + 500}
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                tabIndex={0}
                className={`group relative rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:ring-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  dimmed ? "opacity-40 saturate-50" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif text-2xl font-light text-white/40 transition-colors duration-300 group-hover:text-th-blue-soft">
                    {p.index}
                  </span>
                  <span className="h-px flex-1 bg-white/20" />
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {p.description}
                </p>

                {/* Bottom accent on hover/focus */}
                <span className="absolute bottom-0 left-5 right-5 h-0.5 origin-left scale-x-0 bg-th-blue-soft transition-transform duration-500 group-hover:scale-x-100" />
              </motion.div>
            );
          })}
        </div>

        {/* Radar column */}
        <div className="flex flex-col">
          <motion.div
            className="mb-4 flex items-baseline gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: studioEase, delay: 0.4 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
              Capabilities
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </motion.div>
          <CapabilityRadar visible={visible} />
        </div>
      </div>

      {/* Process timeline */}
      <div className="mt-10">
        <ProcessTimeline visible={visible} />
      </div>

      {/* Testimonials */}
      <div className="mt-10">
        <motion.div
          className="mb-4 flex items-baseline gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: studioEase, delay: 0.4 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Voices
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </motion.div>
        <TestimonialsCarousel visible={visible} />
      </div>

      {/* Metrics */}
      <motion.div
        className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        {studioMetrics.map((m) => (
          <MetricCounter key={m.id} metric={m} />
        ))}
      </motion.div>

      {/* FAQ */}
      <div className="mt-10">
        <FaqAccordion visible={visible} />
      </div>
    </div>
  );
}
