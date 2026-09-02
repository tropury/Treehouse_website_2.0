import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * POST /api/newsletter
 *
 * Validates and persists a newsletter / mood-board export signup. The
 * email is stored uniquely (upsert) so repeat submissions don't create
 * duplicates. Returns 201 on success, 400 on validation failure.
 *
 * Includes a hidden honeypot `website` field — if filled, the request
 * is silently dropped (returns 201, nothing persisted).
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

  try {
    await db.newsletterSignup.upsert({
      where: { email: parsed.data.email },
      update: { mood: parsed.data.mood ?? null },
      create: {
        email: parsed.data.email,
        mood: parsed.data.mood ?? null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
