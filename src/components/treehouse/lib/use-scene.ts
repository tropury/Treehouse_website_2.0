"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ViewId } from "../types";
import { views } from "../data/site";

/**
 * Drives the scene state machine.
 *
 * The site is organised around a **menu-first** navigation model (matching
 * the original studio site): the hero hosts a single button that slides up
 * and opens a split menu — portfolio on one side, contact on the other —
 * from which the visitor *chooses* a destination instead of cycling
 * through a sequence.
 *
 * State:
 *  - `view`     — the active scene (hero / portfolio / studio / lab / contact)
 *  - `menuOpen` — whether the split menu overlay is covering the stage
 *
 * `goTo()` jumps to an explicit view (and closes the menu); `next()` /
 * `prev()` remain for keyboard / dots jumps.
 *
 * Keyboard support:
 *  - Space / Enter / ArrowRight → open the menu (the "forward" gesture)
 *  - ArrowLeft → jump to the previous view
 *  - Digits 1-9 → jump directly to a view (1-indexed)
 *  - Esc → close the menu
 *
 * Navigation keys are ignored while the lightbox or the command palette
 * (any `aria-modal` dialog) is open so those components keep control.
 */
export function useScene() {
  const [view, setView] = useState<ViewId>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [direction, setDirection] = useState(1);

  const menuOpenRef = useRef(menuOpen);
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const index = views.findIndex((v) => v.id === view);

  const goTo = useCallback(
    (target: ViewId) => {
      const nextIndex = views.findIndex((v) => v.id === target);
      // Choosing the view we're already on just closes the menu.
      setMenuOpen(false);
      if (nextIndex === -1 || nextIndex === index) return;
      setDirection(nextIndex > index ? 1 : -1);
      setView(target);
    },
    [index],
  );

  const next = useCallback(() => {
    const nextIndex = (index + 1) % views.length;
    setDirection(1);
    setMenuOpen(false);
    setView(views[nextIndex].id);
  }, [index]);

  const prev = useCallback(() => {
    const prevIndex = (index - 1 + views.length) % views.length;
    setDirection(-1);
    setMenuOpen(false);
    setView(views[prevIndex].id);
  }, [index]);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Another modal (lightbox / command palette / shortcuts panel with
      // aria-modal) owns the keyboard — stay out of the way.
      const modalOpen =
        typeof document !== "undefined" &&
        !!document.querySelector("[role='dialog'][aria-modal='true']");

      if (e.key === "Escape") {
        // Close the menu unless a real modal is handling Esc itself.
        if (menuOpenRef.current && !modalOpen) {
          e.preventDefault();
          setMenuOpen(false);
        }
        return;
      }

      if (modalOpen) return;

      // While the menu is open, let Tab / Enter / Space operate natively
      // on the menu controls; digits still jump straight to a view.
      if (menuOpenRef.current) {
        if (/^[1-9]$/.test(e.key)) {
          const idx = Number(e.key) - 1;
          if (idx < views.length && idx !== index) {
            setDirection(idx > index ? 1 : -1);
            setMenuOpen(false);
            setView(views[idx].id);
          }
        }
        return;
      }

      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        // The forward gesture opens the menu (choose, don't cycle).
        setMenuOpen(true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (/^[1-9]$/.test(e.key)) {
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

  return {
    view,
    direction,
    index,
    next,
    prev,
    goTo,
    menuOpen,
    openMenu,
    closeMenu,
    total: views.length,
  };
}
