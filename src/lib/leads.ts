import { connectDb, hasDb } from "./db";
import { emailConfigured, sendLeadEmail } from "./email";
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

/**
 * Deliver a lead through every configured channel:
 *   1. MongoDB (MONGODB_URI)        — permanent record
 *   2. Email via Resend             — instant notification to the agent
 *   3. Webhook (LEAD_WEBHOOK_URL)   — CRM / Zapier / Slack
 * One channel failing doesn't lose the lead; we only report an error to the
 * visitor if NO configured channel succeeded.
 */
export async function saveLead(lead: Omit<Lead, "createdAt">) {
  const record = { ...lead, createdAt: new Date() };
  const attempted: string[] = [];
  const delivered: string[] = [];

  if (hasDb()) {
    attempted.push("db");
    try {
      await connectDb();
      await LeadModel.create(record);
      delivered.push("db");
    } catch (err) {
      console.error("[lead] database save failed", err);
    }
  }

  if (emailConfigured()) {
    attempted.push("email");
    try {
      await sendLeadEmail(record);
      delivered.push("email");
    } catch (err) {
      console.error("[lead] email failed", err);
    }
  }

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    attempted.push("webhook");
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New ${record.type} lead: ${record.name} <${record.email}> ${record.phone ?? ""}`.trim(),
          lead: record,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) delivered.push("webhook");
      else console.error("[lead] webhook returned", res.status);
    } catch (err) {
      console.error("[lead] webhook failed", err);
    }
  }

  if (!attempted.length) {
    console.info("[lead] (demo mode — no database, email or webhook configured)", record.type, record.email);
    return;
  }
  if (!delivered.length) throw new Error(`Lead not delivered (tried: ${attempted.join(", ")})`);
}
