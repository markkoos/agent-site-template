"use client";

import { useMemo, useState, type ChangeEvent } from "react";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

type Props = { defaultPrice?: number; compact?: boolean };

export function MortgageCalculator({ defaultPrice = 750000, compact = false }: Props) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  // Placeholder rate — visitors should enter today's quoted rate.
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxPct, setTaxPct] = useState(1.1);
  const [insurance, setInsurance] = useState(1800);
  const [hoa, setHoa] = useState(0);

  const r = useMemo(() => {
    const loan = price * (1 - downPct / 100);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const pi = monthlyRate === 0 ? loan / n : (loan * monthlyRate * (1 + monthlyRate) ** n) / ((1 + monthlyRate) ** n - 1);
    const tax = (price * taxPct) / 100 / 12;
    const ins = insurance / 12;
    return { loan, pi, tax, ins, hoa, total: pi + tax + ins + hoa };
  }, [price, downPct, rate, years, taxPct, insurance, hoa]);

  const num = (set: (n: number) => void) => (e: ChangeEvent<HTMLInputElement>) => set(Number(e.target.value) || 0);

  return (
    <div className="calc">
      <div className="form-grid">
        <label className="full">
          Home price
          <input type="number" min={0} step={1000} value={price} onChange={num(setPrice)} />
        </label>
        <label>
          Down payment (%)
          <input type="number" min={0} max={100} step={0.5} value={downPct} onChange={num(setDownPct)} />
        </label>
        <label>
          Interest rate (%)
          <input type="number" min={0} max={20} step={0.05} value={rate} onChange={num(setRate)} />
        </label>
        {!compact && (
          <>
            <label>
              Loan term
              <select value={years} onChange={(e) => setYears(Number(e.target.value))}>
                <option value={30}>30 years</option>
                <option value={20}>20 years</option>
                <option value={15}>15 years</option>
              </select>
            </label>
            <label>
              Property tax (%/yr)
              <input type="number" min={0} max={5} step={0.05} value={taxPct} onChange={num(setTaxPct)} />
            </label>
            <label>
              Home insurance ($/yr)
              <input type="number" min={0} step={50} value={insurance} onChange={num(setInsurance)} />
            </label>
            <label>
              HOA ($/mo)
              <input type="number" min={0} step={10} value={hoa} onChange={num(setHoa)} />
            </label>
          </>
        )}
      </div>
      <div className="card card-body" aria-live="polite">
        <p className="eyebrow">Estimated monthly payment</p>
        <p className="result-big">{usd(r.total)}</p>
        <div className="breakdown small">
          <div>
            <span>Principal &amp; interest</span>
            <strong>{usd(r.pi)}</strong>
          </div>
          <div>
            <span>Property tax</span>
            <strong>{usd(r.tax)}</strong>
          </div>
          <div>
            <span>Insurance</span>
            <strong>{usd(r.ins)}</strong>
          </div>
          {r.hoa > 0 && (
            <div>
              <span>HOA</span>
              <strong>{usd(r.hoa)}</strong>
            </div>
          )}
          <div>
            <span>Loan amount</span>
            <strong>{usd(r.loan)}</strong>
          </div>
        </div>
        <p className="small muted" style={{ marginTop: 16 }}>
          Estimate only. Excludes mortgage insurance and closing costs. Get a quote from a licensed lender for your
          actual rate and payment.
        </p>
      </div>
    </div>
  );
}
