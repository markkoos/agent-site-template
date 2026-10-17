import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: "Real Estate Blog & Local Market Advice",
  description: `Buying and selling guides, market updates and neighborhood insight for ${site.serviceAreas.join(", ")} from ${site.agent.name}.`,
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <div className="page-head" style={{ paddingTop: 8 }}>
        <h1>Local real estate advice</h1>
        <p>Straight answers about buying, selling and living in {site.serviceAreas.slice(0, 3).join(", ")}.</p>
      </div>
      <div className="grid" style={{ marginTop: 24 }}>
        {posts.map((p) => (
          <article key={p.slug} className="card card-body">
            <p className="small muted" style={{ margin: "0 0 6px" }}>
              <time dateTime={p.updated ?? p.date}>{formatDate(p.updated ?? p.date)}</time> · {p.readingMinutes} min read
            </p>
            <h2 style={{ fontSize: "1.25rem" }}>
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            <p className="muted small" style={{ margin: 0 }}>
              {p.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
