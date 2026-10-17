import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllAreas } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: "Neighborhood & City Guides",
  description: `Local guides to ${site.serviceAreas.join(", ")}: what it's like to live there, housing types, schools to research, and homes for sale.`,
  path: "/areas",
});

export default async function AreasPage() {
  const areas = await getAllAreas();
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <Breadcrumbs items={[{ name: "Areas", path: "/areas" }]} />
      <div className="page-head" style={{ paddingTop: 8 }}>
        <h1>Neighborhood guides</h1>
        <p>First-hand notes on the places I sell homes in — written for people deciding where to live.</p>
      </div>
      <div className="grid" style={{ marginTop: 24 }}>
        {areas.map((a) => (
          <Link key={a.slug} href={`/areas/${a.slug}`} className="card card-body listing-card">
            <h2 style={{ fontSize: "1.3rem" }}>{a.name}</h2>
            <p className="muted small" style={{ margin: 0 }}>
              {a.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
