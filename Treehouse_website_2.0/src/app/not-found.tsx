import Link from "next/link";
import { siteConfig } from "@/components/treehouse/data/site";

/**
 * 404 — custom not-found page.
 *
 * Stays on-brand: charcoal background, serif headline, the studio logo,
 * and a single link back to the experience. Matches the split-screen
 * hero's dark panel aesthetic so a lost visitor still feels they're in
 * the TreeHouse world.
 */
export default function NotFound() {
  return (
    <div className="th-grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-th-charcoal px-6 text-center">
      {/* Atmospheric vignette (matches the hero dark panel) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(70,70,70,0.55) 0%, rgba(42,42,42,0) 45%, rgba(15,15,15,0.65) 100%)",
        }}
      />

      {/* Logo */}
      <img
        src="/treehouse-logo.png"
        alt="Tree House"
        className="relative z-10 mb-8 h-24 w-24 select-none object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)] md:h-32 md:w-32"
        draggable={false}
      />

      {/* 404 mark */}
      <p className="relative z-10 font-mono text-xs uppercase tracking-[0.4em] text-th-blue-soft">
        Error 404
      </p>

      {/* Headline */}
      <h1 className="relative z-10 mt-3 font-serif text-5xl font-bold uppercase leading-tight text-th-cream md:text-7xl">
        Lost in
        <br />
        <span className="italic text-th-blue-soft">the trees.</span>
      </h1>

      <p className="relative z-10 mt-6 max-w-sm text-sm leading-relaxed text-th-cream/60">
        The page you&apos;re looking for has wandered off the path. Let&apos;s
        head back to the studio.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="group relative z-10 mt-8 flex items-center gap-2 rounded-full bg-th-blue px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-105"
      >
        Return to the studio
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>

      {/* Footer mark */}
      <p className="relative z-10 mt-16 font-serif text-[10px] uppercase tracking-[0.3em] text-th-cream/30">
        {siteConfig.title}
      </p>
    </div>
  );
}
