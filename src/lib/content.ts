/**
 * Markdown content loader for blog posts (content/blog) and area guides (content/areas).
 * Content lives in Git: fast, free, versioned, and easy for you (or Claude) to write.
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export interface Faq {
  q: string;
  a: string;
}
export interface SourceLink {
  title: string;
  url: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  /** Answer-first summary shown at the top — what AI answer engines quote. */
  tldr?: string;
  tags: string[];
  faqs: Faq[];
  sources: SourceLink[];
  html: string;
  readingMinutes: number;
}

export interface Area {
  slug: string;
  name: string;
  /** Exact city value used in listing data, for "homes for sale in X" sections. */
  city: string;
  description: string;
  tldr?: string;
  highlights: string[];
  faqs: Faq[];
  updated?: string;
  html: string;
}

const root = process.cwd();

async function readDir(dir: string) {
  try {
    const files = await fs.readdir(path.join(root, dir));
    return files.filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}

const asDate = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v) : undefined);

async function loadFile(dir: string, file: string) {
  const raw = await fs.readFile(path.join(root, dir, file), "utf8");
  const { data, content } = matter(raw);
  const html = await marked.parse(content);
  return { slug: file.replace(/\.md$/, ""), data, content, html };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await readDir("content/blog");
  const posts = await Promise.all(
    files.map(async (file): Promise<Post | null> => {
      const { slug, data, content, html } = await loadFile("content/blog", file);
      if (data.draft) return null;
      const post: Post = {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: asDate(data.date) ?? "1970-01-01",
        updated: asDate(data.updated),
        tldr: data.tldr ? String(data.tldr) : undefined,
        tags: (data.tags as string[]) ?? [],
        faqs: (data.faqs as Faq[]) ?? [],
        sources: (data.sources as SourceLink[]) ?? [],
        html,
        readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 225)),
      };
      return post;
    }),
  );
  return posts.filter((p): p is Post => p !== null).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  return (await getAllPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getAllAreas(): Promise<Area[]> {
  const files = await readDir("content/areas");
  const areas = await Promise.all(
    files.map(async (file) => {
      const { slug, data, html } = await loadFile("content/areas", file);
      return {
        slug,
        name: String(data.name ?? slug),
        city: String(data.city ?? data.name ?? slug),
        description: String(data.description ?? ""),
        tldr: data.tldr ? String(data.tldr) : undefined,
        highlights: (data.highlights as string[]) ?? [],
        faqs: (data.faqs as Faq[]) ?? [],
        updated: asDate(data.updated),
        html,
      } satisfies Area;
    }),
  );
  return areas.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getArea(slug: string) {
  return (await getAllAreas()).find((a) => a.slug === slug) ?? null;
}
