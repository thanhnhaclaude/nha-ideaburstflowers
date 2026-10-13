"use client";

import { useMemo, useState, type FormEvent } from "react";
import { postJSON } from "@/lib/api";
import { frequencies, plans } from "@/lib/catalog";
import { earliestDate, findZone, maxDate, prettyDate, useMounted } from "@/lib/delivery";
import { money } from "@/lib/format";
import { IconAlert, IconCheck, IconLock } from "./Icons";

export function planPrice(base: number, discount: number) {
  return Math.round(base * (100 - discount)) / 100;
}

export default function SubscriptionBuilder() {
  const [planId, setPlanId] = useState(plans.find((p) => p.featured)?.id ?? plans[0].id);
  const [freqId, setFreqId] = useState("biweekly");
  const [zip, setZip] = useState("");
  const [start, setStart] = useState("");
  const [recipient, setRecipient] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const plan = plans.find((p) => p.id === planId)!;
  const freq = frequencies.find((f) => f.id === freqId)!;
  const price = planPrice(plan.price, freq.discount);
  const zone = useMemo(() => (/^\d{5}$/.test(zip) ? findZone(zip) : undefined), [zip]);
  const mounted = useMounted();
  const minDate = earliestDate(zone);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!zone) return setError(/^\d{5}$/.test(zip) ? "Subscriptions are available within our local delivery area only." : "Enter a 5-digit delivery ZIP code.");
    if (!start || start < minDate) return setError(`Choose a start date on or after ${prettyDate(minDate)}.`);
    if (!recipient.trim()) return setError("Add the recipient's name.");
    setBusy(true);
    try {
      const res = await postJSON<{ url: string }>("/api/checkout.php", {
        mode: "subscription",
        subscription: { plan: plan.id, frequency: freq.id },
        delivery: { zip, date: start, recipient, message: "", from: "", instructions: "" },
      });
      window.location.assign(res.url);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="stack" style={{ gap: 48 }}>
      <div>
        <h2 className="h3" id="plan-h" style={{ marginBottom: 24 }}>
          1. Choose your size
        </h2>
        <div className="plan-grid" role="group" aria-labelledby="plan-h">
          {plans.map((p) => (
            <button key={p.id} type="button" className="plan" aria-pressed={p.id === planId} onClick={() => setPlanId(p.id)}>
              {p.featured && <span className="flag">Most loved</span>}
              <span className="radio" aria-hidden="true" />
              <h3>{p.name}</h3>
              <span className="amount">
                {money(planPrice(p.price, freq.discount))} <small>/ delivery</small>
              </span>
              <p className="muted">{p.description}</p>
              <ul className="checklist" role="list">
                {p.features.map((f) => (
                  <li key={f}>
                    <IconCheck /> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="h3" id="freq-h" style={{ marginBottom: 24 }}>
          2. How often?
        </h2>
        <div className="chip-row" role="group" aria-labelledby="freq-h">
          {frequencies.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={f.id === freqId} onClick={() => setFreqId(f.id)}>
              {f.name}
              {f.discount > 0 && ` · save ${f.discount}%`}
            </button>
          ))}
        </div>
      </div>

      <div className="split" style={{ alignItems: "start", gap: 48 }}>
        <div>
          <h2 className="h3" style={{ marginBottom: 24 }}>
            3. Where &amp; when
          </h2>
          <div className="form-grid two">
            <div className="field">
              <label htmlFor="s-zip">Delivery ZIP</label>
              <input id="s-zip" className="input" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))} />
              <span className="hint" aria-live="polite">
                {zone ? `${zone.name} — free subscription delivery` : "Kalispell & Flathead Valley"}
              </span>
            </div>
            <div className="field">
              <label htmlFor="s-start">First delivery</label>
              <input id="s-start" className="input" type="date" min={mounted ? minDate : undefined} max={mounted ? maxDate() : undefined} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="field full">
              <label htmlFor="s-recipient">Recipient name</label>
              <input id="s-recipient" className="input" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow no-rule">Your subscription</p>
          <p className="h3 mt-4">
            {plan.name}, {freq.name.toLowerCase()}
          </p>
          <div className="stack mt-5" style={{ gap: 10 }}>
            <div className="summary-row">
              <span>Per delivery</span>
              <span>{money(price)}</span>
            </div>
            {freq.discount > 0 && (
              <div className="summary-row">
                <span>Frequency saving</span>
                <span style={{ color: "var(--success)" }}>−{freq.discount}%</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Billed {freq.name.toLowerCase()}</span>
              <span>{money(price)}</span>
            </div>
          </div>
          {error && (
            <p className="notice err mt-5" role="alert">
              <IconAlert /> {error}
            </p>
          )}
          <button type="submit" className="btn btn-rose btn-block mt-5" disabled={busy} aria-busy={busy}>
            {busy ? <span className="spinner" aria-hidden="true" /> : <IconLock />} Start subscription
          </button>
          <p className="small muted mt-4" style={{ textAlign: "center" }}>
            Pause, skip or cancel anytime by email or phone.
          </p>
        </div>
      </div>
    </form>
  );
}
