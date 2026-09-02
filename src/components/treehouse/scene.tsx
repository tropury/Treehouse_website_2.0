"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useScene } from "./lib/use-scene";
import { useDeepLink } from "./lib/use-deep-link";
import { DarkPanel } from "./panels/dark-panel";
import { HeroPanel } from "./panels/hero-panel";
import { BlueStage } from "./panels/blue-stage";
import { HubButton } from "./hub-button";
import { MenuOverlay } from "./menu-overlay";
import { MagneticCursor } from "./magnetic-cursor";
import { PageIntro } from "./page-intro";
import { ViewProgress } from "./view-progress";
import { StatusTicker } from "./status-ticker";
import { ScrollProgressIndicator } from "./scroll-progress-indicator";
import { CookieConsent } from "./cookie-consent";
import { CommandPalette } from "./command-palette";
import { BackToTop } from "./back-to-top";
import { PortfolioLightbox } from "./panels/portfolio-lightbox";
import { portfolio } from "./data/portfolio";
import type { PortfolioItem } from "./types";

/**
 * The TreeHouse scene.
 *
 * Composes the split-screen hero (dark + white panels), the expanding
 * blue stage (portfolio / studio / lab / contact), the menu-first
 * navigation (a hub button that slides up and opens the split menu —
 * portfolio on one side, contact on the other, like the original
 * studio site), the custom cursor, a one-time page intro, and the
 * portfolio detail lightbox into a single cohesive, keyboard-accessible
 * experience.
 *
 * The lightbox state lives here (not inside the portfolio content) so
 * that deep links (`#work-<id>`) can open it even when the visitor
 * lands on the hero view — the scene switches to the portfolio view
 * and opens the item.
 *
 * Layout: a full-height flex column — `main` flexes to fill the
 * viewport, hosting the absolutely-positioned panels. There is no
 * footer bar; the status ticker is the only strip beneath the stage.
 */
export function TreeHouseScene() {
  const { view, goTo, menuOpen, openMenu, closeMenu } = useScene();
  const isHero = view === "hero";

  // Portfolio lightbox state — owned by the scene so deep links work.
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const openWorkById = useCallback((id: string) => {
    const item = portfolio.find((p) => p.id === id);
    if (item) {
      setActiveItem(item);
      syncHash(id);
    }
  }, []);

  const openWork = useCallback((item: PortfolioItem) => {
    setActiveItem(item);
    syncHash(item.id);
  }, []);

  const closeWork = useCallback(() => {
    setActiveItem(null);
    syncHash(null);
  }, []);

  const navigateWork = useCallback((direction: 1 | -1) => {
    setActiveItem((current) => {
      if (!current) return current;
      const idx = portfolio.findIndex((p) => p.id === current.id);
      const nextIdx = (idx + direction + portfolio.length) % portfolio.length;
      const nextItem = portfolio[nextIdx];
      syncHash(nextItem.id);
      return nextItem;
    });
  }, []);

  // Wire up deep links (#work-<id>).
  useDeepLink({ goTo, openWork: openWorkById, closeWork });

  // Warm the browser cache for the four works the menu previews show.
  // They download+decode while the visitor reads the hero (during idle),
  // so the menu panel animation never competes with image work.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const warm = () => {
      portfolio.slice(0, 4).forEach((p) => {
        if (!p.image) return;
        const img = new Image();
        img.decoding = "async";
        img.src = p.image;
      });
    };
    if (typeof w.requestIdleCallback === "function") {
      const handle = w.requestIdleCallback(warm, { timeout: 3500 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const t = setTimeout(warm, 1200);
    return () => clearTimeout(t);
  }, []);

  // Pass open/navigate down to the portfolio content via context-like props.
  const portfolioHandlers = useMemo(
    () => ({ open: openWork, close: closeWork, navigate: navigateWork }),
    [openWork, closeWork, navigateWork],
  );

  return (
    <div className="relative flex min-h-dvh flex-col bg-white font-sans text-zinc-800 selection:bg-th-blue/20">
      {/* View-transition progress bar */}
      <ViewProgress view={view} />

      {/* One-time intro curtain */}
      <PageIntro />

      {/* Custom magnetic cursor (desktop only) */}
      <MagneticCursor />

      {/* Scroll-position indicator for long panels */}
      <ScrollProgressIndicator />

      {/* Back-to-top button (appears when scrolling long panels) */}
      <BackToTop />

      <main className="relative flex-1 overflow-hidden">
        {/* Split-screen hero layers (hidden when blue stage takes over) */}
        <DarkPanel active={isHero} />
        <HeroPanel active={isHero} />

        {/* Expanding blue stage hosting portfolio / studio / lab / contact */}
        <BlueStage
          view={view}
          portfolioHandlers={portfolioHandlers}
          onHome={() => goTo("hero")}
        />

        {/* Split menu — portfolio on one side, contact on the other */}
        <MenuOverlay
          open={menuOpen}
          view={view}
          onChoose={goTo}
          onClose={closeMenu}
          onHome={() => goTo("hero")}
        />

        {/* The hub ball — slides up from the hero, parks right in views */}
        <HubButton
          menuOpen={menuOpen}
          isHero={isHero}
          view={view}
          onToggle={menuOpen ? closeMenu : openMenu}
          onGoTo={goTo}
        />
      </main>

      {/* Portfolio detail lightbox — owned by the scene for deep-link support */}
      <PortfolioLightbox
        item={activeItem}
        onClose={closeWork}
        onNavigate={navigateWork}
      />

      {/* Command palette (Cmd+K / Ctrl+K) */}
      <CommandPalette goTo={goTo} openWork={openWork} />

      {/* Ambient "studio is alive" status ticker */}
      <StatusTicker />

      {/* Cookie consent banner (first visit only) */}
      <CookieConsent />
    </div>
  );
}

/** Keep the URL hash in sync with the active work (or clear it). */
function syncHash(id: string | null) {
  if (typeof window === "undefined") return;
  const desired = id ? `#work-${id}` : "";
  if (window.location.hash !== desired) {
    const url = `${window.location.pathname}${window.location.search}${desired}`;
    window.history.replaceState(null, "", url);
  }
}
