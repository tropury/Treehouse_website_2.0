"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Sparkles, X } from "lucide-react";
import {
  matchArchetype,
  moodTokens,
  type MoodToken,
} from "../data/mood-board";
import { portfolio } from "../data/portfolio";
import { fadeUp, studioEase } from "../lib/motion";
import { NewsletterSignup } from "../newsletter-signup";

interface LabContentProps {
  visible: boolean;
}

/** A draggable token chip (also click-to-toggle for accessibility). */
function TokenChip({
  token,
  dimmed,
  onToggle,
  isSelected,
}: {
  token: MoodToken;
  dimmed?: boolean;
  onToggle: (token: MoodToken) => void;
  isSelected: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: token.id,
  });
  return (
    <button
      type="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-cursor="link"
      onClick={() => onToggle(token)}
      className={`relative flex select-none items-center gap-2 rounded-full bg-gradient-to-br ${token.gradient} px-3.5 py-2 text-left shadow-md ring-1 ring-white/30 transition-all ${
        isDragging
          ? "opacity-30"
          : isSelected
            ? "opacity-50 ring-2 ring-white/80"
            : dimmed
              ? "opacity-40"
              : "opacity-100 hover:scale-105"
      }`}
      aria-label={`${token.label} — ${token.note}${isSelected ? " (selected)" : ""}`}
      aria-pressed={isSelected}
    >
      <span className="text-xs font-bold uppercase tracking-wide text-zinc-800 drop-shadow-sm">
        {token.label}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700/70">
        {token.note}
      </span>
    </button>
  );
}

/**
 * The "lab" view — an interactive mood-board generator.
 *
 * Visitors drag material + style tokens into a drop zone; the studio
 * then names the resulting aesthetic (Warm Minimalism, Brutalist Edge,
 * Crisp Modern, or Refined Luxury) and suggests matching works from the
 * portfolio. A playful lead-qualification tool.
 */
export function LabContent({ visible }: LabContentProps) {
  const [selected, setSelected] = useState<MoodToken[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const { setNodeRef, isOver } = useDroppable({ id: "dropzone" });
  const activeToken = activeId
    ? moodTokens.find((t) => t.id === activeId) ?? null
    : null;

  const selectedIds = useMemo(
    () => new Set(selected.map((t) => t.id)),
    [selected],
  );
  const match = useMemo(() => matchArchetype(selected), [selected]);

  const matchingWorks = useMemo(() => {
    if (!match) return [];
    // Suggest a few portfolio works whose category loosely aligns.
    const byCategory: Record<string, string[]> = {
      "warm-minimal": ["Interior", "Concept"],
      brutalist: ["Architecture", "Exterior"],
      "modern-glass": ["Architecture", "Exterior"],
      "refined-luxury": ["Interior", "Render"],
    };
    const cats = byCategory[match.archetype.id] ?? [];
    return portfolio.filter((p) => cats.includes(p.category)).slice(0, 3);
  }, [match]);

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const id = String(e.active.id);
    if (e.over && e.over.id === "dropzone") {
      setSelected((cur) => {
        if (cur.some((t) => t.id === id)) return cur;
        const token = moodTokens.find((t) => t.id === id);
        return token ? [...cur, token] : cur;
      });
    }
  };

  const removeToken = (id: string) =>
    setSelected((cur) => cur.filter((t) => t.id !== id));
  const clearAll = () => setSelected([]);

  /** Click-to-toggle: add a token if not selected, remove if it is. */
  const toggleToken = (token: MoodToken) => {
    setSelected((cur) =>
      cur.some((t) => t.id === token.id)
        ? cur.filter((t) => t.id !== token.id)
        : [...cur, token],
    );
  };

  const materials = moodTokens.filter((t) => t.kind === "material");
  const styles = moodTokens.filter((t) => t.kind === "style");

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="th-scroll relative h-full w-full overflow-y-auto px-6 pb-28 pt-12 md:px-16 md:pt-16">
        {/* Section label */}
        <motion.div
          className="mb-3 flex items-baseline gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: studioEase, delay: 0.2 }}
        >
          <span className="font-serif text-lg italic text-white md:text-xl">
            lab
          </span>
          <span className="h-px flex-1 bg-white/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            04 — Mood Board
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="max-w-2xl font-serif text-2xl font-bold leading-tight text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: studioEase, delay: 0.35 }}
        >
          Build your mood. Find your aesthetic.
        </motion.h2>
        <motion.p
          className="mt-2 max-w-xl text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          Drag materials and styles into the frame — we&apos;ll name the vibe
          and suggest matching work.
        </motion.p>

        {/* Two-column: token tray + drop zone */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Token tray */}
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                Materials
              </h3>
              <div className="flex flex-wrap gap-2">
                {materials.map((t) => (
                  <TokenChip
                    key={t.id}
                    token={t}
                    dimmed={selectedIds.has(t.id)}
                    isSelected={selectedIds.has(t.id)}
                    onToggle={toggleToken}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                Styles
              </h3>
              <div className="flex flex-wrap gap-2">
                {styles.map((t) => (
                  <TokenChip
                    key={t.id}
                    token={t}
                    dimmed={selectedIds.has(t.id)}
                    isSelected={selectedIds.has(t.id)}
                    onToggle={toggleToken}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            ref={setNodeRef}
            className={`relative flex min-h-[280px] flex-col rounded-3xl border-2 border-dashed p-5 transition-colors duration-300 ${
              isOver
                ? "border-white/70 bg-white/10"
                : "border-white/20 bg-white/5"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                Your mood board
              </span>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-white/50 transition-colors hover:text-white"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            {selected.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Sparkles className="mb-3 h-6 w-6 text-white/30" />
                <p className="font-serif text-sm italic text-white/50">
                  Drag tokens here to compose your mood.
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap content-start gap-2">
                <AnimatePresence>
                  {selected.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: studioEase }}
                      className={`group relative flex items-center gap-1.5 rounded-full bg-gradient-to-br ${t.gradient} py-1.5 pl-3 pr-7 text-zinc-800 shadow-md`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {t.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeToken(t.id)}
                        aria-label={`Remove ${t.label}`}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-black/15 text-zinc-800 transition-colors hover:bg-black/30"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Result */}
            <AnimatePresence>
              {match && (
                <motion.div
                  key={match.archetype.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-4 rounded-2xl bg-white/95 p-4 text-zinc-800 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-th-blue" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                      Your aesthetic
                    </span>
                  </div>
                  <h4 className="mt-1 font-serif text-xl font-bold text-th-blue-deep">
                    {match.archetype.name}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                    {match.archetype.description}
                  </p>

                  {matchingWorks.length > 0 && (
                    <div className="mt-3 border-t border-zinc-100 pt-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                        Matching work
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {matchingWorks.map((w) => (
                          <span
                            key={w.id}
                            className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-700"
                          >
                            {w.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Newsletter signup — appears once tokens are selected */}
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: studioEase }}
                  className="mt-4"
                >
                  <NewsletterSignup
                    variant="card"
                    mood={selected.map((t) => t.label).join(", ")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Drag overlay — floats with the cursor while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeToken ? (
          <div
            className={`flex items-center gap-2 rounded-full bg-gradient-to-br ${activeToken.gradient} px-3.5 py-2 shadow-2xl ring-2 ring-white/50`}
          >
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-800">
              {activeToken.label}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
