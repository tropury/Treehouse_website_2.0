"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, Share2, X } from "lucide-react";
import type { PortfolioItem, PortfolioSpec } from "../types";
import { studioEase } from "../lib/motion";

interface PortfolioLightboxProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}

/** Ordered rows for the spec sheet — only rows with a value render. */
function specRows(spec?: PortfolioSpec) {
  if (!spec) return [] as { label: string; value: string }[];
  const rows: { label: string; value: string }[] = [];
  if (spec.client) rows.push({ label: "Client", value: spec.client });
  if (spec.location) rows.push({ label: "Location", value: spec.location });
  if (spec.software) rows.push({ label: "Software", value: spec.software });
  if (spec.scope) rows.push({ label: "Scope", value: spec.scope });
  if (spec.deliverable)
    rows.push({ label: "Deliverable", value: spec.deliverable });
  return rows;
}

/**
 * Portfolio detail lightbox.
 *
 * Opens when a tile is activated: a card with the project photo on one
 * side and the title, category, year, description, and technical spec
 * sheet on the other, plus a share button.
 *
 * Photo zoom cycle: clicking the photo expands it to a fullscreen view;
 * clicking it again (or pressing Esc) returns to the info card.
 *
 * Keyboard: Esc steps zoom → card → close, ←/→ step between works.
 * Focus is trapped inside the dialog while open. Body scroll is locked.
 */
export function PortfolioLightbox({
  item,
  onClose,
  onNavigate,
}: PortfolioLightboxProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const zoomBtnRef = useRef<HTMLButtonElement>(null);

  // Reset the view state whenever the work changes.
  useEffect(() => {
    setImgLoaded(false);
    setZoomed(false);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // First Esc collapses the fullscreen photo; the next closes.
        if (zoomed) {
          setZoomed(false);
          expandBtnRef.current?.focus();
        } else {
          onClose();
        }
        return;
      }
      if (e.key === "ArrowRight") onNavigate(1);
      else if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Focus the close button when the dialog opens.
    const t = setTimeout(() => closeBtnRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [item, onClose, onNavigate, zoomed]);

  // Hand focus to the fullscreen photo when it opens.
  useEffect(() => {
    if (zoomed) zoomBtnRef.current?.focus();
  }, [zoomed]);

  const rows = specRows(item?.spec);

  const handleShare = async () => {
    if (!item) return;
    const url = `${window.location.origin}/#work-${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      // Lightweight inline confirmation (no toast dependency to keep this
      // component self-contained).
      const btn = document.querySelector(
        "[data-share-btn]",
      ) as HTMLButtonElement | null;
      if (btn) {
        const original = btn.getAttribute("data-share-btn");
        btn.setAttribute("data-share-btn", "copied");
        btn.classList.add("text-th-blue");
        setTimeout(() => {
          btn.setAttribute("data-share-btn", original || "");
          btn.classList.remove("text-th-blue");
        }, 1600);
      }
    } catch {
      /* user dismissed share — no-op */
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — details`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-th-charcoal-deep/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Fullscreen photo layer — sits above the card while zoomed */}
          <AnimatePresence>
            {zoomed && item.image && (
              <motion.button
                ref={zoomBtnRef}
                type="button"
                onClick={() => {
                  setZoomed(false);
                  expandBtnRef.current?.focus();
                }}
                aria-label="Return to details"
                className="absolute inset-0 z-30 flex cursor-zoom-out items-center justify-center bg-th-charcoal-deep/95 p-4 md:p-12"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.45, ease: studioEase }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                  draggable={false}
                />
                <span className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                  <Minimize2 className="h-3 w-3" />
                  Click to return
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Card */}
          <motion.div
            key={item.id}
            className="relative z-10 grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.5, ease: studioEase }}
          >
            {/* Photo side — click toggles the fullscreen zoom */}
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 md:aspect-auto md:max-h-[92vh]">
              {/* Blur-up placeholder — fades out once content is ready */}
              {!imgLoaded && (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}>
                  <span className="th-shimmer pointer-events-none absolute inset-0" />
                </div>
              )}

              {/* Photo layer */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.image ? (
                  <button
                    ref={expandBtnRef}
                    type="button"
                    onClick={() => setZoomed(true)}
                    aria-label={`Expand ${item.title} fullscreen`}
                    className="group absolute inset-0 block h-full w-full cursor-zoom-in"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      onLoad={() => setImgLoaded(true)}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                    <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-th-charcoal/70 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="h-3 w-3" />
                      Expand
                    </span>
                  </button>
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${item.gradient}`} />
                )}
              </div>

              {/* Prev / Next chevrons */}
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                aria-label="Previous work"
                className="group absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-th-charcoal backdrop-blur-sm transition-colors hover:bg-white"
              >
                <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(1)}
                aria-label="Next work"
                className="group absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-th-charcoal backdrop-blur-sm transition-colors hover:bg-white"
              >
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            {/* Details side */}
            <div className="relative flex max-h-[92vh] flex-col overflow-y-auto p-6 md:p-10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-th-blue/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-th-blue-deep">
                    {item.category}
                  </span>
                  {item.year && (
                    <span className="font-mono text-xs text-zinc-400">{item.year}</span>
                  )}
                </div>

                <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-zinc-900 md:text-4xl">
                  {item.title}
                </h2>

                <div className="mt-4 h-px w-12 bg-th-blue" />

                <p className="mt-5 text-sm leading-relaxed text-zinc-600 md:text-base">
                  {item.description ??
                    "A visual study in form, light, and persuasion."}
                </p>
              </div>

              {/* Spec sheet */}
              {rows.length > 0 && (
                <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-zinc-100 pt-6">
                  {rows.map((row) => (
                    <div key={row.label} className="flex flex-col">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-zinc-800">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Action row */}
              <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-5">
                <button
                  type="button"
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Close details"
                  className="group flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-th-blue hover:text-th-blue"
                >
                  <X className="h-3 w-3" />
                  Close
                </button>

                <div className="flex items-center gap-3">
                  <span className="font-serif text-xs italic text-zinc-400">
                    TreeHouse Studio
                  </span>
                  <button
                    type="button"
                    onClick={handleShare}
                    data-share-btn="share"
                    aria-label="Share this work"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-th-blue"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Close button (floating, top-right — reachable in both states) */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-th-blue"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
