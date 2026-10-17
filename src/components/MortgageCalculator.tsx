"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { control, label } from "./ui";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

type Props = { defaultPrice?: number; compact?: boolean };

export function MortgageCalculator({ defaultPrice = 1500000, compact = false }: Props) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  // Placeholder rate — visitors should enter today's quoted rate.
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxPct, setTaxPct] = useState(1.2);
  const [insurance, setInsurance] = useState(3000);
  const [hoa, setHoa] = useState(0);

  const r = useMemo(() => {
    const loan = price * (1 - downPct / 100);
    const m = rate / 100 / 12;
    const n = years * 12;
    const pi = m === 0 ? loan / n : (loan * m * (1 + m) ** n) / ((1 + m) ** n - 1);
    const tax = (price * taxPct) / 100 / 12;
    const ins = insurance / 12;
    return { loan, pi, tax, ins, hoa, total: pi + tax + ins + hoa };
  }, [price, downPct, rate, years, taxPct, insurance, hoa]);

  const num = (set: (n: number) => void) => (e: ChangeEvent<HTMLInputElement>) => set(Number(e.target.value) || 0);

  const rows: [string, number][] = [
    ["Principal & interest", r.pi],
    ["Property tax", r.tax],
    ["Insurance", r.ins],
    ...(r.hoa > 0 ? ([["HOA", r.hoa]] as [string, number][]) : []),
    ["Loan amount", r.loan],
  ];

  return (
    <div className={`grid gap-8 ${compact ? "" : "md:grid-cols-2"}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          Home price
          <input type="number" min={0} step={1000} value={price} onChange={num(setPrice)} className={control} />
        </label>
        <label className={label}>
          Down payment (%)
          <input type="number" min={0} max={100} step={0.5} value={downPct} onChange={num(setDownPct)} className={control} />
        </label>
        <label className={label}>
          Interest rate (%)
          <input type="number" min={0} max={20} step={0.05} value={rate} onChange={num(setRate)} className={control} />
        </label>
        {!compact && (
          <>
            <label className={label}>
              Loan term
              <select value={years} onChange={(e) => setYears(Number(e.target.value))} className={control}>
                <option value={30}>30 years</option>
                <option value={20}>20 years</option>
                <option value={15}>15 years</option>
              </select>
            </label>
            <label className={label}>
              Property tax (%/yr)
              <input type="number" min={0} max={5} step={0.05} value={taxPct} onChange={num(setTaxPct)} className={control} />
            </label>
            <label className={label}>
              Home insurance ($/yr)
              <input type="number" min={0} step={50} value={insurance} onChange={num(setInsurance)} className={control} />
            </label>
            <label className={label}>
              HOA ($/mo)
              <input type="number" min={0} step={10} value={hoa} onChange={num(setHoa)} className={control} />
            </label>
          </>
        )}
      </div>
      <div className="rounded-md border border-border/60 bg-card p-6" aria-live="polite">
        <div className="eyebrow">Estimated monthly payment</div>
        <p className="mt-2 font-serif text-5xl">{usd(r.total)}</p>
        <dl className="mt-6 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-dashed border-border pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{usd(v)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          Estimate only. Excludes mortgage insurance and closing costs. Get a quote from a licensed lender for your actual
          rate and payment.
        </p>
      </div>
    </div>
  );
}
