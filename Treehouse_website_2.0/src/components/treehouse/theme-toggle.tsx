"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { studioEase } from "./lib/motion";

/**
 * ThemeToggle — a light/dark mode switch.
 *
 * Sits in the top-right corner (just left of the sound toggle) and
 * swaps the `dark` class on `<html>` via `next-themes`. The preference
 * is persisted in localStorage by next-themes. Renders a sun icon in
 * dark mode (to switch to light) and a moon icon in light mode.
 *
 * Mounted-only rendering avoids hydration mismatches (the theme is
 * unknown on the server).
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder keeps layout stable before hydration.
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor="link"
      className="group fixed right-17 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/70 bg-white/70 text-zinc-600 backdrop-blur-md transition-colors duration-300 hover:border-th-blue hover:text-th-blue md:right-[4.5rem] md:top-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.9 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: studioEase }}
        className="block"
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </motion.span>
    </motion.button>
  );
}
