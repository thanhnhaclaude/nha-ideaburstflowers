"use client";

import { useId, useState, type FormEvent } from "react";
import { findZone, earliestDate, prettyDate } from "@/lib/delivery";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { IconAlert, IconArrow, IconCheck } from "./Icons";

export default function ZipChecker({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { delivery, setDelivery } = useCart();
  const [zip, setZip] = useState(delivery.zip);
  const [result, setResult] = useState<null | { ok: boolean; text: string }>(null);
  const id = useId();

  function check(e: FormEvent) {
    e.preventDefault();
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) {
      setResult({ ok: false, text: "Please enter a 5-digit ZIP code." });
      return;
    }
    const zone = findZone(z);
    if (!zone) {
      setResult({ ok: false, text: `We don't deliver to ${z} yet. Call us — we can often arrange delivery through a trusted partner florist.` });
      return;
    }
    setDelivery({ zip: z });
    const when = earliestDate(zone);
    setResult({
      ok: true,
      text: `Yes! We deliver to ${z} (${zone.name}) — ${zone.fee === 0 ? "free delivery" : `${money(zone.fee)} delivery`}. Earliest: ${prettyDate(when)}.`,
    });
  }

  return (
    <form onSubmit={check} className="field" noValidate>
      <label htmlFor={id} className={compact ? "label" : "sr-only"} style={dark ? { color: "var(--paper)" } : undefined}>
        Delivery ZIP code
      </label>
      <div className="inline-form">
        <input
          id={id}
          className="input"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="Enter ZIP, e.g. 59901"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          aria-describedby={`${id}-r`}
          aria-invalid={result ? !result.ok : undefined}
        />
        <button className={`btn ${dark ? "btn-light" : ""} ${compact ? "btn-sm" : ""}`} type="submit">
          Check {!compact && <IconArrow />}
        </button>
      </div>
      <div id={`${id}-r`} className="zip-result" aria-live="polite">
        {result && (
          <p className={`notice ${result.ok ? "ok" : "warn"} mt-2`}>
            {result.ok ? <IconCheck /> : <IconAlert />} {result.text}
          </p>
        )}
      </div>
    </form>
  );
}
