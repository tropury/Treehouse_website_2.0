"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  /** The final render image. */
  after: string;
  /** The wireframe / clay-render "before" image. */
  before: string;
  alt: string;
}

/**
 * BeforeAfterSlider — an interactive image-comparison slider.
 *
 * Reveals the "before" (wireframe) image on the left and the "after"
 * (final render) on the right, with a draggable divider handle. Driven
 * by pointer events so it works with mouse and touch. Keyboard
 * accessible: ←/→ move the handle by 10%, Home/End jump to the ends.
 *
 * Uses `clip-path: inset(...)` on the before layer so both images stay
 * full-bleed and never squish — no DOM measurement required, which
 * avoids hydration mismatches.
 */
export function BeforeAfterSlider({
  after,
  before,
  alt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [updateFromClientX]);

  const startDrag = (e: React.PointerEvent) => {
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 10));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 10));
    } else if (e.key === "Home") {
      setPosition(0);
    } else if (e.key === "End") {
      setPosition(100);
    }
  };

  // clip-path keeps the before image full-bleed and clips its right edge.
  const clipRight = 100 - position;

  return (
    <div
      ref={containerRef}
      className="group relative h-full w-full select-none overflow-hidden"
      onPointerDown={startDrag}
    >
      {/* After (final render) — base layer */}
      <img
        src={after}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-th-charcoal/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-sm">
        Final
      </span>

      {/* Before (wireframe) — clipped to the left of the divider */}
      <img
        src={before}
        alt={`Wireframe — ${alt}`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${clipRight}% 0 0)` }}
        draggable={false}
      />
      {/* Subtle wireframe tint to distinguish the two states */}
      <div
        className="pointer-events-none absolute inset-0 bg-th-blue/5 mix-blend-multiply"
        style={{ clipPath: `inset(0 ${clipRight}% 0 0)` }}
      />
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-th-blue-deep backdrop-blur-sm">
        Wireframe
      </span>

      {/* Divider line + handle */}
      <div
        className="absolute top-0 z-10 h-full w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <button
          type="button"
          aria-label="Drag to compare before and after"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="slider"
          onKeyDown={onKeyDown}
          onPointerDown={startDrag}
          className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-th-charcoal shadow-lg ring-2 ring-th-blue/40 transition-transform duration-200 group-hover:scale-110 focus-visible:outline-none focus-visible:ring-4"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 3 12 9 6" transform="translate(6 0)" />
            <polyline points="15 18 9 12 15 6" transform="translate(6 0)" />
          </svg>
        </button>
      </div>
    </div>
  );
}
