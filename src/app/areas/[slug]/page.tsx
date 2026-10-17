import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { ListingCard } from "@/components/ListingCard";
import { btn } from "@/components/ui";
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
    title: `Living in ${area.name}: Neighborhood Guide & Homes for Sale`,
    description: area.description,
    path: `/areas/${area.slug}`,
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) notFound();
  const listings = await getListingsByCity(area.city, 3);

  return (
    <div className="py-12 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Areas", path: "/areas" },
              { name: area.name, path: `/areas/${area.slug}` },
            ]}
          />
          <div className="eyebrow mt-10">Neighborhood guide</div>
          <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">Living in {area.name}</h1>
          <div className="mt-5 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
            <span>
              By{" "}
              <Link href="/about" className="text-foreground hover:underline">
                {site.agent.name}
              </Link>
            </span>
            {area.updated ? <span>Updated {formatDate(area.updated)}</span> : null}
          </div>

          {area.tldr ? (
            <div className="mt-10 border-l-2 border-accent bg-card px-6 py-5">
              <div className="eyebrow">{area.name} at a glance</div>
              <p className="mt-2 leading-relaxed">{area.tldr}</p>
            </div>
          ) : null}

          {area.highlights.length > 0 && (
            <ul className="mt-8 space-y-2">
              {area.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {h}
                </li>
              ))}
            </ul>
          )}

          <div className="prose-editorial mt-10" dangerouslySetInnerHTML={{ __html: area.html }} />
        </div>
      </div>

      <section className="mt-16 border-y border-border/60 bg-secondary/30 py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl tracking-tight">Homes for sale in {area.name}</h2>
            <Link href={`/properties?city=${encodeURIComponent(area.city)}`} className={btn.link}>
              See all →
            </Link>
          </div>
          {listings.length ? (
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.listingKey} listing={l} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-muted-foreground">
              No active listings right now — ask us about upcoming and off-market homes.
            </p>
          )}
        </div>
      </section>

      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          {area.faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-4 font-serif text-3xl">{area.name} FAQ</h2>
              <FaqList faqs={area.faqs} />
            </section>
          )}
          <AuthorBox />
        </div>
      </div>

      <JsonLd data={areaSchema(area)} />
    </div>
  );
}
