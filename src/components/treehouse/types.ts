/**
 * TreeHouse Studio — Shared type definitions
 *
 * Keeping all shared types in one place makes the scene/view system
 * trivially extendable: drop a new entry into the data files and the
 * UI will pick it up automatically.
 */

/** The primary scenes the studio site cycles through. */
export type ViewId = "hero" | "portfolio" | "studio" | "lab" | "contact";

/** A single portfolio work (architecture / interior / 3D piece). */
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  /** Tailwind gradient classes used as a fallback / placeholder tile. */
  gradient: string;
  /** Optional accent hue for hover glow. */
  accent?: string;
  /** Optional image path (under /public). When present, used as the tile art. */
  image?: string;
  /** Short descriptor shown in the detail lightbox. Verbatim-safe copy. */
  description?: string;
  /** Year the work was produced. */
  year?: string;
  /** Technical spec sheet shown in the detail lightbox. */
  spec?: PortfolioSpec;
}

/** Technical metadata for a portfolio work. */
export interface PortfolioSpec {
  /** Client or project type. */
  client?: string;
  /** Geographic location of the project. */
  location?: string;
  /** Software / pipeline used (comma-separated string). */
  software?: string;
  /** Scope of work (e.g. "Exterior render"). */
  scope?: string;
  /** Render resolution or deliverable format. */
  deliverable?: string;
}

/** A social / contact link shown on the contact view. */
export interface SocialLink {
  id: string;
  label: string;
  /** Short descriptor rendered beneath the label. */
  tag: string;
  href: string;
  /** Stagger order used by the entrance animation. */
  delay: number;
}

/** A selectable scene in the view cycle. */
export interface ViewDefinition {
  id: ViewId;
  /** Italic serif label shown as a section marker. */
  label: string;
  /** One-line description of the view (used for a11y / tooltips). */
  description: string;
}

/** A studio "principle" or stat shown on the studio view. */
export interface StudioPrinciple {
  id: string;
  index: string;
  title: string;
  description: string;
}

/** A studio metric (e.g. years of experience). */
export interface StudioMetric {
  id: string;
  value: string;
  label: string;
  /** Numeric target for the count-up animation. */
  target?: number;
  /** Suffix appended after the count (e.g. "+"). */
  suffix?: string;
}

/** A studio capability axis for the radar chart. */
export interface StudioCapability {
  id: string;
  /** Display label. */
  label: string;
  /** Score 0-100 shown on the radar axis. */
  score: number;
  /** Short descriptor rendered beneath the label. */
  note: string;
}

/** Site-wide configuration (texts preserved exactly from the original). */
export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  keywords: string[];
  /** Hero headline — kept verbatim. */
  heroHeadline: string;
  heroSubtitle: string;
}
