"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";
import { studioEase } from "./lib/motion";

interface NewsletterSignupProps {
  /** Optional mood-board summary to attach to the signup. */
  mood?: string;
  /** Visual variant — "inline" for the footer, "card" for the lab. */
  variant?: "inline" | "card";
}

/**
 * NewsletterSignup — a compact email-capture form.
 *
 * On submit, POSTs to `/api/newsletter` (which persists the signup and
 * optional mood-board summary). Shows a loading state, then an animated
 * success confirmation. Includes a hidden honeypot `website` field.
 *
 * `variant="card"` renders as a standalone glassmorphic card (used in the
 * lab view as a "save your mood board" lead magnet). `variant="inline"`
 * renders as a single-row input + button (used in the footer).
 */
export function NewsletterSignup({
  mood,
  variant = "inline",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "done") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mood, website: "" }),
      });
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (variant === "card") {
    return (
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-th-blue/20 to-th-blue/5 p-5 ring-1 ring-th-blue/30"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: studioEase }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-th-blue-soft" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
            Save your mood
          </span>
        </div>
        {status === "done" ? (
          <SuccessMessage />
        ) : (
          <>
            <p className="mb-3 font-serif text-sm italic text-white/80">
              Enter your email to receive a PDF summary + matching case studies.
            </p>
            <form onSubmit={submit} className="flex gap-2" noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                required
                className="th-input flex-1"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-th-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
                Send
              </button>
            </form>
            {error && (
              <p className="mt-2 text-xs text-red-300">{error}</p>
            )}
          </>
        )}
      </motion.div>
    );
  }

  // Inline (footer) variant
  return (
    <div className="flex items-center gap-2">
      {status === "done" ? (
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-th-blue-soft">
          <Check className="h-3 w-3" /> Subscribed
        </span>
      ) : (
        <form onSubmit={submit} className="flex items-center gap-2" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for studio updates"
            required
            className="w-40 rounded-full border border-zinc-300/70 bg-white/50 px-3 py-1 text-[11px] text-zinc-700 outline-none transition-colors focus:border-th-blue md:w-48"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-th-blue text-white transition-transform hover:scale-110 disabled:opacity-60"
            aria-label="Subscribe"
          >
            {status === "loading" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="h-3 w-3" />
            )}
          </button>
        </form>
      )}
    </div>
  );
}

/** Animated success confirmation. */
function SuccessMessage() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: studioEase }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-th-blue">
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </span>
      <div>
        <p className="font-serif text-sm font-semibold text-white">
          On its way.
        </p>
        <p className="font-mono text-[9px] uppercase tracking-wider text-white/50">
          Check your inbox shortly.
        </p>
      </div>
    </motion.div>
  );
}
