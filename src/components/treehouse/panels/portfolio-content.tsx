"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "../data/portfolio";
import type { PortfolioItem } from "../types";
import { studioEase } from "../lib/motion";
import { PortfolioTile } from "./portfolio-tile";
import type { PortfolioHandlers } from "./blue-stage";

interface PortfolioContentProps {
  visible: boolean;
  /** Lightbox open/close/navigate handlers (owned by the scene). */
  handlers: PortfolioHandlers;
}

/** Ambient words drifting behind the grid. */
const GHOST_WORDS = ["form", "light", "space", "render"];

type FilterCategory = "All" | PortfolioItem["category"];

/**
 * Derives the unique, ordered list of filter categories present in the
 * data, always prefixed with "All". Adding a new category in the data
 * file therefore automatically appears as a filter chip.
 */
function useCategories(): FilterCategory[] {
  return useMemo(() => {
    const seen = new Set<FilterCategory>();
    portfolio.forEach((p) => seen.add(p.category));
    return ["All", ...Array.from(seen)];
  }, []);
}

/**
 * The portfolio grid rendered inside the blue stage.
 *
 * Data-driven from data/portfolio.ts — append an item there and it
 * appears here automatically with the correct stagger. Ghost typography
 * fills the negative space with ambient studio vocabulary. A category
 * filter chip row lets visitors focus on a discipline. Clicking a tile
 * opens the detail lightbox (owned by the scene, which also handles
 * deep-linking via `#work-<id>`).
 */
export function PortfolioContent({ visible, handlers }: PortfolioContentProps) {
  const categories = useCategories();
  const [filter, setFilter] = useState<FilterCategory>("All");

  const filtered = useMemo(
    () =>
      filter === "All"
        ? portfolio
        : portfolio.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <div className="th-scroll relative flex h-full w-full flex-col overflow-y-auto p-6 md:p-16">
      {/* Giant watermark word */}
      <div className="pointer-events-none absolute left-0 top-0 flex h-32 w-full items-center justify-center overflow-hidden md:h-40">
        <span className="whitespace-nowrap font-serif text-[18vw] italic text-th-blue-deep/30">
          portfolio
        </span>
      </div>

      {/* Small italic label */}
      <div className="absolute left-1/2 top-5 z-30 -translate-x-1/2 font-serif text-lg italic text-white md:top-6">
        portfolio
      </div>

      {/* Ghost typography — ambient studio vocabulary */}
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center overflow-hidden md:flex">
        {GHOST_WORDS.map((word, i) => (
          <motion.span
            key={word}
            className="absolute select-none font-serif text-[14vw] font-light lowercase text-white/[0.04]"
            style={{
              left: `${15 + i * 22}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Category filter chips */}
      <motion.div
        className="relative z-20 mx-auto mb-5 flex flex-wrap items-center justify-center gap-2 pt-14 md:mb-6 md:pt-16"
        initial={{ opacity: 0, y: -8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: studioEase, delay: 0.4 }}
        role="tablist"
        aria-label="Filter portfolio by category"
      >
        {categories.map((cat) => {
          const isActive = filter === cat;
          const count =
            cat === "All"
              ? portfolio.length
              : portfolio.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(cat)}
              data-cursor="link"
              className="group relative overflow-hidden rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 md:text-[11px]"
            >
              {/* Pill background */}
              <span
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-white"
                    : "bg-white/10 group-hover:bg-white/20"
                }`}
              />
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-th-blue-deep" : "text-white/80"
                }`}
              >
                {cat}
                <span
                  className={`ml-1.5 ${
                    isActive ? "text-th-blue/60" : "text-white/40"
                  }`}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Grid — centered when it fits, scrolls when it doesn't */}
      <motion.div
        layout
        className="relative z-10 my-auto grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <PortfolioTile
              key={item.id}
              item={item}
              index={i}
              visible={visible}
              onOpen={handlers.open}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state (shouldn't happen with current data, but defensive) */}
      {filtered.length === 0 && (
        <p className="relative z-10 py-16 text-center font-serif text-sm italic text-white/60">
          No works in this category yet.
        </p>
      )}

      {/* Caption row */}
      <motion.div
        className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-white/60"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <span className="font-serif text-xs italic">
          {filter === "All"
            ? `${portfolio.length} selected works`
            : `${filtered.length} in ${filter.toLowerCase()}`}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
          click to view
        </span>
      </motion.div>
    </div>
  );
}
