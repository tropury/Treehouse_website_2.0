import type { PortfolioItem } from "../types";

/**
 * Portfolio works. Data-driven so new pieces can be appended without
 * touching any component code. Gradients remain as a graceful fallback
 * if an image is unavailable.
 *
 * Items with a `beforeImage` expose an interactive before/after slider
 * (wireframe → final render) in the detail lightbox.
 */
export const portfolio: PortfolioItem[] = [
  {
    id: "concrete-house",
    title: "Concrete House",
    category: "Architecture",
    gradient: "from-zinc-100 to-zinc-300",
    accent: "#1d4ed8",
    image: "/works/work-1.png",
    beforeImage: "/works/work-1-wire.png",
    year: "2024",
    description:
      "A monolithic concrete residence where raw material meets warm interior light at dusk.",
    spec: {
      client: "Private",
      location: "Porto Alegre, BR",
      software: "3ds Max, Corona",
      scope: "Exterior render",
      deliverable: "4K · 8 frames",
    },
  },
  {
    id: "open-living",
    title: "Open Living",
    category: "Interior",
    gradient: "from-blue-50 to-blue-100",
    accent: "#2563eb",
    image: "/works/work-2.png",
    beforeImage: "/works/work-2-wire.png",
    year: "2024",
    description:
      "An open-plan living space balancing natural wood, daylight, and scandinavian restraint.",
    spec: {
      client: "Studio collaboration",
      location: "São Paulo, BR",
      software: "Blender, Cycles",
      scope: "Interior render",
      deliverable: "4K · 6 frames",
    },
  },
  {
    id: "villa-dusk",
    title: "Villa at Dusk",
    category: "Exterior",
    gradient: "from-stone-100 to-stone-300",
    accent: "#1e3a8a",
    image: "/works/work-3.png",
    beforeImage: "/works/work-3-wire.png",
    year: "2023",
    description:
      "A contemporary villa rendered at blue hour, its infinity pool mirroring the geometry above.",
    spec: {
      client: "Architecture firm",
      location: "Florianópolis, BR",
      software: "3ds Max, V-Ray",
      scope: "Exterior + dusk",
      deliverable: "5K · 4 frames",
    },
  },
  {
    id: "morning-suite",
    title: "Morning Suite",
    category: "Interior",
    gradient: "from-slate-100 to-slate-300",
    accent: "#3b82f6",
    image: "/works/work-4.png",
    beforeImage: "/works/work-4-wire.png",
    year: "2023",
    description:
      "A minimalist bedroom in soft morning light — Japandi calm, linen, concrete, and wood.",
    spec: {
      client: "Private",
      location: "Curitiba, BR",
      software: "Blender, Cycles",
      scope: "Interior render",
      deliverable: "4K · 3 frames",
    },
  },
  {
    id: "marble-kitchen",
    title: "Marble Kitchen",
    category: "Interior",
    gradient: "from-neutral-100 to-neutral-300",
    accent: "#1d4ed8",
    image: "/works/work-5.png",
    year: "2024",
    description:
      "A sculptural kitchen of marble, brass, and dark cabinetry under dramatic lighting.",
    spec: {
      client: "Interior studio",
      location: "Porto Alegre, BR",
      software: "3ds Max, Corona",
      scope: "Interior render",
      deliverable: "4K · 5 frames",
    },
  },
  {
    id: "museum-plaza",
    title: "Museum Plaza",
    category: "Architecture",
    gradient: "from-zinc-100 to-blue-50",
    accent: "#2563eb",
    image: "/works/work-6.png",
    year: "2022",
    description:
      "An aerial view of a geometric concrete museum, framed by its plaza and trees.",
    spec: {
      client: "Competition entry",
      location: "Concept",
      software: "Rhino, Twinmotion",
      scope: "Aerial exterior",
      deliverable: "4K · 2 frames",
    },
  },
  {
    id: "ambient-concept",
    title: "Ambient Concept",
    category: "Concept",
    gradient: "from-stone-100 to-blue-50",
    accent: "#1e40af",
    image: "/works/work-7.png",
    year: "2023",
    description:
      "An exploratory mood study exploring atmosphere, light, and spatial persuasion.",
    spec: {
      client: "Self-initiated",
      location: "Studio",
      software: "Blender, Photoshop",
      scope: "Concept art",
      deliverable: "2K · 1 frame",
    },
  },
  {
    id: "detail-study",
    title: "Detail Study",
    category: "Render",
    gradient: "from-slate-100 to-zinc-200",
    accent: "#1d4ed8",
    image: "/works/work-8.png",
    year: "2022",
    description:
      "A close material study — texture, junction, and shadow composed into a single frame.",
    spec: {
      client: "Material research",
      location: "Studio",
      software: "3ds Max, Corona",
      scope: "Macro detail",
      deliverable: "4K · 1 frame",
    },
  },
];
