import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { btn } from "@/components/ui";
import { getAllPosts, getPost } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMetadata, postSchema } from "@/lib/seo";
import { site } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, type: "article" });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />
        <div className="eyebrow mt-10">{post.tags[0] ?? "Journal"}</div>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">{post.title}</h1>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>
            By{" "}
            <Link href="/about" className="text-foreground hover:underline">
              {site.agent.name}
            </Link>
          </span>
          <span>
            Published <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated ? (
            <span>
              Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          ) : null}
          <span>{post.readingMinutes} min read</span>
        </div>

        {/* Answer-first summary: the passage AI answer engines are most likely to quote */}
        {post.tldr ? (
          <div className="mt-10 border-l-2 border-accent bg-card px-6 py-5">
            <div className="eyebrow">Short answer</div>
            <p className="mt-2 leading-relaxed">{post.tldr}</p>
          </div>
        ) : null}

        <div className="prose-editorial mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 font-serif text-3xl">Frequently asked questions</h2>
            <FaqList faqs={post.faqs} />
          </section>
        )}

        {post.sources.length > 0 && (
          <section className="mt-12">
            <div className="eyebrow">Sources</div>
            <ul className="mt-3 space-y-1 text-sm">
              {post.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-4">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <AuthorBox />

        <div className="flex flex-col items-start gap-4 rounded-md bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-serif text-2xl">Have a question about your situation?</div>
            <p className="mt-1 text-sm text-primary-foreground/80">A straight answer from a local agent — no pressure.</p>
          </div>
          <Link href="/contact" className={btn.accent}>
            Get in touch
          </Link>
        </div>
      </div>

      <JsonLd data={postSchema(post)} />
    </article>
  );
}
