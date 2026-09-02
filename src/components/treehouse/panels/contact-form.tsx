"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, Loader2 } from "lucide-react";
import { studioEase } from "../lib/motion";

/**
 * ContactForm — a two-step project brief.
 *
 * Two steps: contact basics → vision. Scope, budget and pricing are
 * intentionally left out — those are discussed after the first
 * contact. Each step validates before advancing. On submit, the
 * inquiry is POSTed to /api/contact which e-mails the studio. A
 * success state with an animated checkmark confirms submission.
 */

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional(),
  message: z
    .string()
    .min(10, "Tell us a little more (min 10 chars).")
    .max(1000, "Keep it under 1000 characters."),
  /** Honeypot — must stay empty. Bots fill hidden fields; humans don't. */
  website: z.string().max(0, "spam detected").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const STEPS = ["Contact", "Vision"] as const;

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      website: "",
    },
  });

  const next = async () => {
    const fields: (keyof FormValues)[][] = [
      ["name", "email"],
      ["message"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(
          data?.error ?? "Something went wrong. Please try again.",
        );
        setStep(0);
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center rounded-3xl bg-white/5 p-8 text-center ring-1 ring-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: studioEase }}
      >
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-th-blue"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            ease: studioEase,
            delay: 0.15,
            type: "spring",
          }}
        >
          <Check className="h-7 w-7 text-white" strokeWidth={3} />
        </motion.div>
        <h4 className="mt-5 font-serif text-2xl font-bold text-white">
          Thank you.
        </h4>
        <p className="mt-2 max-w-sm text-sm text-white/70">
          Your brief is on its way to the studio. We&apos;ll respond really soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm md:p-8"
      noValidate
    >
      {/* Honeypot — visually hidden, must stay empty (bot trap). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (leave empty)</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
                  i <= step
                    ? "bg-white text-th-blue-deep"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={`font-mono text-[9px] uppercase tracking-wider transition-colors duration-300 ${
                  i === step ? "text-white" : "text-white/40"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="h-px flex-1 bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="min-h-[180px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: studioEase }}
              className="space-y-4"
            >
              <Field label="Your name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="Your Name"
                  className="th-input"
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="email@studio.com"
                  className="th-input"
                  aria-invalid={!!errors.email}
                />
              </Field>
              <Field label="Company (optional)" error={undefined}>
                <input
                  {...register("company")}
                  placeholder="Studio / Firm / Company"
                  className="th-input"
                />
              </Field>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: studioEase }}
              className="space-y-4"
            >
              <Field
                label="Tell us about your project"
                error={errors.message?.message}
              >
                <textarea
                  {...register("message")}
                  placeholder="The brief, the mood, the deadline…"
                  rows={5}
                  className="th-input resize-none"
                  aria-invalid={!!errors.message}
                />
              </Field>
              {serverError && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {serverError}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || submitting}
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-white/60 transition-colors hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="group flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-th-blue-deep transition-transform hover:scale-105"
          >
            Continue
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-full bg-th-blue px-6 py-2 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
            {submitting ? "Sending" : "Send brief"}
          </button>
        )}
      </div>
    </form>
  );
}

/** A labelled field wrapper with inline error. */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-300">{error}</span>
      )}
    </label>
  );
}
