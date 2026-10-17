import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllAreas } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: "Neighborhood & City Guides",
  description: `Local guides to ${site.serviceAreas.join(", ")}: what it's like to live there, housing types, and homes for sale.`,
  path: "/areas",
});

export default async function AreasPage() {
  const areas = await getAllAreas();
  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "Areas", path: "/areas" }]} />
      <div className="mt-10 max-w-2xl">
        <div className="eyebrow">Neighborhood guides</div>
        <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Where we work</h1>
        <p className="mt-4 text-muted-foreground">
          First-hand notes on the places we represent homes — written for people deciding where to live.
        </p>
      </div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <Link key={a.slug} href={`/areas/${a.slug}`} className="group bg-background p-8 transition-colors hover:bg-secondary/50">
            <h2 className="font-serif text-2xl group-hover:text-accent">{a.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
            <span className="mt-6 inline-block text-sm text-muted-foreground">Read the guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
