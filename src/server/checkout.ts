// Stripe Checkout Session creation for the Node.js build
// (mirror of hosting/static/api/checkout.php). Prices always come from the catalog.
import catalog from "@/data/catalog.json";
import { clientIp, fail, rateLimit, siteUrl, str } from "./http";

type Obj = Record<string, unknown>;

/** Encode nested params the way Stripe expects: a[b][0][c]=v */
function formEncode(value: unknown, prefix = "", out = new URLSearchParams()) {
  if (Array.isArray(value)) value.forEach((v, i) => formEncode(v, `${prefix}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) formEncode(v, prefix ? `${prefix}[${k}]` : k, out);
  else if (value !== undefined && value !== null) out.append(prefix, String(value));
  return out;
}

/** Date parts in the shop's timezone. */
function shopDate(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: catalog.delivery.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(Date.now() + offsetDays * 86_400_000));
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { iso: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

const cents = (usd: number) => Math.round(usd * 100);

export async function createCheckout(body: Obj, req: Request) {
  rateLimit(req, "checkout", 12, 60);

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) fail(503, "Online checkout is being set up. Please call us to place your order — we answer 24/7.");
  const site = siteUrl(req);

  // ---------- Delivery ----------
  const d = (body.delivery && typeof body.delivery === "object" ? body.delivery : {}) as Obj;
  const zip = str(d.zip, 10).replace(/\D/g, "");
  const date = str(d.date, 10);
  const recipient = str(d.recipient, 80);
  const from = str(d.from, 80);
  const message = str(d.message, 250);
  const instructions = str(d.instructions, 300);

  const zone = catalog.delivery.zones.find((z) => z.zips.includes(zip));
  if (!zone) fail(422, "We don't deliver to that ZIP code yet. Please call us and we'll help arrange it.");
  if (!recipient) fail(422, "Please add the recipient's name.");

  const today = shopDate();
  const earliest = zone!.sameDay && today.hour < catalog.delivery.cutoffHour ? today.iso : shopDate(1).iso;
  const latest = shopDate(90).iso;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < earliest || date > latest) {
    fail(422, `Please choose a delivery date between ${earliest} and ${latest}.`);
  }
  const prettyDate = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

  const metadata: Record<string, string> = {
    delivery_date: date,
    delivery_zip: zip,
    delivery_zone: zone!.name,
    recipient,
    card_from: from,
    card_message: message,
    instructions,
  };

  const params: Obj = {
    billing_address_collection: "auto",
    shipping_address_collection: { allowed_countries: ["US"] },
    phone_number_collection: { enabled: "true" },
    success_url: `${site}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/checkout/cancel/`,
    custom_text: { shipping_address: { message: `Enter the recipient's delivery address in ZIP ${zip}. Delivery: ${prettyDate}.` } },
  };
  if (process.env.STRIPE_TAX === "true") params.automatic_tax = { enabled: "true" };

  if (body.mode === "subscription") {
    // ---------- Subscription ----------
    const sub = (body.subscription && typeof body.subscription === "object" ? body.subscription : {}) as Obj;
    const plan = catalog.plans.find((p) => p.id === sub.plan);
    const freq = catalog.frequencies.find((f) => f.id === sub.frequency);
    if (!plan || !freq) fail(422, "Please choose a subscription plan and frequency.");
    const unit = Math.round(plan!.price * (100 - freq!.discount)) / 100;
    Object.assign(metadata, { plan: plan!.id, frequency: freq!.id, first_delivery: date });
    Object.assign(params, {
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: cents(unit),
            recurring: { interval: freq!.interval, interval_count: freq!.count },
            product_data: { name: `${plan!.name} Flower Subscription — ${freq!.name}` },
          },
        },
      ],
      metadata,
      subscription_data: { metadata, description: `First delivery ${date} for ${recipient}` },
    });
  } else {
    // ---------- One-time order ----------
    const items = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
    if (!items.length) fail(422, "Your bag is empty.");

    const lineItems: Obj[] = [];
    const summary: string[] = [];
    for (const raw of items as Obj[]) {
      const p = catalog.products.find((x) => x.id === raw?.id);
      const qty = Number(raw?.qty);
      if (!p || !Number.isInteger(qty) || qty < 1 || qty > 20) fail(422, "One of the items in your bag is no longer available. Please refresh and try again.");

      const extras = [...new Set((Array.isArray(raw.addons) ? raw.addons : []).filter((a): a is string => typeof a === "string"))]
        .map((id) => catalog.addons.find((a) => a.id === id))
        .filter((a) => !!a);
      const unit = p!.price + extras.reduce((s, a) => s + a.price, 0);
      const image = p!.image.startsWith("/") ? `${site}${p!.image}` : `https://images.unsplash.com/photo-${p!.image}?auto=format&fit=crop&w=600&h=750&q=75`;

      lineItems.push({
        quantity: qty,
        price_data: {
          currency: "usd",
          unit_amount: cents(unit),
          product_data: {
            name: `${p!.name} (${p!.sku})`,
            images: [image],
            ...(extras.length ? { description: `Includes: ${extras.map((a) => a.name).join(", ")}` } : {}),
          },
        },
      });
      summary.push(`${qty}x ${p!.sku}${extras.length ? " +" + extras.map((a) => a.name).join("/") : ""}`);
    }
    if (zone!.fee > 0) {
      lineItems.push({ quantity: 1, price_data: { currency: "usd", unit_amount: cents(zone!.fee), product_data: { name: `Delivery — ${zone!.name}` } } });
    }

    metadata.items = summary.join("; ").slice(0, 490);
    Object.assign(params, {
      mode: "payment",
      line_items: lineItems,
      metadata,
      payment_intent_data: { metadata, description: `Flowers for ${recipient} on ${date}` },
      submit_type: "pay",
      customer_creation: "always",
    });
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: formEncode(params),
    signal: AbortSignal.timeout(20_000),
  }).catch((e) => {
    console.error("[ideaburst checkout] network", e);
    return null;
  });
  const data = res ? ((await res.json().catch(() => null)) as { url?: string; error?: { message?: string } } | null) : null;
  if (!res?.ok || !data?.url) {
    console.error(`[ideaburst checkout] Stripe ${res?.status} from ${clientIp(req)}: ${data?.error?.message ?? "no response"}`);
    fail(502, "We couldn't open secure checkout just now. Please try again, or call us and we'll take your order by phone.");
  }
  return { url: data!.url };
}
