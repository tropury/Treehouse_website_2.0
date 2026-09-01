/**
 * Studio status ticker — rotating pseudo-live messages that give the
 * site a sense of an active, operating studio. Copy here is original
 * supporting copy (the user's brand texts on hero/contact/portfolio are
 * preserved verbatim elsewhere).
 */

export interface StatusItem {
  id: string;
  /** Short label, e.g. "Rendering". */
  label: string;
  /** The status line. */
  text: string;
}

export const statusItems: StatusItem[] = [
  {
    id: "render-1",
    label: "Rendering",
    text: "Concrete House — exterior pass · 87% complete",
  },
  {
    id: "mood-1",
    label: "Lab",
    text: "A visitor composed a Warm Minimalism mood board",
  },
  {
    id: "studio-1",
    label: "Studio",
    text: "New case study in progress — Villa at Dusk",
  },
  {
    id: "render-2",
    label: "Queue",
    text: "2 projects in the render queue · avg 3.2 days",
  },
  {
    id: "global-1",
    label: "Now",
    text: "Listening to clients in São Paulo, Porto, Curitiba",
  },
  {
    id: "capability-1",
    label: "Focus",
    text: "Photorealism + storytelling + technology",
  },
];
