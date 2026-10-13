"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { postJSON } from "@/lib/api";
import { earliestDate, findZone, maxDate, prettyDate } from "@/lib/delivery";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { IconAlert, IconArrow, IconBag, IconLock, IconShield } from "./Icons";
import LineItem from "./LineItem";

const MSG_MAX = 250;

type Errors = Partial<Record<"zip" | "date" | "recipient" | "message", string>>;

export default function CartView() {
  const { lines, subtotal, delivery, setDelivery, ready } = useCart();
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");

  const zone = useMemo(() => (/^\d{5}$/.test(delivery.zip) ? findZone(delivery.zip) : undefined), [delivery.zip]);
  const minDate = earliestDate(zone);
  const fee = zone?.fee ?? 0;
  const total = subtotal + fee;

  function validate(): Errors {
    const e: Errors = {};
    if (!/^\d{5}$/.test(delivery.zip)) e.zip = "Enter the recipient's 5-digit ZIP code.";
    else if (!zone) e.zip = "We don't deliver to this ZIP yet — please call us and we'll arrange it.";
    if (!delivery.date) e.date = "Choose a delivery date.";
    else if (delivery.date < minDate) e.date = `The earliest available date is ${prettyDate(minDate)}.`;
    if (!delivery.recipient.trim()) e.recipient = "Who are the flowers for?";
    if (delivery.message.length > MSG_MAX) e.message = `Please keep your message under ${MSG_MAX} characters.`;
    return e;
  }

  async function checkout(ev: FormEvent) {
    ev.preventDefault();
    setServerError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const res = await postJSON<{ url: string }>("/api/checkout.php", {
        mode: "payment",
        items: lines.map((l) => ({ id: l.id, qty: l.qty, addons: l.addons })),
        delivery,
      });
      window.location.assign(res.url);
    } catch (err) {
      setServerError((err as Error).message);
      setBusy(false);
    }
  }

  if (!ready) return <div style={{ minHeight: 400 }} aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <IconBag />
        <h2 className="h3">Your bag is empty</h2>
        <p className="muted">Browse the collection and add something beautiful.</p>
        <Link href="/shop/" className="btn">
          Shop all flowers <IconArrow />
        </Link>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className="error" id={`e-${k}`}>
        {errors[k]}
      </span>
    ) : null;

  return (
    <form className="cart-layout" onSubmit={checkout} noValidate>
      <div className="stack" style={{ gap: 32 }}>
        <section className="panel" aria-labelledby="bag-h">
          <h2 className="panel-title" id="bag-h">
            <span className="step-num">1</span>Your bag
          </h2>
          <ul role="list">
            {lines.map((l) => (
              <LineItem key={l.key} line={l} />
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="del-h">
          <h2 className="panel-title" id="del-h">
            <span className="step-num">2</span>Delivery details
          </h2>
          <div className="form-grid two">
            <div className="field">
              <label htmlFor="f-zip">Recipient ZIP code</label>
              <input
                id="f-zip"
                className="input"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={delivery.zip}
                onChange={(e) => setDelivery({ zip: e.target.value.replace(/\D/g, "") })}
                aria-invalid={!!errors.zip}
                aria-describedby="h-zip e-zip"
              />
              <span className="hint" id="h-zip" aria-live="polite">
                {zone ? `${zone.name} — ${zone.fee === 0 ? "free delivery" : `${money(zone.fee)} delivery`}${zone.sameDay ? ", same-day available" : ""}` : "Full street address is collected securely at payment."}
              </span>
              {err("zip")}
            </div>
            <div className="field">
              <label htmlFor="f-date">Delivery date</label>
              <input
                id="f-date"
                className="input"
                type="date"
                min={minDate}
                max={maxDate()}
                value={delivery.date}
                onChange={(e) => setDelivery({ date: e.target.value })}
                aria-invalid={!!errors.date}
                aria-describedby="h-date e-date"
              />
              <span className="hint" id="h-date">
                {delivery.date && delivery.date >= minDate ? prettyDate(delivery.date) : `Earliest: ${prettyDate(minDate)}`}
              </span>
              {err("date")}
            </div>
            <div className="field">
              <label htmlFor="f-recipient">Recipient name</label>
              <input
                id="f-recipient"
                className="input"
                autoComplete="off"
                value={delivery.recipient}
                onChange={(e) => setDelivery({ recipient: e.target.value })}
                aria-invalid={!!errors.recipient}
                aria-describedby="e-recipient"
              />
              {err("recipient")}
            </div>
            <div className="field">
              <label htmlFor="f-from">
                From <span className="muted">(signature on card)</span>
              </label>
              <input id="f-from" className="input" autoComplete="name" value={delivery.from} onChange={(e) => setDelivery({ from: e.target.value })} />
            </div>
            <div className="field full">
              <label htmlFor="f-message">Card message</label>
              <textarea
                id="f-message"
                className="textarea"
                maxLength={MSG_MAX}
                placeholder="Happy birthday! Wishing you a year as bright as these blooms."
                value={delivery.message}
                onChange={(e) => setDelivery({ message: e.target.value })}
                aria-invalid={!!errors.message}
                aria-describedby="h-message e-message"
              />
              <span className="hint" id="h-message">
                {delivery.message.length}/{MSG_MAX} · Hand-written by our team
              </span>
              {err("message")}
            </div>
            <div className="field full">
              <label htmlFor="f-instructions">
                Delivery instructions <span className="muted">(optional)</span>
              </label>
              <input
                id="f-instructions"
                className="input"
                placeholder="Gate code, suite number, best time to deliver…"
                value={delivery.instructions}
                onChange={(e) => setDelivery({ instructions: e.target.value })}
              />
            </div>
          </div>
        </section>
      </div>

      <aside className="panel cart-summary" aria-labelledby="sum-h">
        <h2 className="panel-title" id="sum-h">
          <span className="step-num">3</span>Summary
        </h2>
        <div className="stack" style={{ gap: 12 }}>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{zone ? (fee === 0 ? "Free" : money(fee)) : "Enter ZIP"}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span className="muted">Calculated at payment</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
        {serverError && (
          <p className="notice err mt-5" role="alert">
            <IconAlert /> {serverError}
          </p>
        )}
        {Object.keys(errors).length > 0 && (
          <p className="notice warn mt-5" role="alert">
            <IconAlert /> Please review the highlighted delivery details.
          </p>
        )}
        <button type="submit" className="btn btn-rose btn-block mt-5" disabled={busy} aria-busy={busy}>
          {busy ? (
            <>
              <span className="spinner" aria-hidden="true" /> Opening secure checkout…
            </>
          ) : (
            <>
              <IconLock /> Secure checkout
            </>
          )}
        </button>
        <p className="secure-note mt-4">
          <IconShield /> Payments processed by Stripe. Apple Pay &amp; Google Pay accepted.
        </p>
      </aside>
    </form>
  );
}
