// Shared helpers for the Node.js route handlers (mirror of hosting/static/api/_bootstrap.php).

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const fail = (status: number, message: string): never => {
  throw new HttpError(status, message);
};

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

/** Wraps a handler: JSON in, JSON out, consistent error shape. */
export function handler(fn: (body: Record<string, unknown>, req: Request) => Promise<Record<string, unknown>>) {
  return async (req: Request) => {
    try {
      const origin = req.headers.get("origin");
      const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
      if (origin && host && new URL(origin).host !== host) fail(403, "Forbidden.");

      const raw = await req.text();
      if (raw.length > 64 * 1024) fail(413, "Request too large.");
      let body: unknown;
      try {
        body = JSON.parse(raw);
      } catch {
        fail(400, "Invalid request.");
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) fail(400, "Invalid request.");

      return json({ ok: true, ...(await fn(body as Record<string, unknown>, req)) });
    } catch (err) {
      if (err instanceof HttpError) return json({ ok: false, error: err.message }, err.status);
      console.error("[ideaburst api]", err);
      return json({ ok: false, error: "Something went wrong. Please call us and we'll help right away." }, 500);
    }
  };
}

const buckets = new Map<string, number[]>();

/** In-memory rate limiter: `max` requests per `windowSec` per client IP. */
export function rateLimit(req: Request, bucket: string, max: number, windowSec: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => t > now - windowSec * 1000);
  if (hits.length >= max) fail(429, "Too many requests. Please wait a minute and try again.");
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
}

/** Trimmed, control-character-free string capped at `max` chars. */
export function str(v: unknown, max: number) {
  if (typeof v !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "?";
}

export function siteUrl(req: Request) {
  const env = process.env.SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
