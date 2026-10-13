// Contact / event / newsletter / review emails for the Node.js build
// (mirror of hosting/static/api/inquiry.php). Sends through SMTP (Hostinger mail).
import nodemailer from "nodemailer";
import { clientIp, fail, rateLimit, str } from "./http";

type Obj = Record<string, unknown>;

const TYPES = ["contact", "event", "newsletter", "review"] as const;
type Kind = (typeof TYPES)[number];

const FIELDS: [string, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["topic", "Topic"],
  ["eventType", "Event type"],
  ["eventDate", "Event date"],
  ["guests", "Guests"],
  ["venue", "Venue"],
  ["budget", "Budget"],
  ["displayName", "Display name"],
  ["city", "City"],
  ["occasion", "Occasion"],
  ["message", "Message"],
];

const SUBJECTS: Record<Kind, string> = {
  contact: "New website message",
  event: "New wedding/event inquiry",
  newsletter: "New newsletter subscriber",
  review: "New customer review",
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;
function mailer() {
  if (transport) return transport;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  return transport;
}

export async function sendInquiry(body: Obj, req: Request) {
  rateLimit(req, "inquiry", 6, 300);

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (str(body.website, 200)) return {};

  const type: Kind = TYPES.includes(body.type as Kind) ? (body.type as Kind) : "contact";
  const email = str(body.email, 200);
  if (!EMAIL_RE.test(email)) fail(422, "Please enter a valid email address.");
  if (type !== "newsletter" && !str(body.message, 10)) fail(422, "Please include a message.");

  const lines = [`Type: ${type[0].toUpperCase()}${type.slice(1)}`, `Email: ${email}`];
  for (const [key, label] of FIELDS) {
    const val = str(body[key], key === "message" ? 3000 : 200);
    if (val) lines.push(`${label}: ${val}`);
  }
  if (type === "review") {
    if (body.consent !== true) fail(422, "Please confirm we may publish your review.");
    const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating) || 5)));
    lines.push(`Rating: ${rating}/5`);
    lines.push(`Publish consent: YES (${new Date().toISOString()}, IP ${clientIp(req)})`);
    lines.push(`Photo consent: ${body.photoConsent === true ? "YES — email customer to request photo" : "no"}`);
  }

  const t = mailer();
  if (!t) {
    console.error("[ideaburst inquiry] SMTP not configured", lines.join(" | "));
    fail(503, "Our contact form is being set up. Please email or call us directly.");
  }

  const name = str(body.name, 100).replace(/[\r\n"]/g, "");
  const to = process.env.MAIL_TO || process.env.SMTP_USER!;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  try {
    await t!.sendMail({
      from: `IdeaBurst Website <${from}>`,
      to,
      replyTo: name ? `"${name}" <${email}>` : email,
      subject: `[IdeaBurst] ${SUBJECTS[type]}${name ? ` — ${name}` : ""}`,
      text: `${lines.join("\n")}\n\n— Sent ${new Date().toISOString()}\n`,
    });
  } catch (err) {
    console.error("[ideaburst inquiry] send failed", err);
    fail(502, "We couldn't send your message just now. Please email or call us directly.");
  }
  return {};
}
