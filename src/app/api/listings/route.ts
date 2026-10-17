import { NextResponse } from "next/server";
import { parseFilters, searchListings } from "@/lib/listings";

/**
 * JSON search endpoint — for a map view, infinite scroll, or a client-side widget.
 * Same filters as the /properties page: ?city=&minPrice=&maxPrice=&beds=&baths=&type=&status=&sort=&page=
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = Object.fromEntries(url.searchParams.entries());
  const result = await searchListings(parseFilters(sp));
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
