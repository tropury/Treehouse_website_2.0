import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { mailerConfigured, sendNewsletterNotification } from "@/lib/mailer";

/**
 * POST /api/newsletter
 *
 * Validates and records a newsletter / mood-board export signup, and
 * notifies the studio inbox by e-mail (subject carries the `[Site]`
 * tag). The e-mail is the primary channel; the SQLite write is a
 * best-effort audit trail that is skipped on serverless hosts
 * (Vercel's filesystem is read-only).
 *
 * The email is stored uniquely (upsert) so repeat submissions don't
 * create duplicates. Returns 201 on success, 400 on validation
 * failure. Duplicate sign-ups still return 201 and re-notify.
 *
 * Includes a hidden honeypot `website` field — if filled, the request
 * is silently dropped (returns 201, nothing delivered).
 */

const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  mood: z.string().max(500).optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = NewsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  if (parsed.data.website && parsed.data.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const { email, mood } = parsed.data;

  // 1) E-mail to the studio — primary channel.
  let notified = false;
  if (mailerConfigured) {
    const notification = await sendNewsletterNotification(email, mood ?? null);
    notified = notification.sent;
    if (!notification.sent) {
      console.warn(
        "[newsletter] studio notification skipped:",
        notification.error,
      );
    }
  }

  // 2) SQLite audit trail — best-effort (read-only FS on Vercel).
  let stored = false;
  try {
    await db.newsletterSignup.upsert({
      where: { email },
      update: { mood: mood ?? null },
      create: { email, mood: mood ?? null },
    });
    stored = true;
  } catch (err) {
    console.warn(
      "[newsletter] database persistence skipped (expected on Vercel):",
      err instanceof Error ? err.message : err,
    );
  }

  if (!notified && !stored) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, via: notified ? "email" : "database", stored },
    { status: 201 },
  );
}
