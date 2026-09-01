"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { processSteps } from "../data/process";
import { studioEase } from "../lib/motion";

interface ProcessTimelineProps {
  visible: boolean;
}

/**
 * ProcessTimeline — a vertical, scroll-triggered timeline.
 *
 * Renders the studio's 5-step process as a vertical rail with a
 * progress line that fills as the visitor scrolls. Each step has a
 * numbered node, a title, a description, a deliverable, and an
 * indicative duration. Steps animate in (fade + slide) as they enter
 * the viewport via `whileInView`.
 */
export function ProcessTimeline({ visible }: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Section label */}
      <motion.div
        className="mb-6 flex items-baseline gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: studioEase, delay: 0.4 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          Process
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </motion.div>

      <div className="relative pl-10">
        {/* Track (background) */}
        <div className="absolute left-[14px] top-2 bottom-2 w-px bg-white/10" />

        {/* Progress line (fills on scroll) */}
        <motion.div
          className="absolute left-[14px] top-2 w-px origin-top bg-th-blue-soft"
          style={{ scaleY: lineHeight, height: "calc(100% - 1rem)" }}
        />

        {/* Steps */}
        <div className="space-y-8">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                ease: studioEase,
                delay: i * 0.05,
              }}
              className="relative"
            >
              {/* Node */}
              <span className="absolute -left-[26px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-th-blue-soft bg-th-charcoal">
                <span className="h-2 w-2 rounded-full bg-th-blue-soft" />
              </span>

              {/* Content */}
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm md:p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-light text-th-blue-soft">
                    {step.index}
                  </span>
                  <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-white md:text-xl">
                    {step.title}
                  </h3>
                  <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-wider text-white/40 md:inline">
                    {step.duration}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
                <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                    Deliverable
                  </span>
                  <span className="text-xs font-medium text-th-cream/80">
                    {step.deliverable}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
