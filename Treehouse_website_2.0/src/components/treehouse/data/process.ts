/**
 * Studio process steps — a scroll-triggered timeline shown on the
 * studio view. Copy here is original supporting copy (the user's brand
 * texts on hero / contact / portfolio are preserved verbatim elsewhere).
 */

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  description: string;
  /** Short deliverable for this step. */
  deliverable: string;
  /** Indicative duration. */
  duration: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: "discovery",
    index: "01",
    title: "Discovery",
    description:
      "We start with a conversation — the brief, references, and the mood you're after. We map the scope, the deliverables, and the emotional core of the project before a single frame is drawn.",
    deliverable: "Scope + mood alignment",
    duration: "2–3 days",
  },
  {
    id: "blocking",
    index: "02",
    title: "Blocking",
    description:
      "Cameras are set, geometry is blocked, and the composition is locked. You'll see greybox frames that confirm scale, viewpoint, and spatial logic before we invest in detail.",
    deliverable: "Greybox frames for approval",
    duration: "3–5 days",
  },
  {
    id: "lighting",
    index: "03",
    title: "Lighting",
    description:
      "The mood takes shape. We light the scene — time of day, atmosphere, and the narrative the light tells. This is where a render stops being geometry and starts being a place.",
    deliverable: "Lit frames for review",
    duration: "4–6 days",
  },
  {
    id: "material",
    index: "04",
    title: "Material & Detail",
    description:
      "Materials, textures, and props are layered in. Surfaces gain weight, edges gain character, and the frame begins to read as photographed rather than rendered.",
    deliverable: "Near-final frames",
    duration: "3–5 days",
  },
  {
    id: "delivery",
    index: "05",
    title: "Delivery",
    description:
      "Final passes, post-production, and grade. We deliver high-resolution images plus the project file, so the work lives on beyond the handover.",
    deliverable: "Final renders + source",
    duration: "2–3 days",
  },
];
