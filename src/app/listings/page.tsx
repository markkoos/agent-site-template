import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingCard } from "@/components/ListingCard";
import { getFilterOptions, parseFilters, searchListings } from "@/lib/listings";
import type { ListingFilters } from "@/lib/listings/types";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const titleFor = (f: ListingFilters) =>
  f.city ? `Homes for Sale in ${f.city}, ${site.brokerage.address.state}` : "Homes for Sale";

/**
 * Crawl strategy: the base page and single-city pages are indexable landing pages.
 * Any other filter combination is noindex,follow so search engines don't waste
 * crawl budget on thousands of near-duplicate URLs.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const f = parseFilters(sp);
  const keys = Object.keys(sp).filter((k) => sp[k]);
  const indexable = keys.every((k) => k === "city") && (f.page ?? 1) === 1;
  const path = f.city ? `/listings?city=${encodeURIComponent(f.city)}` : "/listings";
  return pageMetadata({
    title: titleFor(f),
    description: `Browse ${f.city ? `homes for sale in ${f.city}` : `homes for sale in ${site.serviceAreas.join(", ")}`} with photos, prices and details. Updated regularly.`,
    path,
    noindex: !indexable,
  });
}

function pageHref(sp: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val && k !== "page") params.set(k, val);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/listings${qs ? `?${qs}` : ""}`;
}

export default async function ListingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const f = parseFilters(sp);
  const [{ items, total, page, pageSize }, options] = await Promise.all([searchListings(f), getFilterOptions()]);
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <Breadcrumbs items={[{ name: "Homes for sale", path: "/listings" }]} />
      <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>{titleFor(f)}</h1>

      {/* Plain GET form: works without JavaScript and produces shareable URLs */}
      <form className="filters" action="/listings" role="search" aria-label="Filter homes">
        <label>
          Search
          <input name="q" defaultValue={f.q} placeholder="Address, city, ZIP, MLS#" />
        </label>
        <label>
          City
          <select name="city" defaultValue={f.city ?? ""}>
            <option value="">Any</option>
            {options.cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Min price
          <input name="minPrice" inputMode="numeric" defaultValue={f.minPrice} placeholder="No min" />
        </label>
        <label>
          Max price
          <input name="maxPrice" inputMode="numeric" defaultValue={f.maxPrice} placeholder="No max" />
        </label>
        <label>
          Beds
          <select name="beds" defaultValue={f.beds ? String(f.beds) : ""}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </label>
        <label>
          Baths
          <select name="baths" defaultValue={f.baths ? String(f.baths) : ""}>
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select name="type" defaultValue={f.type ?? ""}>
            <option value="">Any</option>
            {options.types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={f.status}>
            <option value="active">For sale</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="all">All</option>
          </select>
        </label>
        <label>
          Sort
          <select name="sort" defaultValue={f.sort}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
        <div className="actions">
          <button className="btn">Search</button>
          <Link className="btn btn-ghost" href="/listings">
            Reset
          </Link>
        </div>
      </form>

      <p className="muted" aria-live="polite">
        {total} {total === 1 ? "home" : "homes"} found
      </p>

      {items.length ? (
        <div className="grid">
          {items.map((l) => (
            <ListingCard key={l.listingKey} listing={l} />
          ))}
        </div>
      ) : (
        <div className="notice">
          No homes match those filters yet. Try widening your price range, or{" "}
          <Link href="/contact">tell me what you&apos;re looking for</Link> and I&apos;ll send matches as they hit the
          market.
        </div>
      )}

      {pages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          {page > 1 && <Link href={pageHref(sp, page - 1)}>← Prev</Link>}
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 2)
            .map((p) =>
              p === page ? (
                <span key={p} aria-current="page">
                  {p}
                </span>
              ) : (
                <Link key={p} href={pageHref(sp, p)}>
                  {p}
                </Link>
              ),
            )}
          {page < pages && <Link href={pageHref(sp, page + 1)}>Next →</Link>}
        </nav>
      )}

      <p className="small muted" style={{ marginTop: 40 }}>
        {site.legal.mlsDisclaimer}
      </p>
    </div>
  );
}
