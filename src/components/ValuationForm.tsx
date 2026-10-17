"use client";

import { useState, type FormEvent } from "react";
import { btn, control, label } from "./ui";

type Estimate = { value: number; low: number; high: number } | null;

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/**
 * 3-step home valuation: address → details → contact → result.
 * The lead is always captured; an instant estimate is shown only when the
 * server has an AVM key configured (RENTCAST_API_KEY).
 */
export function ValuationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "err">("idle");
  const [estimate, setEstimate] = useState<Estimate>(null);
  const [error, setError] = useState("");

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setData((d) => ({ ...d, ...fd }));
    setStep((s) => s + 1);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...fd }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setEstimate(json.estimate ?? null);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("err");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="py-4 text-center">
        {estimate ? (
          <>
            <div className="eyebrow">Instant estimate</div>
            <p className="mt-2 font-serif text-5xl">{usd(estimate.value)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Likely range {usd(estimate.low)} – {usd(estimate.high)}
            </p>
            <p className="mx-auto mt-4 max-w-md text-xs text-muted-foreground">
              Automated estimates use public records and nearby sales and can&apos;t see upgrades or condition. We&apos;ll
              follow up with a personal valuation within one business day.
            </p>
          </>
        ) : (
          <>
            <div className="eyebrow">Received</div>
            <h2 className="mt-2 font-serif text-2xl">Thank you.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We&apos;ll review recent comparable sales near {data.address || "your home"} and be in touch within one
              business day.
            </p>
          </>
        )}
      </div>
    );
  }

  const back = (to: number) => (
    <button type="button" onClick={() => setStep(to)} className={btn.outline}>
      Back
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex gap-2" aria-hidden="true">
        {[1, 2, 3].map((s) => (
          <span key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-accent" : "bg-border"}`} />
        ))}
      </div>
      <p className="eyebrow mb-4" aria-live="polite">
        Step {step} of 3
      </p>

      {step === 1 && (
        <form onSubmit={next} className="space-y-4">
          <label className={label}>
            Property address *
            <input
              name="address"
              required
              autoComplete="street-address"
              placeholder="123 Main St, City, ST 00000"
              defaultValue={data.address}
              className={control}
            />
          </label>
          <button className={`${btn.primary} w-full`}>Continue</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={next} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Property type
              <select name="propertyType" defaultValue={data.propertyType || "Single Family"} className={control}>
                <option>Single Family</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Multi-Family</option>
              </select>
            </label>
            <label className={label}>
              Bedrooms
              <input name="beds" type="number" min={0} max={20} defaultValue={data.beds} className={control} />
            </label>
            <label className={label}>
              Bathrooms
              <input name="baths" type="number" min={0} max={20} step={0.5} defaultValue={data.baths} className={control} />
            </label>
            <label className={label}>
              Square feet
              <input name="sqft" type="number" min={100} max={50000} defaultValue={data.sqft} className={control} />
            </label>
            <label className={label}>
              Condition
              <select name="condition" defaultValue={data.condition || "Average"} className={control}>
                <option>Needs work</option>
                <option>Average</option>
                <option>Updated</option>
                <option>Fully remodeled</option>
              </select>
            </label>
            <label className={label}>
              Timeframe
              <select name="timeline" defaultValue={data.timeline || "Exploring"} className={control}>
                <option>Exploring</option>
                <option>0–3 months</option>
                <option>3–6 months</option>
                <option>6–12 months</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            {back(1)}
            <button className={`${btn.primary} flex-1`}>Continue</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Name *
              <input name="name" required autoComplete="name" className={control} />
            </label>
            <label className={label}>
              Email *
              <input name="email" type="email" required autoComplete="email" className={control} />
            </label>
          </div>
          <label className={label}>
            Phone (optional)
            <input name="phone" type="tel" autoComplete="tel" className={control} />
          </label>
          <label className="absolute -left-[9999px]" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="flex items-start gap-3 text-xs text-muted-foreground">
            <input type="checkbox" name="consent" required className="mt-0.5" />
            <span>I agree to be contacted about my home&apos;s value. No obligation.</span>
          </label>
          {status === "err" ? (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2">
            {back(2)}
            <button className={`${btn.primary} flex-1`} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Request valuation"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
