import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { ListingCard } from "@/components/ListingCard";
import { getAllAreas, getArea } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getListingsByCity } from "@/lib/listings";
import { areaSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllAreas()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) return {};
  return pageMetadata({
    title: `Living in ${area.name}, ${site.brokerage.address.state}: Neighborhood Guide & Homes for Sale`,
    description: area.description,
    path: `/areas/${area.slug}`,
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) notFound();
  const listings = await getListingsByCity(area.city, 6);

  return (
    <div style={{ paddingBottom: 72 }}>
      <div className="narrow">
        <Breadcrumbs
          items={[
            { name: "Areas", path: "/areas" },
            { name: area.name, path: `/areas/${area.slug}` },
          ]}
        />
        <h1>Living in {area.name}</h1>
        <div className="byline">
          <span>
            By <Link href="/about">{site.agent.name}</Link>, local {site.agent.jobTitle}
          </span>
          {area.updated && <span>Updated {formatDate(area.updated)}</span>}
        </div>
        {area.tldr && (
          <div className="tldr">
            <strong>{area.name} at a glance</strong>
            {area.tldr}
          </div>
        )}
        {area.highlights.length > 0 && (
          <ul>
            {area.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: area.html }} />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Homes for sale in {area.name}</h2>
            <Link className="btn btn-ghost" href={`/listings?city=${encodeURIComponent(area.city)}`}>
              See all
            </Link>
          </div>
          {listings.length ? (
            <div className="grid">
              {listings.map((l) => (
                <ListingCard key={l.listingKey} listing={l} />
              ))}
            </div>
          ) : (
            <p className="muted">No active listings right now — ask me about upcoming and off-market homes.</p>
          )}
        </div>
      </section>

      <div className="narrow">
        {area.faqs.length > 0 && (
          <>
            <h2>{area.name} FAQ</h2>
            <FaqList faqs={area.faqs} />
          </>
        )}
        <AuthorBox />
      </div>

      <JsonLd data={areaSchema(area)} />
    </div>
  );
}
