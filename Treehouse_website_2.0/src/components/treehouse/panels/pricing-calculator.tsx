"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign } from "lucide-react";
import { studioEase } from "../lib/motion";

/**
 * PricingCalculator — a real-time scope estimator.
 *
 * Deres a price range + timeline estimate from the selected service,
 * budget band, and timeline. The figures are illustrative starting
 * points (not quotes) — they build trust by being transparent and
 * filter out tire-kickers early.
 */

/** Per-service base price (low, high) in USD. */
const SERVICE_BASE: Record<string, [number, number]> = {
  "Architectural Visualization": [2500, 6000],
  "Interior Visualization": [2000, 5000],
  "Concept Art": [1500, 4000],
  Animation: [4000, 12000],
  Other: [1500, 5000],
};

/** Budget-band multipliers. */
const BUDGET_MULT: Record<string, number> = {
  "< $5k": 0.8,
  "$5k – $15k": 1,
  "$15k – $40k": 1.4,
  "$40k+": 1.9,
};

/** Timeline → estimated delivery in weeks. */
const TIMELINE_WEEKS: Record<string, [number, number]> = {
  ASAP: [1, 2],
  "1–3 months": [2, 4],
  "3+ months": [4, 8],
  Flexible: [3, 6],
};

interface PricingCalculatorProps {
  service: string;
  budget: string;
  timeline: string;
}

/** Format a USD value with thousands separators. */
function usd(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function PricingCalculator({
  service,
  budget,
  timeline,
}: PricingCalculatorProps) {
  const estimate = useMemo(() => {
    if (!service) return null;
    const base = SERVICE_BASE[service] ?? [1500, 5000];
    const mult = budget ? (BUDGET_MULT[budget] ?? 1) : 1;
    const weeks = timeline
      ? (TIMELINE_WEEKS[timeline] ?? [2, 6])
      : [2, 6];
    return {
      low: Math.round(base[0] * mult),
      high: Math.round(base[1] * mult),
      weeksLow: weeks[0],
      weeksHigh: weeks[1],
    };
  }, [service, budget, timeline]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-th-blue/20 to-th-blue/5 p-4 ring-1 ring-th-blue/30"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: studioEase }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
          Estimated scope
        </span>
        <span className="font-mono text-[8px] uppercase tracking-wider text-white/30">
          Illustrative
        </span>
      </div>

      {estimate ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-th-blue-soft" />
            <div>
              <div className="font-serif text-lg font-bold leading-none text-white">
                {usd(estimate.low)}
                <span className="mx-0.5 text-white/40">–</span>
                {usd(estimate.high)}
              </div>
              <div className="mt-1 font-mono text-[8px] uppercase tracking-wider text-white/40">
                Price range
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-th-blue-soft" />
            <div>
              <div className="font-serif text-lg font-bold leading-none text-white">
                {estimate.weeksLow}
                <span className="mx-0.5 text-white/40">–</span>
                {estimate.weeksHigh}
                <span className="ml-1 text-sm text-white/60">wks</span>
              </div>
              <div className="mt-1 font-mono text-[8px] uppercase tracking-wider text-white/40">
                Delivery
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="font-serif text-xs italic text-white/40">
          Pick a service to see an estimated price range and timeline.
        </p>
      )}

      <p className="mt-3 font-mono text-[8px] leading-relaxed tracking-wider text-white/30">
        Estimates are illustrative starting points, not quotes. Final scope is
        confirmed in the brief.
      </p>
    </motion.div>
  );
}
