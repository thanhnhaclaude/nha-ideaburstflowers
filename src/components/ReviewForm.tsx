"use client";

import { useState, type FormEvent } from "react";
import { postJSON } from "@/lib/api";
import { site } from "@/lib/catalog";
import { IconAlert, IconArrow, IconCheck, IconStar } from "./Icons";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const bad: Record<string, boolean> = {};
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (el.name && el.required && !el.checkValidity()) bad[el.name] = true;
    }
    setInvalid(bad);
    if (Object.keys(bad).length) {
      setError("Please complete the highlighted fields.");
      (form.querySelector(":invalid") as HTMLElement | null)?.focus();
      return;
    }
    const fd = new FormData(form);
    setError("");
    setState("busy");
    try {
      await postJSON("/api/inquiry.php", {
        type: "review",
        rating,
        name: fd.get("name"),
        displayName: fd.get("displayName"),
        city: fd.get("city"),
        email: fd.get("email"),
        occasion: fd.get("occasion"),
        message: fd.get("message"),
        consent: fd.get("consent") === "on",
        photoConsent: fd.get("photoConsent") === "on",
        website: fd.get("website"),
      });
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="panel stack" role="status">
        <p className="notice ok">
          <IconCheck /> Thank you — your review means the world to our small studio.
        </p>
        <p className="muted">
          Our team reads every review before it appears on the site. If you&rsquo;d like your photo shown, simply reply to our confirmation email or send it to {site.email}.
        </p>
      </div>
    );
  }

  const inv = (n: string) => (invalid[n] ? true : undefined);

  return (
    <form className="panel" onSubmit={onSubmit} noValidate>
      <div className="form-grid two">
        <fieldset className="field full" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="label" style={{ marginBottom: 8 }}>
            Your rating
          </legend>
          <div className="rating-input" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className={n <= rating ? "on" : undefined}
                onClick={() => setRating(n)}
              >
                <IconStar />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="r-name">Full name</label>
          <input id="r-name" name="name" className="input" required autoComplete="name" aria-invalid={inv("name")} />
          <span className="hint">Kept private — used only to match your order.</span>
        </div>
        <div className="field">
          <label htmlFor="r-display">Name to display</label>
          <input id="r-display" name="displayName" className="input" required placeholder="e.g. Sarah M." aria-invalid={inv("displayName")} />
          <span className="hint">First name and last initial is perfect.</span>
        </div>
        <div className="field">
          <label htmlFor="r-city">City</label>
          <input id="r-city" name="city" className="input" placeholder="e.g. Whitefish, MT" autoComplete="address-level2" />
        </div>
        <div className="field">
          <label htmlFor="r-email">Email</label>
          <input id="r-email" name="email" type="email" className="input" required autoComplete="email" aria-invalid={inv("email")} />
          <span className="hint">Never published.</span>
        </div>
        <div className="field full">
          <label htmlFor="r-occasion">
            Occasion <span className="muted">(optional)</span>
          </label>
          <select id="r-occasion" name="occasion" className="select" defaultValue="">
            <option value="">Select…</option>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Grand opening</option>
            <option>Sympathy</option>
            <option>Wedding</option>
            <option>Just because</option>
            <option>Subscription</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="r-message">Your review</label>
          <textarea id="r-message" name="message" className="textarea" required minLength={10} maxLength={1200} aria-invalid={inv("message")} placeholder="How were the flowers? How did the recipient react?" />
        </div>
        <label className="check full">
          <input type="checkbox" name="consent" required aria-invalid={inv("consent")} />
          <span className="check-body">
            <span className="check-title">I agree to IdeaBurst Flowers publishing my review, display name and city on its website and marketing.</span>
          </span>
        </label>
        <label className="check full">
          <input type="checkbox" name="photoConsent" />
          <span className="check-body">
            <span className="check-title">I&rsquo;m happy to share a photo with my review</span>
            <span className="check-desc">We&rsquo;ll email you to request it. Optional — you can withdraw permission anytime.</span>
          </span>
        </label>
      </div>
      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && (
        <p className="notice err mt-5" role="alert">
          <IconAlert /> {error}
        </p>
      )}
      <button type="submit" className="btn mt-5" disabled={state === "busy"} aria-busy={state === "busy"}>
        {state === "busy" ? <span className="spinner" aria-hidden="true" /> : null}
        Submit review {state !== "busy" && <IconArrow />}
      </button>
    </form>
  );
}
