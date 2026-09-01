"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ArrowRight,
  Eye,
  Home,
  Layers,
  Mail,
  Moon,
  Sparkles,
  Sun,
  Volume2,
} from "lucide-react";
import { views } from "./data/site";
import { portfolio } from "./data/portfolio";
import type { PortfolioItem, ViewId } from "./types";

interface CommandPaletteProps {
  /** Navigate to a view. */
  goTo: (view: ViewId) => void;
  /** Open a portfolio item in the lightbox. */
  openWork: (item: PortfolioItem) => void;
}

/**
 * CommandPalette — a Cmd+K / Ctrl+K power-user launcher.
 *
 * Opens a modal with fuzzy search across views, portfolio works, and
 * quick actions (toggle theme, toggle sound, back to hero). Selecting
 * a result navigates or triggers the action. Pairs naturally with the
 * existing keyboard-hints legend.
 *
 * Triggered by Cmd+K (macOS) / Ctrl+K (other).
 */
export function CommandPalette({ goTo, openWork }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Global Cmd+K / Ctrl+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    // Defer so the dialog closes before the action runs.
    setTimeout(fn, 50);
  }, []);

  const toggleTheme = () => {
    const isDark = (resolvedTheme ?? theme) === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  const toggleSound = () => {
    window.dispatchEvent(new CustomEvent("th-toggle-sound"));
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="TreeHouse command palette"
      description="Search views, works, and actions."
    >
      <CommandInput placeholder="Search views, works, actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        {/* Views */}
        <CommandGroup heading="Views">
          {views.map((v) => (
            <CommandItem
              key={v.id}
              value={`${v.label} ${v.id} ${v.description}`}
              onSelect={() => run(() => goTo(v.id))}
            >
              {v.id === "hero" ? (
                <Home className="h-4 w-4 text-zinc-400" />
              ) : v.id === "portfolio" ? (
                <Layers className="h-4 w-4 text-zinc-400" />
              ) : v.id === "contact" ? (
                <Mail className="h-4 w-4 text-zinc-400" />
              ) : (
                <Sparkles className="h-4 w-4 text-zinc-400" />
              )}
              <span className="capitalize">{v.label}</span>
              <CommandShortcut>{v.description}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Portfolio works */}
        <CommandGroup heading="Portfolio">
          {portfolio.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.title} ${item.category} ${item.year ?? ""}`}
              onSelect={() => run(() => openWork(item))}
            >
              <Eye className="h-4 w-4 text-zinc-400" />
              <span>{item.title}</span>
              <CommandShortcut>
                {item.category} · {item.year}
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            value="toggle theme dark light mode"
            onSelect={() => run(toggleTheme)}
          >
            <Sun className="h-4 w-4 text-zinc-400" />
            <span>Toggle theme</span>
            <CommandShortcut>Theme</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="toggle sound ambient audio mute"
            onSelect={() => run(toggleSound)}
          >
            <Volume2 className="h-4 w-4 text-zinc-400" />
            <span>Toggle ambient sound</span>
            <CommandShortcut>Sound</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="back to home hero studio start"
            onSelect={() => run(() => goTo("hero"))}
          >
            <ArrowRight className="h-4 w-4 text-zinc-400" />
            <span>Back to studio intro</span>
            <CommandShortcut>Home</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Keep Moon imported for tree-shaking friendliness (unused in render).
export { Moon };
