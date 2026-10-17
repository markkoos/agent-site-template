import { connectDb, hasDb } from "./db";
import { LeadModel, type Lead } from "./models/Lead";

/** Best-effort, per-instance rate limiter (good enough to stop casual form spam). */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export const isEmail = (s: unknown): s is string =>
  typeof s === "string" && s.length < 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const clean = (s: unknown, max = 500) => (typeof s === "string" ? s.trim().slice(0, max) : undefined);

/** Save to MongoDB (if configured) and forward to LEAD_WEBHOOK_URL (if configured). */
export async function saveLead(lead: Omit<Lead, "createdAt">) {
  const record = { ...lead, createdAt: new Date() };

  if (hasDb()) {
    await connectDb();
    await LeadModel.create(record);
  } else {
    console.info("[lead] (demo mode — not stored)", record.type, record.email);
  }

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New ${record.type} lead: ${record.name} <${record.email}> ${record.phone ?? ""}`.trim(),
          lead: record,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[lead] webhook failed", err);
    }
  }
}
