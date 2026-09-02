"use client";

import { useEffect } from "react";
import { portfolio } from "../data/portfolio";
import { views } from "../data/site";
import type { ViewId } from "../types";

interface UseDeepLinkOptions {
  /** Navigate to a given view. */
  goTo: (view: ViewId) => void;
  /** Open a portfolio item in the lightbox. */
  openWork: (id: string) => void;
  /** Close the lightbox. */
  closeWork: () => void;
}

/**
 * useDeepLink — syncs the URL hash with the portfolio lightbox.
 *
 * On mount and on `hashchange`, if the hash matches `#work-<id>` for a
 * known portfolio item, the hook navigates to the portfolio view and
 * opens that item in the lightbox. This makes project URLs shareable
 * (e.g. `https://site/#work-concrete-house` opens straight to that
 * project's detail).
 *
 * Lives at the scene level (not inside the portfolio content) so it can
 * trigger a view-switch when the portfolio isn't yet mounted.
 */
export function useDeepLink({ goTo, openWork, closeWork }: UseDeepLinkOptions) {
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash;
      const m = h.match(/^#work-(.+)$/);
      if (!m) {
        closeWork();
        return;
      }
      const id = m[1];
      const item = portfolio.find((p) => p.id === id);
      if (item) {
        // Make sure we're on the portfolio view so the lightbox mounts.
        goTo("portfolio");
        openWork(id);
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [goTo, openWork, closeWork]);
}

/** Read the work id from the current hash, if any. */
export function readWorkHash(): string | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/^#work-(.+)$/);
  return m ? m[1] : null;
}

/** The list of view ids, re-exported for convenience. */
export { views };
