import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  mailerConfigured,
  sendContactAutoReply,
  sendContactNotification,
} from "@/lib/mailer";

/**
 * POST /api/contact
 *
 * Validates a project inquiry submitted via the contact form and
 * delivers it to the studio:
 *
 *   1. E-mail notification → diego@treehousestudio.com.br via the
 *      studio's Zoho SMTP (primary channel; subject carries the
 *      `[Site]` tag). Reply-To is set to the visitor so the studio
 *      can answer straight from the inbox.
 *   2. Auto-reply → short confirmation e-mail to the visitor
 *      (best-effort; never blocks the request).
 *   3. SQLite persistence → best-effort audit trail. It works locally
 *      but is skipped on serverless hosts (Vercel has a read-only
 *      filesystem), so failures are logged, never surfaced.
 *
 * Returns 201 on success, 400 on validation failure, 500 when the
 * inquiry could not be delivered anywhere. Errors are surfaced as a
 * JSON `{ error, fieldErrors }` envelope so the client can render
 * inline field messages.
 *
 * Spam protection: a `website` honeypot field is included. If it
 * contains any value, the request is silently rejected with a 201
 * (so bots think they succeeded) but nothing is delivered.
 */

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional(),
  // Optional: the form no longer asks for scope up front.
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (min 10 chars)."),
  // Honeypot — must be empty.
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

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot: if the hidden `website` field was filled, silently drop
  // the submission but return 201 so bots don't learn they were caught.
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const payload = {
    name: data.name,
    email: data.email,
    company: data.company ?? null,
    service: data.service ?? null,
    budget: data.budget ?? null,
    timeline: data.timeline ?? null,
    message: data.message,
  };

  // 1) E-mail to the studio — the primary delivery channel.
  let notification: Awaited<ReturnType<typeof sendContactNotification>> | null =
    null;
  if (mailerConfigured) {
    notification = await sendContactNotification(payload);
    if (!notification.sent) {
      console.error(
        "[contact] studio notification failed:",
        notification.error,
      );
    }
  }

  // 2) Auto-reply to the visitor — best-effort, never blocks.
  if (notification?.sent) {
    const auto = await sendContactAutoReply(payload);
    if (!auto.sent) {
      console.warn("[contact] auto-reply skipped:", auto.error);
    }
  }

  // 3) SQLite audit trail — best-effort (read-only FS on Vercel).
  let stored = false;
  try {
    await db.contactInquiry.create({ data: payload });
    stored = true;
  } catch (err) {
    console.warn(
      "[contact] database persistence skipped (expected on Vercel):",
      err instanceof Error ? err.message : err,
    );
  }

  // The inquiry is only "lost" when it went nowhere: e-mail failed (or
  // is unconfigured) AND the database write failed too.
  if (notification && !notification.sent && !stored) {
    return NextResponse.json(
      {
        error:
          "Something went wrong delivering your inquiry. Please try again.",
      },
      { status: 500 },
    );
  }
  if (!notification && !stored) {
    // No SMTP configured (local dev without .env) and no database —
    // fail loudly instead of pretending the message was received.
    return NextResponse.json(
      { error: "Inquiry could not be stored. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, via: notification?.sent ? "email" : "database", stored },
    { status: 201 },
  );
}
