import { NextResponse } from "next/server";
import { clean, clientIp, isEmail, rateLimited, saveLead } from "@/lib/leads";

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → silently accept and drop (bots get no signal).
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const email = body.email;
  if (!name || !isEmail(email)) {
    return NextResponse.json({ error: "Please include your name and a valid email." }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Please confirm we may contact you." }, { status: 400 });
  }

  try {
    await saveLead({
      type: body.type === "showing" ? "showing" : "contact",
      name,
      email,
      phone: clean(body.phone, 30),
      message: clean(body.message, 2000),
      listingSlug: clean(body.listingSlug, 200),
      page: clean(body.page, 200),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/leads]", err);
    return NextResponse.json({ error: "We couldn't send that. Please call or email instead." }, { status: 500 });
  }
}
