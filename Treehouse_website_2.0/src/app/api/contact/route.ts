import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * POST /api/contact
 *
 * Validates and persists a project inquiry submitted via the contact
 * form. Returns 201 on success, 400 on validation failure. Errors are
 * surfaced as a JSON `{ error, fieldErrors }` envelope so the client
 * can render inline field messages.
 *
 * Spam protection: a `website` honeypot field is included. If it
 * contains any value, the request is silently rejected with a 201
 * (so bots think they succeeded) but nothing is persisted.
 */

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional(),
  service: z.string().min(1, "Please choose a service."),
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

  // Honeypot: if the hidden `website` field was filled, silently drop
  // the submission but return 201 so bots don't learn they were caught.
  if (parsed.data.website && parsed.data.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const inquiry = await db.contactInquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        service: parsed.data.service,
        budget: parsed.data.budget ?? null,
        timeline: parsed.data.timeline ?? null,
        message: parsed.data.message,
      },
    });
    return NextResponse.json(
      { ok: true, id: inquiry.id },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong saving your inquiry. Please try again." },
      { status: 500 },
    );
  }
}
