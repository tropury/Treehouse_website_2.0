"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { studioEase } from "../lib/motion";

interface TestimonialsCarouselProps {
  visible: boolean;
}

/**
 * Testimonials — an auto-advancing quote carousel.
 *
 * Renders one testimonial at a time with a crossfade transition. Auto
 * -advances every 7s; pauses on hover. Manual prev/next chevrons and a
 * dot indicator give full control. Pauses when not visible to save
 * cycles.
 */
export function TestimonialsCarousel({ visible }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!visible || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(t);
  }, [visible, paused]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  const current = testimonials[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[140px] overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm md:min-h-[150px] md:p-8">
        <Quote
          className="pointer-events-none absolute right-4 top-4 h-10 w-10 text-white/10"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: studioEase }}
            className="relative"
          >
            <p className="font-serif text-base italic leading-relaxed text-white/90 md:text-lg">
              “{current.quote}”
            </p>
            <footer className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-th-blue/30 font-serif text-sm font-bold text-white">
                {current.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {current.author}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {current.role}
                </div>
              </div>
              {current.project && (
                <span className="ml-auto hidden rounded-full bg-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-white/60 md:inline">
                  {current.project}
                </span>
              )}
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className="group p-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/30 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
