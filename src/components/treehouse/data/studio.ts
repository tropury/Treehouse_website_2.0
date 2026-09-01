import type { StudioCapability, StudioMetric, StudioPrinciple } from "../types";

/**
 * Studio view content.
 *
 * The "studio" scene presents the studio's philosophy and a few metrics.
 * Copy here is original supporting copy (the user's brand texts on the
 * hero / contact / portfolio views are preserved verbatim elsewhere).
 */
export const studioPrinciples: StudioPrinciple[] = [
  {
    id: "design",
    index: "01",
    title: "Design",
    description:
      "Form follows feeling. Every line is drawn with intent, every proportion weighed against the human that will inhabit it.",
  },
  {
    id: "storytelling",
    index: "02",
    title: "Storytelling",
    description:
      "A render is not a picture — it is a scene with a mood, a time of day, and a quiet narrative the viewer steps into.",
  },
  {
    id: "technology",
    index: "03",
    title: "Technology",
    description:
      "We blend the latest 3D pipelines with a craftsman's eye, so the impossible reads as inevitable.",
  },
];

export const studioMetrics: StudioMetric[] = [
  { id: "years", value: "8+", label: "Years rendering", target: 8, suffix: "+" },
  { id: "projects", value: "120+", label: "Visuals delivered", target: 120, suffix: "+" },
  { id: "disciplines", value: "3", label: "Studio disciplines", target: 3 },
];

/**
 * Studio capability scores — rendered as a radar chart so visitors can
 * read the studio's strengths at a glance. Scores are illustrative.
 */
export const studioCapabilities: StudioCapability[] = [
  {
    id: "photorealism",
    label: "Photorealism",
    score: 95,
    note: "Material & light fidelity",
  },
  {
    id: "lighting",
    label: "Lighting",
    score: 92,
    note: "Mood & atmosphere",
  },
  {
    id: "animation",
    label: "Animation",
    score: 78,
    note: "Camera & motion",
  },
  {
    id: "concept",
    label: "Concept Art",
    score: 84,
    note: "Early-stage vision",
  },
  {
    id: "post",
    label: "Post-Production",
    score: 88,
    note: "Grade & composite",
  },
];
