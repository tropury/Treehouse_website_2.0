"use client";

import { useEffect, useState } from "react";

/**
 * useScrollProgress — tracks the scroll position of a scrollable element
 * as a 0–1 value. Used by the scroll-position indicator that appears on
 * long scrollable panels (portfolio, studio, lab, contact).
 *
 * @param el The scrollable element to observe (or null).
 * @returns A 0–1 number (0 = at top, 1 = at bottom).
 */
export function useScrollProgress(el: HTMLElement | null): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!el) return;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [el]);

  return progress;
}
