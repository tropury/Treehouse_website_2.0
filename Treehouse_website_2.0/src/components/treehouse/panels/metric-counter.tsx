"use client";

import type { StudioMetric } from "../types";
import { useCountUp } from "../lib/use-count-up";

/**
 * MetricCounter — a single studio metric with a count-up animation.
 *
 * Counts from 0 to `target` when the element enters the viewport, then
 * appends the `suffix`. Falls back to the static `value` string if no
 * numeric target is defined. Respects prefers-reduced-motion.
 */
export function MetricCounter({ metric }: { metric: StudioMetric }) {
  const { ref, display } = useCountUp(metric.target ?? 0);

  return (
    <div className="text-center md:text-left">
      <div
        className="font-serif text-2xl font-bold text-white md:text-4xl"
        aria-label={metric.value}
      >
        {metric.target !== undefined ? (
          <span ref={ref}>
            {display}
            {metric.suffix ?? ""}
          </span>
        ) : (
          metric.value
        )}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        {metric.label}
      </div>
    </div>
  );
}
