"use client";

import { useState, type FormEvent } from "react";
import { btn, control, label } from "./ui";

type Props = {
  type?: "contact" | "showing";
  listingSlug?: string;
  submitLabel?: string;
  defaultMessage?: string;
  messageLabel?: string;
};

export function LeadForm({
  type = "contact",
  listingSlug,
  submitLabel = "Send message",
  defaultMessage = "",
  messageLabel = "How can we help?",
}: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, type, listingSlug, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div role="status" className="py-6 text-center">
        <div className="eyebrow">Sent</div>
        <p className="mt-2 font-serif text-2xl">Thank you.</p>
        <p className="mt-2 text-sm text-muted-foreground">We&apos;ll follow up within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Name *
          <input name="name" required autoComplete="name" maxLength={100} className={control} />
        </label>
        <label className={label}>
          Email *
          <input name="email" type="email" required autoComplete="email" maxLength={200} className={control} />
        </label>
      </div>
      <label className={label}>
        Phone (optional)
        <input name="phone" type="tel" autoComplete="tel" maxLength={30} className={control} />
      </label>
      <label className={label}>
        {messageLabel}
        <textarea name="message" rows={5} defaultValue={defaultMessage} maxLength={2000} className={control} />
      </label>
      {/* Honeypot: real people never see or fill this */}
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="flex items-start gap-3 text-xs text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>I agree to be contacted by phone, text or email about my inquiry. Msg/data rates may apply.</span>
      </label>
      <button className={`${btn.primary} w-full`} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
      {state === "err" ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
