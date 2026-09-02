"use client";

import { useCallback, useEffect, useState } from "react";
import type { ViewId } from "../types";
import { views } from "../data/site";

/**
 * Drives the scene state machine.
 *
 * The site cycles through an ordered list of views (defined in data/site.ts).
 * `next()` advances and wraps; `goTo()` jumps to an explicit view.
 *
 * Keyboard support:
 *  - Space / Enter / ArrowRight → advance
 *  - ArrowLeft → back
 *  - Digits 1-9 → jump directly to a view (1-indexed)
 *
 * Navigation keys are ignored while a modal dialog is open so that the
 * lightbox's own ←/→ handler stays in control.
 */
export function useScene() {
  const [view, setView] = useState<ViewId>("hero");
  const [direction, setDirection] = useState(1);

  const index = views.findIndex((v) => v.id === view);

  const goTo = useCallback(
    (target: ViewId) => {
      const nextIndex = views.findIndex((v) => v.id === target);
      if (nextIndex === -1 || nextIndex === index) return;
      setDirection(nextIndex > index ? 1 : -1);
      setView(target);
    },
    [index],
  );

  const next = useCallback(() => {
    const nextIndex = (index + 1) % views.length;
    setDirection(1);
    setView(views[nextIndex].id);
  }, [index]);

  const prev = useCallback(() => {
    const prevIndex = (index - 1 + views.length) % views.length;
    setDirection(-1);
    setView(views[prevIndex].id);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Skip scene nav when a modal dialog is open (lightbox owns ←/→/Esc).
      const dialogOpen =
        typeof document !== "undefined" &&
        !!document.querySelector("[role='dialog'][aria-modal='true']");

      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        if (dialogOpen) return;
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        if (dialogOpen) return;
        e.preventDefault();
        prev();
      } else if (/^[1-9]$/.test(e.key)) {
        if (dialogOpen) return;
        const idx = Number(e.key) - 1;
        if (idx < views.length && idx !== index) {
          setDirection(idx > index ? 1 : -1);
          setView(views[idx].id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, index]);

  return { view, direction, index, next, prev, goTo, total: views.length };
}
