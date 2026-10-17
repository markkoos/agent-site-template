import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
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
    <article className="narrow" style={{ paddingBottom: 72 }}>
      <Breadcrumbs
        items={[
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <h1>{post.title}</h1>
      <div className="byline">
        <span>
          By <Link href="/about">{site.agent.name}</Link>, {site.agent.jobTitle}
        </span>
        <span>
          Published <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
        {post.updated && (
          <span>
            Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
          </span>
        )}
        <span>{post.readingMinutes} min read</span>
      </div>

      {/* Answer-first summary: the passage AI answer engines are most likely to quote */}
      {post.tldr && (
        <div className="tldr">
          <strong>Short answer</strong>
          {post.tldr}
        </div>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.faqs.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2>Frequently asked questions</h2>
          <FaqList faqs={post.faqs} />
        </section>
      )}

      {post.sources.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: "1.2rem" }}>Sources</h2>
          <ul className="small">
            {post.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AuthorBox />

      <div className="cta-band">
        <div>
          <h2 style={{ marginBottom: 6, fontSize: "1.4rem" }}>Have a question about your situation?</h2>
          <p>Get a straight answer from a local agent — no pressure.</p>
        </div>
        <Link href="/contact" className="btn btn-light">
          Ask {site.agent.name.split(" ")[0]}
        </Link>
      </div>

      <JsonLd data={postSchema(post)} />
    </article>
  );
}
