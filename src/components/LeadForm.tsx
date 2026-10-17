"use client";

import { useState, type FormEvent } from "react";

type Props = {
  type?: "contact" | "showing";
  listingSlug?: string;
  submitLabel?: string;
  defaultMessage?: string;
};

export function LeadForm({ type = "contact", listingSlug, submitLabel = "Send message", defaultMessage = "" }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, type, listingSlug, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <p className="notice ok" role="status">
        Thanks — your message is in. I&apos;ll get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form-grid" noValidate={false}>
      <label>
        Name
        <input name="name" required autoComplete="name" maxLength={100} />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" maxLength={200} />
      </label>
      <label className="full">
        Phone (optional)
        <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
      </label>
      <label className="full">
        Message
        <textarea name="message" defaultValue={defaultMessage} maxLength={2000} />
      </label>
      {/* Honeypot: real people never see or fill this */}
      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox full">
        <input type="checkbox" name="consent" required />
        <span className="small">I agree to be contacted by phone, text or email about my inquiry. Msg/data rates may apply.</span>
      </label>
      {state === "err" && (
        <p className="notice err full" role="alert">
          {error}
        </p>
      )}
      <div className="full">
        <button className="btn" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
