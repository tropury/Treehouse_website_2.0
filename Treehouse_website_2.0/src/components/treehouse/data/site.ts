import type { SiteConfig, ViewDefinition } from "../types";

/**
 * Site configuration.
 *
 * IMPORTANT: all copy here is preserved verbatim from the original
 * TreeHouse Studio site (https://www.treehousestudio.com.br/).
 * Only the code/design is being improved — the words are not.
 */
export const siteConfig: SiteConfig = {
  title: "TreeHouse Studio",
  description:
    "We blend design, storytelling, and technology to create visuals that resonate and inspire. Architecture, interior design, and visual persuasion.",
  author: "TreeHouse",
  keywords: [
    "TreeHouse",
    "Visual Persuasion",
    "Architecture",
    "Interior Design",
    "Art",
    "Design",
    "Creative",
    "Portfolio",
  ],
  heroHeadline: "We Make Visual Persuasion & Some Art",
  heroSubtitle:
    "We blend design, storytelling, and technology to create visuals that resonate and inspire.",
};

/**
 * The ordered cycle of views. The navigation orb advances through
 * this list and wraps around. Add a new entry here + build a matching
 * panel component to extend the experience.
 */
export const views: ViewDefinition[] = [
  {
    id: "hero",
    label: "studio",
    description: "Intro — who we are and what we make.",
  },
  {
    id: "portfolio",
    label: "portfolio",
    description: "A selection of recent visual work.",
  },
  {
    id: "studio",
    label: "process",
    description: "How the studio thinks and works.",
  },
  {
    id: "lab",
    label: "lab",
    description: "Build a mood board and find your aesthetic.",
  },
  {
    id: "contact",
    label: "contact",
    description: "Where to find us across the web.",
  },
];
