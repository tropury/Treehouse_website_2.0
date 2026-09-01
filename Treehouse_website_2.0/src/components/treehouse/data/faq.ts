/**
 * FAQ entries — common questions a prospective client might have.
 * Copy here is original supporting copy (the user's brand texts on
 * hero / contact / portfolio are preserved verbatim elsewhere).
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "process",
    question: "How does a project usually start?",
    answer:
      "It begins with a conversation. Share the brief, references, and the mood you're after — we'll respond within 24 hours with a scope, a timeline, and a few questions of our own. From there we move into blocking, lighting, and final renders.",
  },
  {
    id: "turnaround",
    question: "What's a typical turnaround?",
    answer:
      "A single exterior render usually takes 1–2 weeks; a full interior set 2–4 weeks. Animation and multi-frame packages run longer. The scope calculator on the contact form gives an illustrative range for your specific mix.",
  },
  {
    id: "revisions",
    question: "How many rounds of revisions are included?",
    answer:
      "Every project includes two rounds of revisions on lighting, composition, and material. Further rounds are billed at an hourly rate, quoted up front so there are no surprises.",
  },
  {
    id: "files",
    question: "What files do you need from us?",
    answer:
      "We work from 3D models (Revit, SketchUp, Rhino, 3ds Max), CAD drawings, or even reference photography. Mood boards — like the one in our lab — help us align on aesthetic before we light a single frame.",
  },
  {
    id: "usage",
    question: "Who owns the final images?",
    answer:
      "You do. Delivered renders are licensed for unlimited use — marketing, print, web, social. We retain the right to show the work in our portfolio unless you've arranged an NDA.",
  },
];
