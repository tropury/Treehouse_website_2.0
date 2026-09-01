import { siteConfig } from "./site";
import { socials } from "./socials";
import { faqItems } from "./faq";

/**
 * JSON-LD structured data for search-engine optimisation.
 *
 * - `organizationSchema` describes the studio (injected in the root
 *   layout) so search engines and AI overviews can understand what
 *   TreeHouse is.
 * - `faqSchema` marks up the FAQ accordion as an `FAQPage` for rich
 *   results in search.
 */

const SITE_URL = "https://www.treehousestudio.com.br/";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.title,
  description: siteConfig.description,
  url: SITE_URL,
  logo: `${SITE_URL}treehouse-logo.png`,
  slogan: siteConfig.heroHeadline,
  foundingDate: "2017",
  sameAs: socials.map((s) => s.href),
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};
