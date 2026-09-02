/**
 * Testa o caminho real de envio SMTP do mailer usando o Ethereal
 * (SMTP de teste do nodemailer). Gera URLs de preview dos e-mails.
 *
 * Uso: bun run scripts/test-mailer.ts
 */
import nodemailer from "nodemailer";

async function main() {
  // 1) Cria conta SMTP de teste no Ethereal.
  const account = await nodemailer.createTestAccount();
  console.log("ethereal account ready:", account.user);

  // 2) Aponta as env vars do mailer para o Ethereal ANTES do import,
  //    pois o módulo lê as variáveis no load.
  process.env.SMTP_HOST = "smtp.ethereal.email";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = account.user;
  process.env.SMTP_PASS = account.pass;
  process.env.CONTACT_TO = account.user;

  const { sendContactNotification, sendContactAutoReply, sendNewsletterNotification, mailerConfigured } =
    await import("../src/lib/mailer");

  console.log("mailerConfigured:", mailerConfigured);

  const payload = {
    name: "Maria Arquiteta",
    email: "maria@arquitetura.com.br",
    company: "Arquitetura & Co",
    service: "Architectural Visualization",
    budget: "$15k – $40k",
    timeline: "1–3 months",
    message:
      "Olá! Preciso de imagens para uma residência unifamiliar em Florianópolis. São 4 imagens externas e 2 internas, com prazo de 3 semanas. Tenho projeto no ArchiCAD e referências no Pinterest.",
  };

  // 3) Envia os 3 e-mails do fluxo real.
  const notification = await sendContactNotification(payload);
  console.log("notification:", notification.sent ? "SENT" : `FAILED (${notification.error})`);

  const autoReply = await sendContactAutoReply(payload);
  console.log("auto-reply:", autoReply.sent ? "SENT" : `FAILED (${autoReply.error})`);

  const newsletter = await sendNewsletterNotification("ninja@arch.com", "brutalist warm woods");
  console.log("newsletter:", newsletter.sent ? "SENT" : `FAILED (${newsletter.error})`);

  // 4) URLs de preview (válido por 30 dias).
  for (const [label, result] of [
    ["notification", notification],
    ["auto-reply", autoReply],
    ["newsletter", newsletter],
  ] as const) {
    const url = nodemailer.getTestMessageUrl(result.response);
    if (url && typeof url === "string") console.log(`preview ${label}:`, url);
  }
}

main().catch((err) => {
  console.error("test failed:", err);
  process.exit(1);
});
