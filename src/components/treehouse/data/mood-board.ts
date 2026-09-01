/**
 * Mood board data for the "lab" view.
 *
 * Visitors drag material + style tokens into a drop zone; the studio
 * then names the resulting aesthetic and suggests matching works.
 * Tokens are tagged so the matcher can score them against archetypes.
 */

export interface MoodToken {
  id: string;
  label: string;
  /** "material" or "style" — grouped in the token tray. */
  kind: "material" | "style";
  /** Tailwind gradient classes for the token chip. */
  gradient: string;
  /** A short descriptor rendered beneath the label. */
  note: string;
  /** Archetype tags this token contributes to. */
  tags: string[];
}

export interface MoodArchetype {
  id: string;
  name: string;
  /** Tags that, when selected, contribute to this archetype's score. */
  tags: string[];
  /** Short description shown when this archetype is the top match. */
  description: string;
}

/** Available tokens in the tray. */
export const moodTokens: MoodToken[] = [
  {
    id: "concrete",
    label: "Concrete",
    kind: "material",
    gradient: "from-zinc-300 to-zinc-500",
    note: "Raw, monolithic",
    tags: ["brutalist", "minimal"],
  },
  {
    id: "wood",
    label: "Wood",
    kind: "material",
    gradient: "from-amber-200 to-amber-700",
    note: "Warm, tactile",
    tags: ["warm", "japandi", "organic"],
  },
  {
    id: "glass",
    label: "Glass",
    kind: "material",
    gradient: "from-sky-100 to-cyan-300",
    note: "Crisp, transparent",
    tags: ["minimal", "modern"],
  },
  {
    id: "marble",
    label: "Marble",
    kind: "material",
    gradient: "from-stone-100 to-stone-400",
    note: "Veined, luxurious",
    tags: ["luxury", "classic"],
  },
  {
    id: "steel",
    label: "Steel",
    kind: "material",
    gradient: "from-slate-300 to-slate-600",
    note: "Industrial, cool",
    tags: ["industrial", "modern"],
  },
  {
    id: "linen",
    label: "Linen",
    kind: "material",
    gradient: "from-orange-100 to-orange-300",
    note: "Soft, natural",
    tags: ["warm", "japandi", "organic"],
  },
  {
    id: "minimal",
    label: "Minimal",
    kind: "style",
    gradient: "from-zinc-100 to-zinc-300",
    note: "Less is more",
    tags: ["minimal", "modern"],
  },
  {
    id: "brutalist",
    label: "Brutalist",
    kind: "style",
    gradient: "from-zinc-500 to-zinc-800",
    note: "Heavy, honest",
    tags: ["brutalist", "industrial"],
  },
  {
    id: "japandi",
    label: "Japandi",
    kind: "style",
    gradient: "from-amber-100 to-stone-300",
    note: "Calm, pared-back",
    tags: ["japandi", "warm", "organic"],
  },
  {
    id: "luxury",
    label: "Luxury",
    kind: "style",
    gradient: "from-stone-200 to-amber-600",
    note: "Rich, refined",
    tags: ["luxury", "classic"],
  },
];

/** Archetypes the matcher can identify. */
export const moodArchetypes: MoodArchetype[] = [
  {
    id: "warm-minimal",
    name: "Warm Minimalism",
    tags: ["warm", "minimal", "japandi", "wood", "linen"],
    description:
      "A pared-back warmth — natural materials, soft daylight, and quiet restraint. We render calm, inhabited spaces.",
  },
  {
    id: "brutalist",
    name: "Brutalist Edge",
    tags: ["brutalist", "concrete", "steel", "industrial"],
    description:
      "Mass, weight, and honest material. Monolithic concrete reads as inevitable under dramatic light.",
  },
  {
    id: "modern-glass",
    name: "Crisp Modern",
    tags: ["modern", "minimal", "glass", "steel"],
    description:
      "Precision and transparency. Clean geometry, reflective surfaces, and a cool, clinical finish.",
  },
  {
    id: "refined-luxury",
    name: "Refined Luxury",
    tags: ["luxury", "classic", "marble"],
    description:
      "Veined stone, brass, and deep shadow. Dramatic lighting that frames each material as a jewel.",
  },
];

/**
 * Score the selected tokens against every archetype and return the best
 * match (or null if nothing is selected). Scoring is a simple tag
 * intersection count.
 */
export function matchArchetype(
  selected: MoodToken[],
): { archetype: MoodArchetype; score: number } | null {
  if (selected.length === 0) return null;
  let best: MoodArchetype | null = null;
  let bestScore = 0;
  for (const arc of moodArchetypes) {
    const tagSet = new Set(arc.tags);
    const score = selected.reduce(
      (sum, t) => sum + t.tags.filter((tag) => tagSet.has(tag)).length,
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = arc;
    }
  }
  return best ? { archetype: best, score: bestScore } : null;
}
