/**
 * Listing data access. The site ALWAYS reads from one place:
 *   - MongoDB when MONGODB_URI is set (filled by `npm run seed`, manual entry, or `npm run sync:reso`)
 *   - data/demo-listings.json otherwise (demo mode, zero setup)
 * Keeping one read path means pages never care where listings came from.
 */
import demoData from "../../../data/demo-listings.json";
import { connectDb, hasDb } from "../db";
import { ListingModel } from "../models/Listing";
import type { Listing, ListingFilters, SearchResult, SortOption, StatusFilter } from "./types";

export const PAGE_SIZE = 12;
const demoListings = demoData as unknown as Listing[];

const STATUS_MAP: Record<StatusFilter, Listing["status"][]> = {
  active: ["Active", "Coming Soon"],
  pending: ["Pending"],
  sold: ["Sold"],
  all: ["Active", "Coming Soon", "Pending", "Sold"],
};

type SP = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const toNum = (v: string | undefined) => {
  if (!v) return undefined;
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

/** Turn URL search params into typed filters. */
export function parseFilters(sp: SP): ListingFilters {
  const status = first(sp.status) as StatusFilter | undefined;
  const sort = first(sp.sort) as SortOption | undefined;
  return {
    q: first(sp.q)?.slice(0, 80),
    city: first(sp.city)?.slice(0, 60),
    minPrice: toNum(first(sp.minPrice)),
    maxPrice: toNum(first(sp.maxPrice)),
    beds: toNum(first(sp.beds)),
    baths: toNum(first(sp.baths)),
    type: first(sp.type)?.slice(0, 40),
    status: status && status in STATUS_MAP ? status : "active",
    sort: sort && ["newest", "price-asc", "price-desc"].includes(sort) ? sort : "newest",
    page: Math.floor(Math.min(500, toNum(first(sp.page)) ?? 1)),
  };
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function strip(doc: unknown): Listing {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = doc as Listing & { _id?: unknown };
  return rest as Listing;
}

// ---------- Demo mode (in-memory) ----------
function matchesDemo(l: Listing, f: ListingFilters) {
  if (!STATUS_MAP[f.status ?? "active"].includes(l.status)) return false;
  if (f.city && l.city.toLowerCase() !== f.city.toLowerCase()) return false;
  if (f.type && l.propertyType !== f.type) return false;
  if (f.minPrice && l.price < f.minPrice) return false;
  if (f.maxPrice && l.price > f.maxPrice) return false;
  if (f.beds && l.beds < f.beds) return false;
  if (f.baths && l.baths < f.baths) return false;
  if (f.q) {
    const q = f.q.toLowerCase();
    const hay = `${l.street} ${l.city} ${l.zip} ${l.mlsNumber ?? ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sortListings(a: Listing, b: Listing, sort: SortOption) {
  if (sort === "price-asc") return a.price - b.price;
  if (sort === "price-desc") return b.price - a.price;
  return (b.listedAt ?? "").localeCompare(a.listedAt ?? "");
}

// ---------- Public API ----------
export async function searchListings(f: ListingFilters): Promise<SearchResult> {
  const page = Math.max(1, f.page ?? 1);
  const sort = f.sort ?? "newest";

  if (!hasDb()) {
    const all = demoListings.filter((l) => matchesDemo(l, f)).sort((a, b) => sortListings(a, b, sort));
    return { items: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: all.length, page, pageSize: PAGE_SIZE };
  }

  await connectDb();
  const query: Record<string, unknown> = { status: { $in: STATUS_MAP[f.status ?? "active"] } };
  if (f.city) query.city = new RegExp(`^${escapeRegex(f.city)}$`, "i");
  if (f.type) query.propertyType = f.type;
  if (f.minPrice || f.maxPrice) {
    query.price = { ...(f.minPrice ? { $gte: f.minPrice } : {}), ...(f.maxPrice ? { $lte: f.maxPrice } : {}) };
  }
  if (f.beds) query.beds = { $gte: f.beds };
  if (f.baths) query.baths = { $gte: f.baths };
  if (f.q) {
    const rx = new RegExp(escapeRegex(f.q), "i");
    query.$or = [{ street: rx }, { city: rx }, { zip: rx }, { mlsNumber: rx }];
  }
  const sortSpec: Record<string, 1 | -1> =
    sort === "price-asc" ? { price: 1 } : sort === "price-desc" ? { price: -1 } : { listedAt: -1 };

  const [items, total] = await Promise.all([
    ListingModel.find(query).sort(sortSpec).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    ListingModel.countDocuments(query),
  ]);
  return { items: items.map(strip), total, page, pageSize: PAGE_SIZE };
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  if (!hasDb()) return demoListings.find((l) => l.slug === slug) ?? null;
  await connectDb();
  const doc = await ListingModel.findOne({ slug }).lean();
  return doc ? strip(doc) : null;
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  if (!hasDb()) {
    const active = demoListings.filter((l) => STATUS_MAP.active.includes(l.status));
    return [...active.filter((l) => l.featured), ...active.filter((l) => !l.featured)].slice(0, limit);
  }
  await connectDb();
  const featured = await ListingModel.find({ status: { $in: STATUS_MAP.active }, featured: true })
    .sort({ listedAt: -1 })
    .limit(limit)
    .lean();
  if (featured.length >= limit) return featured.map(strip);
  const more = await ListingModel.find({ status: { $in: STATUS_MAP.active }, featured: { $ne: true } })
    .sort({ listedAt: -1 })
    .limit(limit - featured.length)
    .lean();
  return [...featured, ...more].map(strip);
}

export async function getListingsByCity(city: string, limit = 6): Promise<Listing[]> {
  const res = await searchListings({ city, status: "active", sort: "newest", page: 1 });
  return res.items.slice(0, limit);
}

/** For the filter dropdowns. */
export async function getFilterOptions(): Promise<{ cities: string[]; types: string[] }> {
  if (!hasDb()) {
    return {
      cities: [...new Set(demoListings.map((l) => l.city))].sort(),
      types: [...new Set(demoListings.map((l) => l.propertyType))].sort(),
    };
  }
  await connectDb();
  const [cities, types] = await Promise.all([
    ListingModel.distinct("city", { status: { $in: STATUS_MAP.all } }),
    ListingModel.distinct("propertyType", { status: { $in: STATUS_MAP.all } }),
  ]);
  return { cities: (cities as string[]).filter(Boolean).sort(), types: (types as string[]).filter(Boolean).sort() };
}

/** For the sitemap — active and pending only (sold pages are low value to crawl). */
export async function getListingSitemapEntries(limit = 5000): Promise<{ slug: string; updatedAt: string }[]> {
  if (!hasDb()) {
    return demoListings
      .filter((l) => l.status !== "Sold")
      .map((l) => ({ slug: l.slug, updatedAt: l.updatedAt }));
  }
  await connectDb();
  const docs = await ListingModel.find({ status: { $in: ["Active", "Coming Soon", "Pending"] } }, { slug: 1, updatedAt: 1 })
    .limit(limit)
    .lean();
  return docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }));
}
