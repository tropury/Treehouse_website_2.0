/**
 * Client testimonials — short quotes rendered as a carousel on the
 * studio view. Copy here is original supporting copy (the user's brand
 * texts on the hero / contact / portfolio views are preserved verbatim
 * elsewhere). Replace with real client quotes when available.
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  /** Optional project reference. */
  project?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "apex",
    quote:
      "TreeHouse didn't just render our vision — they elevated it. The mood board feature alone saved us weeks of back-and-forth.",
    author: "Sarah Chen",
    role: "Creative Director, Apex Architecture",
    project: "The Meridian Tower",
  },
  {
    id: "nordhaus",
    quote:
      "Every frame felt composed, not computed. The before/after slider convinced our board in a single meeting.",
    author: "Marcus Lind",
    role: "Partner, Nordhaus Studio",
    project: "Villa at Dusk",
  },
  {
    id: "meridian",
    quote:
      "A rare studio that treats light as a material. We've worked with many visualisers — none match TreeHouse's restraint.",
    author: "Ana Beatriz Reis",
    role: "Lead Architect, Meridian",
    project: "Concrete House",
  },
];
