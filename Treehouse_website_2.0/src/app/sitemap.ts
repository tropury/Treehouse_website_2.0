import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap — currently just the home route (the experience is a
 * single-page app), but kept here so additional routes (e.g. per-project
 * case-study pages) can be appended in future.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.treehousestudio.com.br/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
