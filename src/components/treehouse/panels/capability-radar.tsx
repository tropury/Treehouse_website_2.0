"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { studioCapabilities } from "../data/studio";
import { studioEase } from "../lib/motion";

interface CapabilityRadarProps {
  visible: boolean;
}

/**
 * Studio capability radar chart.
 *
 * An interactive data-visualisation of the studio's disciplines, drawn
 * with recharts. The polygon animates in (opacity + scale) when the
 * studio view becomes visible, and each axis label is tappable to
 * reveal its note in a caption below. A custom animated SVG "draw-in"
 * ring sits behind the chart — concentric pentagons that stroke-draw
 * themselves on entry for a premium, kinetic data-viz feel.
 */
export function CapabilityRadar({ visible }: CapabilityRadarProps) {
  const data = studioCapabilities.map((c) => ({
    capability: c.label,
    score: c.score,
    note: c.note,
  }));

  // Geometry for the decorative draw-in ring (5 axes → pentagon).
  const N = studioCapabilities.length;
  const cx = 100;
  const cy = 100;
  const rings = [0.28, 0.5, 0.72, 0.95];
  const angleStep = (Math.PI * 2) / N;
  const startAngle = -Math.PI / 2;

  const pointAt = (i: number, r: number) => {
    const a = startAngle + i * angleStep;
    return [cx + Math.cos(a) * r * 100, cy + Math.sin(a) * r * 100];
  };

  const ringPath = (r: number) =>
    Array.from({ length: N }, (_, i) => {
      const [x, y] = pointAt(i, r);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z";

  const spokePath = (i: number) => {
    const [x, y] = pointAt(i, 0.95);
    return `M${cx},${cy} L${x.toFixed(1)},${y.toFixed(1)}`;
  };

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: studioEase, delay: 0.5 }}
    >
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 lg:flex-col lg:items-stretch">
        {/* Chart */}
        <div className="relative mx-auto h-56 w-56 shrink-0 p-2 md:h-64 md:w-64 lg:h-60 lg:w-full lg:max-w-sm">
          {/* Decorative draw-in ring (behind the recharts chart) */}
          <svg
            viewBox="0 0 200 200"
            className="pointer-events-none absolute inset-0 h-full w-full p-2"
            aria-hidden="true"
          >
            {/* Concentric pentagons */}
            {rings.map((r, i) => (
              <motion.path
                key={`ring-${r}`}
                d={ringPath(r)}
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={0.6}
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  visible
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  duration: 1.1,
                  ease: studioEase,
                  delay: 0.5 + i * 0.12,
                }}
              />
            ))}
            {/* Spokes */}
            {Array.from({ length: N }, (_, i) => (
              <motion.path
                key={`spoke-${i}`}
                d={spokePath(i)}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.4}
                initial={{ pathLength: 0 }}
                animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{
                  duration: 0.7,
                  ease: studioEase,
                  delay: 0.6 + i * 0.06,
                }}
              />
            ))}
          </svg>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              outerRadius="62%"
              className="[&_.recharts-polar-grid-angle-line]:stroke-transparent [&_.recharts-polar-grid-concentric-polygon]:stroke-transparent [&_.recharts-polar-radius-axis-tick-value]:fill-white/30"
            >
              {/* Hide the built-in grid — the decorative SVG above replaces it */}
              <PolarGrid stroke="transparent" />
              <PolarAngleAxis
                dataKey="capability"
                tick={{
                  fill: "rgba(255,255,255,0.75)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase" as const,
                }}
                stroke="rgba(255,255,255,0.2)"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 8,
                }}
                tickCount={5}
                axisLine={false}
              />
              <Radar
                name="Capability"
                dataKey="score"
                stroke="#ffffff"
                strokeWidth={1.5}
                fill="rgba(255,255,255,0.22)"
                fillOpacity={1}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
                dot={{
                  r: 3,
                  fill: "#ffffff",
                  stroke: "rgba(37,99,235,0.9)",
                  strokeWidth: 1.5,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / capability list */}
        <ul className="flex w-full flex-col gap-1.5">
          {studioCapabilities.map((c, i) => (
            <motion.li
              key={c.id}
              className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-1.5"
              initial={{ opacity: 0, x: 12 }}
              animate={
                visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }
              }
              transition={{
                duration: 0.5,
                ease: studioEase,
                delay: 0.7 + i * 0.08,
              }}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {c.label}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
                  {c.note}
                </span>
              </div>
              <span className="font-serif text-lg font-semibold text-white">
                {c.score}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
