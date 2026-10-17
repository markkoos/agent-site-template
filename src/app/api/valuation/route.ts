import { NextResponse } from "next/server";
import { connectDb, hasDb } from "@/lib/db";
import { clean, clientIp, isEmail, rateLimited, saveLead } from "@/lib/leads";
import { LeadModel } from "@/lib/models/Lead";

type Estimate = { value: number; low: number; high: number };

const CACHE_DAYS = 30;
const addressKey = (a: string) => a.toLowerCase().replace(/[^a-z0-9]/g, "");
const toInt = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

/**
 * RentCast AVM (https://developers.rentcast.io). Free developer tier is small,
 * so estimates are cached per address for 30 days. Swap this function for
 * ATTOM, HouseCanary, etc. if the client prefers another provider.
 */
async function fetchEstimate(input: {
  address: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}): Promise<Estimate | null> {
  const key = process.env.RENTCAST_API_KEY;
  if (!key) return null;
  const qs = new URLSearchParams({ address: input.address, compCount: "5" });
  if (input.propertyType) qs.set("propertyType", input.propertyType);
  if (input.beds) qs.set("bedrooms", String(input.beds));
  if (input.baths) qs.set("bathrooms", String(input.baths));
  if (input.sqft) qs.set("squareFootage", String(input.sqft));
  try {
    const res = await fetch(`https://api.rentcast.io/v1/avm/value?${qs}`, {
      headers: { "X-Api-Key": key, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("[valuation] AVM returned", res.status);
      return null;
    }
    const d = (await res.json()) as { price?: number; priceRangeLow?: number; priceRangeHigh?: number };
    if (!d.price) return null;
    return { value: d.price, low: d.priceRangeLow ?? d.price * 0.93, high: d.priceRangeHigh ?? d.price * 1.07 };
  } catch (err) {
    console.error("[valuation] AVM request failed", err);
    return null;
  }
}

async function cachedEstimate(key: string): Promise<Estimate | null> {
  if (!hasDb()) return null;
  await connectDb();
  const since = new Date(Date.now() - CACHE_DAYS * 864e5);
  const hit = await LeadModel.findOne({ addressKey: key, "estimate.at": { $gte: since } })
    .sort({ createdAt: -1 })
    .lean();
  return hit?.estimate ? { value: hit.estimate.value, low: hit.estimate.low, high: hit.estimate.high } : null;
}

export async function POST(req: Request) {
  if (rateLimited(clientIp(req), 4)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true, estimate: null });

  const address = clean(body.address, 200);
  const name = clean(body.name, 100);
  const email = body.email;
  if (!address || address.length < 8) return NextResponse.json({ error: "Please enter a full address." }, { status: 400 });
  if (!name || !isEmail(email)) {
    return NextResponse.json({ error: "Please include your name and a valid email." }, { status: 400 });
  }
  if (!body.consent) return NextResponse.json({ error: "Please confirm we may contact you." }, { status: 400 });

  const details = {
    propertyType: clean(body.propertyType, 40),
    beds: toInt(body.beds),
    baths: toInt(body.baths),
    sqft: toInt(body.sqft),
    condition: clean(body.condition, 40),
    timeline: clean(body.timeline, 40),
  };

  try {
    const key = addressKey(address);
    const estimate = (await cachedEstimate(key)) ?? (await fetchEstimate({ address, ...details }));

    await saveLead({
      type: "valuation",
      name,
      email,
      phone: clean(body.phone, 30),
      address,
      addressKey: key,
      details,
      ...(estimate ? { estimate: { ...estimate, source: "rentcast", at: new Date() } } : {}),
    });

    return NextResponse.json({ ok: true, estimate });
  } catch (err) {
    console.error("[api/valuation]", err);
    return NextResponse.json({ error: "Something went wrong. Please call or email instead." }, { status: 500 });
  }
}
