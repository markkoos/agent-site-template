import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { MortgageCalculator } from "@/components/MortgageCalculator";
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
  return pageMetadata({
    title: `${l.street}, ${l.city}, ${l.state} ${l.zip} — ${formatPrice(l.price)}`,
    description: `${l.beds} bed, ${l.baths} bath${l.sqft ? `, ${formatNumber(l.sqft)} sq ft` : ""} ${l.propertyType.toLowerCase()} in ${l.city}. ${l.description.slice(0, 110)}…`,
    path: `/listings/${l.slug}`,
    image: l.photos[0],
    // Sold listings stay reachable for visitors but aren't worth indexing.
    noindex: l.status === "Sold",
  });
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) notFound();

  const photos = l.photos.length ? l.photos.slice(0, 3) : ["/placeholder-home.svg"];
  const facts: [string, string | number | undefined][] = [
    ["Price", formatPrice(l.price)],
    ["Status", l.status],
    ["Bedrooms", l.beds],
    ["Bathrooms", l.baths],
    ["Living area", l.sqft ? `${formatNumber(l.sqft)} sq ft` : undefined],
    ["Lot size", l.lotSqft ? `${formatNumber(l.lotSqft)} sq ft` : undefined],
    ["Year built", l.yearBuilt],
    ["Type", l.propertyType],
    ["Price / sq ft", l.sqft ? formatPrice(Math.round(l.price / l.sqft)) : undefined],
    ["MLS #", l.mlsNumber],
  ];

  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <Breadcrumbs
        items={[
          { name: "Homes for sale", path: "/listings" },
          { name: l.city, path: `/listings?city=${encodeURIComponent(l.city)}` },
          { name: l.street, path: `/listings/${l.slug}` },
        ]}
      />

      <div className="gallery">
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt={`${l.street} photo ${i + 1}`}
            width={1200}
            height={800}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : undefined}
          />
        ))}
      </div>

      <div className="detail-layout">
        <div>
          <p className="eyebrow">{l.status}</p>
          <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>{fullAddress(l)}</h1>
          <p className="price" style={{ fontSize: "1.8rem" }}>
            {formatPrice(l.price)}
          </p>
          <div className="facts" style={{ marginBottom: 24 }}>
            <span>{l.beds} beds</span>
            <span>{l.baths} baths</span>
            {l.sqft ? <span>{formatNumber(l.sqft)} sq ft</span> : null}
          </div>

          <h2 style={{ fontSize: "1.3rem" }}>Property facts</h2>
          <dl className="fact-table">
            {facts
              .filter(([, v]) => v !== undefined && v !== "")
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>

          <h2 style={{ fontSize: "1.3rem" }}>About this home</h2>
          <p style={{ whiteSpace: "pre-line" }}>{l.description}</p>

          {l.features.length > 0 && (
            <>
              <h2 style={{ fontSize: "1.3rem" }}>Features</h2>
              <ul className="feature-list">
                {l.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}

          <p>
            <a
              target="_blank"
              rel="noopener"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(l))}`}
            >
              View on map →
            </a>{" "}
            · <Link href={`/listings?city=${encodeURIComponent(l.city)}`}>More homes in {l.city}</Link>
          </p>

          <h2 style={{ fontSize: "1.3rem", marginTop: 32 }}>Estimate your payment</h2>
          <MortgageCalculator defaultPrice={l.price} compact />

          <div className="small muted" style={{ marginTop: 32 }}>
            {l.listOffice && (
              <p>
                Listing courtesy of {l.listOffice}
                {l.listAgent ? ` (${l.listAgent})` : ""}.
              </p>
            )}
            <p>Last updated {formatDate(l.updatedAt)}.</p>
            <p>{site.legal.mlsDisclaimer}</p>
          </div>
        </div>

        <aside>
          <div className="card card-body sticky">
            <h2 style={{ fontSize: "1.2rem" }}>Tour this home</h2>
            <p className="small muted">
              {site.agent.name} · <a href={`tel:${site.agent.phone.replace(/[^0-9+]/g, "")}`}>{site.agent.phone}</a>
            </p>
            <LeadForm
              type="showing"
              listingSlug={l.slug}
              submitLabel="Request a showing"
              defaultMessage={`I'd like to see ${l.street}, ${l.city}.`}
            />
          </div>
        </aside>
      </div>

      <JsonLd data={listingSchema(l, `/listings/${l.slug}`)} />
    </div>
  );
}
