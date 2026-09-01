"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * MagneticCursor — a premium custom cursor.
 *
 * Renders a small dot that follows the pointer instantly, plus a larger
 * ring that trails with spring physics. The ring expands and labels the
 * target when hovering interactive elements (links, buttons, tiles).
 *
 * Hidden on touch devices and when the user prefers reduced motion.
 */
export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "link" | "view">(
    "default",
  );
  const [label, setLabel] = useState("");

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 500, damping: 40, mass: 0.4 });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on devices with a precise pointer.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      });

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], [data-cursor]',
      ) as HTMLElement | null;

      if (interactive) {
        const cursorAttr = interactive.getAttribute("data-cursor");
        if (cursorAttr === "view") {
          setVariant("view");
          setLabel(interactive.getAttribute("data-cursor-label") || "view");
        } else {
          setVariant("link");
          setLabel(interactive.getAttribute("data-cursor-label") || "");
        }
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    const leave = () => {
      dotX.set(-100);
      dotY.set(-100);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  const ringSize = variant === "view" ? 72 : variant === "link" ? 56 : 32;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      aria-hidden="true"
    >
      {/* Trailing ring */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full border border-th-blue/70 backdrop-invert-0"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor:
            variant === "view"
              ? "rgba(37,99,235,0.18)"
              : variant === "link"
                ? "rgba(37,99,235,0.10)"
                : "rgba(37,99,235,0)",
          borderColor:
            variant === "default"
              ? "rgba(37,99,235,0.35)"
              : "rgba(37,99,235,0.9)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {label && (
          <span className="select-none font-serif text-[9px] uppercase tracking-[0.2em] text-th-blue">
            {label}
          </span>
        )}
      </motion.div>

      {/* Precise dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-th-blue"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: variant === "default" ? 1 : 0 }}
      />
    </div>
  );
}
