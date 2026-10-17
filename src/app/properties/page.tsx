import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingCard } from "@/components/ListingCard";
import { btn } from "@/components/ui";
import { getFilterOptions, parseFilters, searchListings } from "@/lib/listings";
import type { ListingFilters } from "@/lib/listings/types";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

type SP = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<SP> };

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
  const path = f.city ? `/properties?city=${encodeURIComponent(f.city)}` : "/properties";
  return pageMetadata({
    title: titleFor(f),
    description: `Browse ${f.city ? `homes for sale in ${f.city}` : `homes for sale in ${site.serviceAreas.join(", ")}`} with photos, prices and details. Filter by city, type, bedrooms and price.`,
    path,
    noindex: !indexable,
  });
}

function pageHref(sp: SP, page: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val && k !== "page") params.set(k, val);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/properties${qs ? `?${qs}` : ""}`;
}

const PRICE_STEPS = [1_000_000, 2_000_000, 3_500_000, 5_000_000, 7_500_000, 10_000_000];
const ctl = "field focus:outline-none focus:ring-2 focus:ring-ring";

export default async function PropertiesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const f = parseFilters(sp);
  const [{ items, total, page, pageSize }, options] = await Promise.all([searchListings(f), getFilterOptions()]);
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "Properties", path: "/properties" }]} />
      <div className="mt-8 max-w-2xl">
        <div className="eyebrow">Properties</div>
        <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">{titleFor(f)}</h1>
        <p className="mt-3 text-muted-foreground">
          Browse active listings. Reach out for private, off-market opportunities.
        </p>
      </div>

      {/* Plain GET form: works without JavaScript and produces shareable, crawlable URLs */}
      <form
        action="/properties"
        role="search"
        aria-label="Filter properties"
        className="mt-10 grid gap-3 rounded-md border border-border/60 bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_auto]"
      >
        <label className="sr-only" htmlFor="f-q">
          Search
        </label>
        <input id="f-q" name="q" defaultValue={f.q} placeholder="Address, city, ZIP, MLS#" className={ctl} />

        <label className="sr-only" htmlFor="f-city">
          City
        </label>
        <select id="f-city" name="city" defaultValue={f.city ?? ""} className={ctl}>
          <option value="">All cities</option>
          {options.cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="f-type">
          Type
        </label>
        <select id="f-type" name="type" defaultValue={f.type ?? ""} className={ctl}>
          <option value="">Any type</option>
          {options.types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="f-beds">
          Bedrooms
        </label>
        <select id="f-beds" name="beds" defaultValue={f.beds ? String(f.beds) : ""} className={ctl}>
          <option value="">Beds</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ beds
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="f-max">
          Max price
        </label>
        <select id="f-max" name="maxPrice" defaultValue={f.maxPrice ? String(f.maxPrice) : ""} className={ctl}>
          <option value="">Max price</option>
          {PRICE_STEPS.map((n) => (
            <option key={n} value={n}>
              Up to ${(n / 1_000_000).toFixed(1)}M
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="f-sort">
          Sort
        </label>
        <select id="f-sort" name="sort" defaultValue={f.sort} className={ctl}>
          <option value="newest">Newest</option>
          <option value="price-desc">Price: high to low</option>
          <option value="price-asc">Price: low to high</option>
        </select>

        <div className="flex gap-2">
          <button className={`${btn.primary} px-4 py-2`}>Search</button>
          <Link href="/properties" className={`${btn.outline} px-3 py-2 text-muted-foreground`}>
            Reset
          </Link>
        </div>
      </form>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {total} {total === 1 ? "property" : "properties"} found
      </p>

      {items.length ? (
        <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.listingKey} listing={l} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-md border border-dashed border-border p-12 text-center text-muted-foreground">
          No properties match those filters. Try widening your search, or{" "}
          <Link href="/contact" className="underline underline-offset-4">
            tell us what you&apos;re looking for
          </Link>
          .
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-14 flex flex-wrap justify-center gap-2 text-sm">
          {page > 1 && (
            <Link href={pageHref(sp, page - 1)} className="rounded-md border border-input px-3 py-2 hover:bg-secondary">
              ← Prev
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 2)
            .map((p) =>
              p === page ? (
                <span key={p} aria-current="page" className="rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  {p}
                </span>
              ) : (
                <Link key={p} href={pageHref(sp, p)} className="rounded-md border border-input px-3 py-2 hover:bg-secondary">
                  {p}
                </Link>
              ),
            )}
          {page < pages && (
            <Link href={pageHref(sp, page + 1)} className="rounded-md border border-input px-3 py-2 hover:bg-secondary">
              Next →
            </Link>
          )}
        </nav>
      )}

      <p className="mt-16 text-xs text-muted-foreground">{site.legal.mlsDisclaimer}</p>
    </div>
  );
}
