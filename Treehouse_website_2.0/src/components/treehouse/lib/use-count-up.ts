"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animates a number from 0 to `target` when the element
 * enters the viewport. Uses `requestAnimationFrame` with an ease-out-quad
 * curve so the count decelerates naturally. Respects prefers-reduced-motion
 * (jumps to the target instantly).
 *
 * @param target The number to count up to.
 * @param duration Animation duration in ms (default 1600).
 * @returns `[ref, display]` — attach `ref` to the container element; read
 *          `display` for the current animated value (an integer).
 */
export function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setDisplay(target);
      return;
    }

    const startAnimation = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        // ease-out-quad: 1 - (1 - p)^2
        const eased = 1 - (1 - progress) * (1 - progress);
        setDisplay(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Use IntersectionObserver to trigger when visible.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAnimation();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);

    // Fallback: if the element is already visible (e.g. the observer
    // doesn't fire in time), start after a short delay.
    const fallback = setTimeout(() => {
      if (!startedRef.current) {
        startAnimation();
      }
    }, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [target, duration]);

  return { ref, display } as const;
}
