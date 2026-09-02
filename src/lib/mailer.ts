import nodemailer from "nodemailer";

/**
 * E-mail delivery for TreeHouse Studio.
 *
 * Sends through the studio's own Zoho Mail mailbox over SMTP — no
 * third-party form service needed. All credentials come from
 * environment variables, so the same code:
 *
 *   - locally (vars unset)  → e-mail is skipped, submissions are only
 *     logged to the SQLite database;
 *   - on Vercel (vars set)  → every submission lands in the studio
 *     inbox at diego@treehousestudio.com.br.
 *
 * Required env vars (Vercel → Project → Settings → Environment
 * Variables, and locally in `.env`):
 *
 *   SMTP_HOST   smtp.zoho.com
 *   SMTP_PORT   465
 *   SMTP_USER   diego@treehousestudio.com.br
 *   SMTP_PASS   Zoho app-specific password
 *               (Zoho Mail → Settings → Security → App Passwords)
 *   CONTACT_TO  optional — inbox that receives notifications;
 *               defaults to SMTP_USER
 */

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER;

/** True when SMTP is fully configured — gates every send. */
export const mailerConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

type Transport = ReturnType<typeof nodemailer.createTransport>;
let cachedTransport: Transport | null = null;

function getTransport(): Transport | null {
  if (!mailerConfigured) return null;
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
      auth: { user: SMTP_USER!, pass: SMTP_PASS! },
    });
  }
  return cachedTransport;
}

/** Best-effort SMTP verification, used by the self-test route. */
export async function verifyTransport(): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;
  try {
    await transport.verify();
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const BRAND_BLUE = "#2563eb";
const BRAND_DEEP = "#1e3a8a";
const INK = "#18181b";
const MUTED = "#71717a";
const LINE = "#e4e4e7";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Wraps body HTML in a minimal, email-client-safe shell. */
function shell(title: string, body: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
            <tr>
              <td style="padding:0 0 16px 4px;">
                <span style="font-size:15px;font-weight:800;letter-spacing:0.02em;color:${BRAND_DEEP};">TreeHouse&nbsp;Studio</span>
                <span style="font-size:11px;color:${MUTED};">&nbsp;&nbsp;·&nbsp;&nbsp;we make visuals</span>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid ${LINE};border-radius:12px;padding:28px;">
                <h1 style="margin:0 0 18px;font-size:18px;line-height:1.3;color:${INK};">${title}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:14px 4px;font-size:11px;color:${MUTED};">
                Sent automatically by the treehousestudio.com.br contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** One label/value row of the details table. */
function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${LINE};font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:${MUTED};width:110px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${LINE};font-size:14px;color:${INK};">${value}</td>
  </tr>`;
}

type SendResult = {
  sent: boolean;
  error?: string;
  /** Raw nodemailer response — used by tests / preview tooling. */
  response?: unknown;
};

async function send(options: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const transport = getTransport();
  if (!transport) {
    return { sent: false, error: "smtp-not-configured" };
  }
  try {
    const response = await transport.sendMail({
      from: `"TreeHouse Studio" <${SMTP_USER}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return { sent: true, response };
  } catch (err) {
    console.error("[mailer] send failed:", err);
    return {
      sent: false,
      error: err instanceof Error ? err.message : "unknown-smtp-error",
    };
  }
}

/* ------------------------------------------------------------------ */
/* Contact form                                                        */
/* ------------------------------------------------------------------ */

export type ContactPayload = {
  name: string;
  email: string;
  company?: string | null;
  /** Optional since the form no longer asks for scope up front. */
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string;
};

function contactDetailsHtml(data: ContactPayload): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${row("Name", escapeHtml(data.name))}
    ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND_BLUE};text-decoration:none;">${escapeHtml(data.email)}</a>`)}
    ${data.company ? row("Company", escapeHtml(data.company)) : ""}
    ${data.service ? row("Service", escapeHtml(data.service)) : ""}
    ${data.budget ? row("Budget", escapeHtml(data.budget)) : ""}
    ${data.timeline ? row("Timeline", escapeHtml(data.timeline)) : ""}
    <tr>
      <td style="padding:14px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:${MUTED};">Message</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:6px 0 0;font-size:14px;line-height:1.6;color:${INK};white-space:pre-wrap;">${escapeHtml(data.message)}</td>
    </tr>
  </table>`;
}

function contactDetailsText(data: ContactPayload): string {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    data.service ? `Service: ${data.service}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
    data.timeline ? `Timeline: ${data.timeline}` : null,
    "",
    "Message:",
    data.message,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/** Notifies the studio inbox about a new project inquiry. */
export async function sendContactNotification(
  data: ContactPayload,
): Promise<SendResult> {
  const to = CONTACT_TO || SMTP_USER;
  if (!to) return { sent: false, error: "smtp-not-configured" };
  const subject = `[Site] Novo contato — ${data.name}`;
  const body = contactDetailsHtml(data);
  return send({
    to,
    replyTo: data.email,
    subject,
    html: shell("Novo brief recebido pelo site", body),
    text: contactDetailsText(data),
  });
}

/** Confirms receipt to the visitor (best-effort, English like the site). */
export async function sendContactAutoReply(
  data: ContactPayload,
): Promise<SendResult> {
  const html = shell(
    "Thank you — your brief is on its way.",
    `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:${INK};">
      Hi ${escapeHtml(data.name.split(" ")[0])}, we received your project
      brief and will get back to you within 24&nbsp;hours at
      <a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND_BLUE};text-decoration:none;">${escapeHtml(data.email)}</a>.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:${INK};">
      In the meantime, feel free to reply to this e-mail with any extra
      references — mood boards, plans, deadlines.
    </p>
    <p style="margin:18px 0 0;font-size:13px;color:${MUTED};">
      — TreeHouse Studio · we make visuals
    </p>`,
  );
  const text = [
    `Hi ${data.name},`,
    "",
    "We received your brief and will get back to you really soon.",
    "",
    "— TreeHouse Studio · we make visuals",
  ].join("\n");
  return send({
    to: data.email,
    replyTo: CONTACT_TO || SMTP_USER || undefined,
    subject: "We received your brief — TreeHouse Studio",
    html,
    text,
  });
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

/** Notifies the studio inbox about a new newsletter signup. */
export async function sendNewsletterNotification(
  email: string,
  mood?: string | null,
): Promise<SendResult> {
  const to = CONTACT_TO || SMTP_USER;
  if (!to) return { sent: false, error: "smtp-not-configured" };
  const body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND_BLUE};text-decoration:none;">${escapeHtml(email)}</a>`)}
    ${mood ? row("Mood", escapeHtml(mood)) : ""}
  </table>`;
  return send({
    to,
    subject: `[Site] Nova inscrição na newsletter — ${email}`,
    html: shell("Nova inscrição na newsletter", body),
    text: `New newsletter signup: ${email}${mood ? `\nMood: ${mood}` : ""}`,
  });
}
