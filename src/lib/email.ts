/**
 * Lead notification emails via Resend (https://resend.com) — plain fetch, no SDK.
 *
 * Env:
 *   RESEND_API_KEY      API key from the Resend dashboard
 *   LEAD_FROM_EMAIL     Sender on a domain you verified in Resend,
 *                       e.g. "Website Leads <leads@yourstudio.com>"
 *   LEAD_NOTIFY_EMAIL   Optional override for recipients (comma-separated).
 *                       Otherwise site.config → leads.notifyTo, then agent.email.
 */
import { site } from "@/site.config";
import type { Lead } from "./models/Lead";

type LeadRecord = Omit<Lead, "createdAt"> & { createdAt: Date };

export function emailConfigured() {
  const hasKey = Boolean(process.env.RESEND_API_KEY);
  const hasFrom = Boolean(process.env.LEAD_FROM_EMAIL);
  if (hasKey !== hasFrom) {
    console.warn(
      `[lead] email is half-configured: ${hasKey ? "LEAD_FROM_EMAIL" : "RESEND_API_KEY"} is missing — check the spelling in your environment variables.`,
    );
  }
  return hasKey && hasFrom;
}

function recipients(): string[] {
  const fromEnv = process.env.LEAD_NOTIFY_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (fromEnv?.length) return fromEnv;
  if (site.leads.notifyTo.length) return site.leads.notifyTo;
  return [site.agent.email];
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const LABEL: Record<Lead["type"], string> = {
  valuation: "Home evaluation request",
  showing: "Viewing request",
  contact: "New message",
};

function buildRows(lead: LeadRecord): [string, string][] {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
  ];
  if (lead.type === "valuation") {
    const d = lead.details ?? {};
    rows.push(
      ["Property address", lead.address || "—"],
      ["Property type", d.propertyType || "—"],
      ["Bedrooms", d.beds != null ? String(d.beds) : "—"],
      ["Bathrooms", d.baths != null ? String(d.baths) : "—"],
      ["Square feet", d.sqft != null ? d.sqft.toLocaleString("en-US") : "—"],
      ["Condition", d.condition || "—"],
      ["Selling timeframe", d.timeline || "—"],
    );
    if (lead.estimate) {
      rows.push([
        "Instant estimate shown",
        `${usd(lead.estimate.value)} (range ${usd(lead.estimate.low)} – ${usd(lead.estimate.high)})`,
      ]);
    }
  }
  if (lead.listingSlug) rows.push(["Property page", `${site.url}/properties/${lead.listingSlug}`]);
  if (lead.message) rows.push(["Message", lead.message]);
  if (lead.page) rows.push(["Submitted from", `${site.url}${lead.page}`]);
  rows.push([
    "Received",
    lead.createdAt.toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }),
  ]);
  return rows;
}

function buildEmail(lead: LeadRecord) {
  const title = LABEL[lead.type];
  const subject =
    lead.type === "valuation" && lead.address ? `${title}: ${lead.address}` : `${title} from ${lead.name}`;
  const rows = buildRows(lead);
  const nextStep =
    lead.type === "valuation"
      ? "Reply to this email to contact them directly. The form told them to expect a personal valuation within one business day."
      : "Reply to this email to contact them directly.";

  const text = [`${title} — ${site.brand.siteName}`, "", ...rows.map(([k, v]) => `${k}: ${v}`), "", nextStep].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f6f3ec;font-family:Arial,Helvetica,sans-serif;color:#22272f">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a8f98">${esc(site.brand.siteName)}</p>
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:24px">${esc(title)}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1px solid #e5dfd3;border-radius:6px;border-collapse:separate">
      ${rows
        .map(
          ([k, v]) => `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #efe9de;font-size:12px;color:#8a8f98;white-space:nowrap;vertical-align:top">${esc(k)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #efe9de;font-size:14px;white-space:pre-line">${esc(v)}</td>
      </tr>`,
        )
        .join("")}
    </table>
    <p style="margin:18px 0 0;font-size:13px;color:#5b6170">${esc(nextStep)}</p>
  </div></body></html>`;

  return { subject, html, text };
}

/** Sends the notification. Throws on failure so the caller can decide what to do. */
export async function sendLeadEmail(lead: LeadRecord) {
  const { subject, html, text } = buildEmail(lead);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL,
      to: recipients(),
      // Hitting "Reply" in the agent's inbox goes straight to the homeowner.
      reply_to: lead.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}
