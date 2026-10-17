import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { SafeImg } from "@/components/SafeImg";
import { formatDate, formatNumber, formatPrice, fullAddress } from "@/lib/format";
import { getListingBySlug } from "@/lib/listings";
import { listingSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

// Listing pages are rendered on first visit, then cached and refreshed hourly (ISR).
export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) return {};
  const name = l.title ? `${l.title}, ${l.city}` : `${l.street}, ${l.city}, ${l.state} ${l.zip}`;
  return pageMetadata({
    title: `${name} — ${formatPrice(l.price)}`,
    description: `${l.beds} bed, ${l.baths} bath${l.sqft ? `, ${formatNumber(l.sqft)} sq ft` : ""} ${l.propertyType.toLowerCase()} in ${l.city}, ${l.state}. ${l.description.slice(0, 110)}…`,
    path: `/properties/${l.slug}`,
    image: l.photos[0],
    // Sold listings stay reachable for visitors but aren't worth indexing.
    noindex: l.status === "Sold",
  });
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 font-serif text-xl">{value}</dd>
    </div>
  );
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) notFound();

  const title = l.title || l.street;
  const gallery = l.photos.slice(1, 7);
  const stats: [string, string | undefined][] = [
    ["Price", formatPrice(l.price)],
    ["Bedrooms", String(l.beds)],
    ["Bathrooms", String(l.baths)],
    ["Interior", l.sqft ? `${formatNumber(l.sqft)} sq ft` : undefined],
    ["Lot", l.lotSqft ? `${formatNumber(l.lotSqft)} sq ft` : undefined],
    ["Year built", l.yearBuilt ? String(l.yearBuilt) : undefined],
    ["Type", l.propertyType],
    ["Price / sq ft", l.sqft ? formatPrice(Math.round(l.price / l.sqft)) : undefined],
    ["Status", l.status],
    ["MLS #", l.mlsNumber],
  ];

  return (
    <article>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted md:aspect-[21/9]">
        <SafeImg
          src={l.photos[0]}
          alt={`${title} — exterior`}
          loading="eager"
          fetchPriority="high"
          width={2100}
          height={900}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container-page py-10 md:py-14">
        <Breadcrumbs
          items={[
            { name: "Properties", path: "/properties" },
            { name: l.city, path: `/properties?city=${encodeURIComponent(l.city)}` },
            { name: title, path: `/properties/${l.slug}` },
          ]}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="eyebrow">
              {l.status} · {l.city}, {l.state}
            </div>
            <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-2 text-muted-foreground">{fullAddress(l)}</p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-y border-border/60 py-6">
              {stats
                .filter((s): s is [string, string] => Boolean(s[1]))
                .map(([k, v]) => (
                  <Stat key={k} label={k} value={v} />
                ))}
            </dl>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">About this property</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">{l.description}</p>
            </section>

            {l.features.length ? (
              <section className="mt-10">
                <h2 className="font-serif text-2xl">Features</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {l.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {f}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {gallery.length ? (
              <section className="mt-10">
                <h2 className="font-serif text-2xl">Gallery</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {gallery.map((src, i) => (
                    <div key={src + i} className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                      <SafeImg
                        src={src}
                        alt={`${title} — view ${i + 2}`}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-10">
              <h2 className="font-serif text-2xl">Location</h2>
              <p className="mt-3 text-sm">
                <a
                  target="_blank"
                  rel="noopener"
                  className="underline underline-offset-4"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(l))}`}
                >
                  View {l.street} on a map →
                </a>{" "}
                <span className="text-muted-foreground">·</span>{" "}
                <Link href={`/properties?city=${encodeURIComponent(l.city)}`} className="underline underline-offset-4">
                  More homes in {l.city}
                </Link>
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-serif text-2xl">Estimate a monthly payment</h2>
              <div className="mt-5">
                <MortgageCalculator defaultPrice={l.price} compact />
              </div>
            </section>

            <div className="mt-12 space-y-2 text-xs text-muted-foreground">
              {l.listOffice ? (
                <p>
                  Listing courtesy of {l.listOffice}
                  {l.listAgent ? ` (${l.listAgent})` : ""}.
                </p>
              ) : null}
              <p>Last updated {formatDate(l.updatedAt)}.</p>
              <p>{site.legal.mlsDisclaimer}</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-md border border-border/60 bg-card p-6">
              <div className="eyebrow">Inquire</div>
              <div className="mt-1 font-serif text-2xl">Request a private viewing</div>
              <p className="mt-2 text-sm text-muted-foreground">We&apos;ll reach out within one business day.</p>
              <div className="mt-6">
                <LeadForm
                  type="showing"
                  listingSlug={l.slug}
                  submitLabel="Request viewing"
                  messageLabel="Message"
                  defaultMessage={`I'd like to schedule a viewing of ${title}.`}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <JsonLd data={listingSchema(l, `/properties/${l.slug}`)} />
    </article>
  );
}
