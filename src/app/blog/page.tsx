import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: "Journal — Real Estate Market Notes & Advice",
  description: `Field notes on the ${site.serviceAreas[0]} real estate market, pricing strategy and selling advice from ${site.brand.siteName}.`,
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "Journal", path: "/blog" }]} />
      <div className="mt-10 max-w-2xl">
        <div className="eyebrow">Journal</div>
        <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Field notes from the practice</h1>
        <p className="mt-4 text-muted-foreground">
          Perspective on pricing, positioning, and what buyers are actually asking for.
        </p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.slug} className="group">
            <div className="eyebrow">
              {p.tags[0] ?? "Journal"} · {p.readingMinutes} min
            </div>
            <h2 className="mt-3 font-serif text-2xl leading-tight transition-colors group-hover:text-accent">
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <time className="mt-4 block text-xs text-muted-foreground" dateTime={p.updated ?? p.date}>
              {formatDate(p.updated ?? p.date)}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
}
