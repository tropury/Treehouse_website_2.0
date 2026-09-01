import { ImageResponse } from "next/og";
import { siteConfig } from "@/components/treehouse/data/site";

/**
 * Dynamic Open Graph image for the home route.
 *
 * Generated at request time by Next.js using `ImageResponse`. Renders a
 * 1200×630 charcoal card with the TreeHouse logo mark, the studio
 * name, the hero headline, and a blue accent — matching the on-brand
 * split-screen hero. Used by social platforms (Twitter, LinkedIn,
 * Slack, etc.) when the site URL is shared.
 *
 * Exported as `alt` + `size` + `contentType` + the default `GET`
 * function per the Next.js OG image convention.
 */

export const alt = `${siteConfig.title} — ${siteConfig.heroHeadline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background:
            "radial-gradient(120% 90% at 50% 45%, #3a3a3a 0%, #2a2a2a 45%, #151515 100%)",
          padding: "80px",
          color: "#E8E0D5",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Blue accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "8px",
            background: "#2563eb",
            display: "flex",
          }}
        />

        {/* Studio mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {/* Simple treehouse-ish mark (blue square + wordmark) */}
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#2563eb",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "white",
            }}
          >
            th
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: 700 }}>Tree</span>
            <span style={{ fontSize: "24px", fontWeight: 700 }}>House</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: "76px",
            fontWeight: 800,
            lineHeight: 1.05,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#f5f5f5",
            maxWidth: "900px",
          }}
        >
          We Make Visual Persuasion &amp; Some Art
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "26px",
            color: "#9ca3af",
            maxWidth: "760px",
            lineHeight: 1.4,
          }}
        >
          We blend design, storytelling, and technology to create visuals that
          resonate and inspire.
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            left: "80px",
            display: "flex",
            fontSize: "16px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#6b7280",
          }}
        >
          Architecture · Interior · Visual Persuasion
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
