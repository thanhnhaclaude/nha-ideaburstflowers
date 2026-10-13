"use client";

import { useState, type FormEvent } from "react";
import { postJSON } from "@/lib/api";
import { IconArrow, IconCheck } from "./Icons";

export default function Newsletter() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("busy");
    try {
      await postJSON("/api/inquiry.php", { type: "newsletter", email: fd.get("email"), website: fd.get("website") });
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="notice ok" role="status">
        <IconCheck /> Welcome to the list — watch your inbox for seasonal notes and early access.
      </div>
    );
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate={false}>
      <h3>Letters from the studio</h3>
      <p>Seasonal stems, care rituals and first access to holiday collections. No more than twice a month.</p>
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <div className="inline-form">
        <input id="nl-email" className="input" type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
        <button className="btn btn-light" type="submit" disabled={state === "busy"} aria-label="Subscribe">
          {state === "busy" ? <span className="spinner" aria-hidden="true" /> : <IconArrow />}
        </button>
      </div>
      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === "error" && (
        <p className="small" role="alert" style={{ color: "#f0c9bf" }}>
          {error}
        </p>
      )}
    </form>
  );
}
