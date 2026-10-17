import type { MetadataRoute } from "next";
import { getAllAreas, getAllPosts } from "@/lib/content";
import { getListingSitemapEntries } from "@/lib/listings";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/site.config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, areas, listings] = await Promise.all([getAllPosts(), getAllAreas(), getListingSitemapEntries()]);
  const now = new Date();

  const staticPages = ["/", "/listings", "/home-valuation", "/about", "/contact", "/blog", "/areas", "/tools/mortgage-calculator"].map(
    (path) => ({ url: absoluteUrl(path), lastModified: now }),
  );

  const cityPages = site.serviceAreas.map((city) => ({
    url: absoluteUrl(`/listings?city=${encodeURIComponent(city)}`),
    lastModified: now,
  }));

  return [
    ...staticPages,
    ...cityPages,
    ...areas.map((a) => ({ url: absoluteUrl(`/areas/${a.slug}`), lastModified: a.updated ? new Date(a.updated) : now })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.updated ?? p.date) })),
    ...listings.map((l) => ({ url: absoluteUrl(`/listings/${l.slug}`), lastModified: new Date(l.updatedAt) })),
  ];
}
