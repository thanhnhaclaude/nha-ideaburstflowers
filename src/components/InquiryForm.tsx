"use client";

import { useState, type FormEvent } from "react";
import { postJSON } from "@/lib/api";
import { IconAlert, IconArrow, IconCheck } from "./Icons";

type Kind = "event" | "contact";

export default function InquiryForm({ kind }: { kind: Kind }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const bad: Record<string, boolean> = {};
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (el.name && el.required && !el.checkValidity()) bad[el.name] = true;
    }
    setInvalid(bad);
    if (Object.keys(bad).length) {
      setError("Please complete the highlighted fields.");
      (form.querySelector('[aria-invalid="true"], :invalid') as HTMLElement | null)?.focus();
      return;
    }
    setError("");
    setState("busy");
    try {
      await postJSON("/api/inquiry.php", { type: kind, ...data });
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
          <IconCheck /> Thank you — your message is with our team.
        </p>
        <p className="muted">
          {kind === "event"
            ? "A member of our events team will reach out within one business day to schedule your consultation."
            : "We reply to every message within a few hours during studio hours. For anything urgent, call our 24/7 hotline."}
        </p>
      </div>
    );
  }

  const inv = (n: string) => (invalid[n] ? true : undefined);

  return (
    <form className="panel" onSubmit={onSubmit} noValidate>
      <div className="form-grid two">
        <div className="field">
          <label htmlFor="q-name">Full name</label>
          <input id="q-name" name="name" className="input" required autoComplete="name" aria-invalid={inv("name")} />
        </div>
        <div className="field">
          <label htmlFor="q-email">Email</label>
          <input id="q-email" name="email" type="email" className="input" required autoComplete="email" aria-invalid={inv("email")} />
        </div>
        <div className="field">
          <label htmlFor="q-phone">
            Phone <span className="muted">(optional)</span>
          </label>
          <input id="q-phone" name="phone" type="tel" className="input" autoComplete="tel" />
        </div>
        {kind === "event" ? (
          <>
            <div className="field">
              <label htmlFor="q-type">Event type</label>
              <select id="q-type" name="eventType" className="select" defaultValue="Wedding">
                <option>Wedding</option>
                <option>Elopement</option>
                <option>Corporate event</option>
                <option>Weekly office florals</option>
                <option>Private celebration</option>
                <option>Memorial service</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="q-date">Event date</label>
              <input id="q-date" name="eventDate" type="date" className="input" />
            </div>
            <div className="field">
              <label htmlFor="q-guests">Guest count</label>
              <select id="q-guests" name="guests" className="select" defaultValue="50–100">
                <option>Under 50</option>
                <option>50–100</option>
                <option>100–200</option>
                <option>200+</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="q-venue">Venue / location</label>
              <input id="q-venue" name="venue" className="input" placeholder="e.g. Flathead Lake, Whitefish" />
            </div>
            <div className="field">
              <label htmlFor="q-budget">Floral budget</label>
              <select id="q-budget" name="budget" className="select" defaultValue="$2,500 – $5,000">
                <option>Under $1,000</option>
                <option>$1,000 – $2,500</option>
                <option>$2,500 – $5,000</option>
                <option>$5,000 – $10,000</option>
                <option>$10,000+</option>
              </select>
            </div>
          </>
        ) : (
          <div className="field">
            <label htmlFor="q-topic">Topic</label>
            <select id="q-topic" name="topic" className="select" defaultValue="Order question">
              <option>Order question</option>
              <option>Custom arrangement</option>
              <option>Corporate account</option>
              <option>Feedback</option>
              <option>Other</option>
            </select>
          </div>
        )}
        <div className="field full">
          <label htmlFor="q-message">{kind === "event" ? "Tell us about your vision" : "Message"}</label>
          <textarea
            id="q-message"
            name="message"
            className="textarea"
            required
            maxLength={3000}
            aria-invalid={inv("message")}
            placeholder={kind === "event" ? "Colors, mood, favorite flowers, Pinterest links…" : "How can we help?"}
          />
        </div>
      </div>
      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && (
        <p className="notice err mt-5" role="alert">
          <IconAlert /> {error}
        </p>
      )}
      <button type="submit" className="btn mt-5" disabled={state === "busy"} aria-busy={state === "busy"}>
        {state === "busy" ? <span className="spinner" aria-hidden="true" /> : null}
        {kind === "event" ? "Request a consultation" : "Send message"} {state !== "busy" && <IconArrow />}
      </button>
    </form>
  );
}
