import type { SocialLink } from "../types";

/**
 * Social / contact links — preserved verbatim from the original site.
 *
 * The `delay` field drives the staggered entrance animation; keep them
 * in 100ms increments for a smooth cascade.
 */
export const socials: SocialLink[] = [
  {
    id: "instagram",
    label: "instagram",
    tag: "daily",
    href: "https://www.instagram.com/th_studio3d/",
    delay: 0,
  },
  {
    id: "linkedin",
    label: "linkedin",
    tag: "professional",
    href: "https://www.linkedin.com/in/diegostreyveiga/",
    delay: 100,
  },
  {
    id: "behance",
    label: "behance",
    tag: "creative",
    href: "https://www.behance.net/diegostrey",
    delay: 200,
  },
  {
    id: "tiktok",
    label: "tiktok",
    tag: "trend",
    href: "https://www.tiktok.com/@diego_thstudio",
    delay: 300,
  },
  {
    id: "cgarchitect",
    label: "cgarchitect",
    tag: "design",
    href: "https://www.cgarchitect.com/members/diego-strey",
    delay: 400,
  },
];
