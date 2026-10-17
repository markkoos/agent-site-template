"use client";

import { useState, type FormEvent } from "react";

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
    const payload = { ...data, ...fd };
    setStatus("sending");
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setEstimate(json.estimate ?? null);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("err");
    }
  }

  if (status === "done") {
    return (
      <div className="card card-body" role="status">
        {estimate ? (
          <>
            <p className="eyebrow">Instant estimate</p>
            <p className="result-big">{usd(estimate.value)}</p>
            <p className="muted">
              Likely range {usd(estimate.low)} – {usd(estimate.high)}
            </p>
            <p className="small muted">
              This automated estimate uses public records and nearby sales. It can&apos;t see your upgrades or condition,
              so I&apos;ll follow up with a personal comparative market analysis.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">Request received</p>
            <h2>Your home value report is on its way.</h2>
            <p className="muted">
              I&apos;ll review recent comparable sales near {data.address || "your home"} and send a personal valuation,
              usually within one business day.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="card card-body">
      <div className="steps" aria-hidden="true">
        {[1, 2, 3].map((s) => (
          <span key={s} className={s <= step ? "on" : ""} />
        ))}
      </div>
      <p className="small muted" aria-live="polite">
        Step {step} of 3
      </p>

      {step === 1 && (
        <form onSubmit={next} className="form-grid">
          <label className="full">
            Property address
            <input name="address" required autoComplete="street-address" placeholder="123 Main St, City, ST 00000" defaultValue={data.address} />
          </label>
          <div className="full">
            <button className="btn btn-accent">Next</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={next} className="form-grid">
          <label>
            Property type
            <select name="propertyType" defaultValue={data.propertyType || "Single Family"}>
              <option>Single Family</option>
              <option>Condo</option>
              <option>Townhouse</option>
              <option>Multi-Family</option>
            </select>
          </label>
          <label>
            Bedrooms
            <input name="beds" type="number" min={0} max={20} defaultValue={data.beds} />
          </label>
          <label>
            Bathrooms
            <input name="baths" type="number" min={0} max={20} step={0.5} defaultValue={data.baths} />
          </label>
          <label>
            Square feet
            <input name="sqft" type="number" min={100} max={50000} defaultValue={data.sqft} />
          </label>
          <label>
            Condition
            <select name="condition" defaultValue={data.condition || "Average"}>
              <option>Needs work</option>
              <option>Average</option>
              <option>Updated</option>
              <option>Fully remodeled</option>
            </select>
          </label>
          <label>
            Thinking of selling…
            <select name="timeline" defaultValue={data.timeline || "Just curious"}>
              <option>Within 3 months</option>
              <option>3–6 months</option>
              <option>6–12 months</option>
              <option>Just curious</option>
            </select>
          </label>
          <div className="full" style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn btn-accent">Next</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={submit} className="form-grid">
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="full">
            Phone (optional)
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label className="hp" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="checkbox full">
            <input type="checkbox" name="consent" required />
            <span className="small">I agree to be contacted about my home&apos;s value. No obligation.</span>
          </label>
          {status === "err" && (
            <p className="notice err full" role="alert">
              {error}
            </p>
          )}
          <div className="full" style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn btn-accent" disabled={status === "sending"}>
              {status === "sending" ? "Calculating…" : "Get my home value"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
