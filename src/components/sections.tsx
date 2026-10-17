/**
 * Homepage building blocks (Lovable editorial design).
 * Order/visibility is controlled by site.home.sections in site.config.ts.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllAreas, getAllPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getFeaturedListings } from "@/lib/listings";
import { site, type HomeSection } from "@/site.config";
import { FaqList } from "./FaqList";
import { ListingCard } from "./ListingCard";
import { SafeImg } from "./SafeImg";
import { btn } from "./ui";

function Hero() {
  const h = site.home.hero;
  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="flex flex-col justify-center md:col-span-6">
          <div className="eyebrow">{h.eyebrow}</div>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
            {h.headline}
            <span className="italic text-accent"> {h.headlineAccent}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground">{h.subhead}</p>

          <form action="/properties" role="search" className="mt-8 flex max-w-lg gap-2">
            <label htmlFor="hero-q" className="sr-only">
              City, ZIP or address
            </label>
            <input id="hero-q" name="q" placeholder="City, ZIP or address" className="field flex-1 px-4 py-3" />
            <button className={btn.primary}>Search</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/home-evaluation" className={btn.link}>
              What&apos;s my home worth? →
            </Link>
            <Link href="/contact" className={btn.link}>
              Work with us →
            </Link>
          </div>

          {site.home.stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              {site.home.stats.map((s) => (
                <div key={s.label}>
                  <dt className="eyebrow">{s.label}</dt>
                  <dd className="mt-1 font-serif text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="md:col-span-6">
          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
              <SafeImg
                src={h.image}
                alt={h.imageAlt}
                loading="eager"
                fetchPriority="high"
                width={1200}
                height={1500}
                className="h-full w-full object-cover"
              />
            </div>
            {h.spotlight ? (
              <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-md border border-border/60 bg-background p-4 shadow-sm md:block">
                <div className="eyebrow">{h.spotlight.label}</div>
                <div className="mt-1 font-serif text-lg leading-tight">{h.spotlight.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{h.spotlight.meta}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

async function FeaturedListings() {
  const listings = await getFeaturedListings(3);
  if (!listings.length) return null;
  return (
    <section className="border-t border-border/60 bg-secondary/30 py-20">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Selected work</div>
            <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">Currently representing</h2>
          </div>
          <Link href="/properties" className={btn.link}>
            View all properties →
          </Link>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.listingKey} listing={l} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="container-page py-24">
      <div className="grid gap-16 md:grid-cols-3">
        {site.home.pillars.map((item, i) => (
          <div key={item.title}>
            <div className="font-serif text-4xl text-accent">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="mt-4 font-serif text-2xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ValuationCta() {
  return (
    <section className="container-page pb-24">
      <div className="grid items-center gap-8 rounded-md bg-primary px-8 py-12 text-primary-foreground md:grid-cols-[1.5fr_auto] md:px-12">
        <div>
          <div className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-primary-foreground/70">Home evaluation</div>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">What is your home worth today?</h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">
            A private, agent-prepared valuation based on recent comparable sales and current demand — complimentary
            and confidential.
          </p>
        </div>
        <Link href="/home-evaluation" className={btn.accent}>
          Request a valuation
        </Link>
      </div>
    </section>
  );
}

function AboutSnippet() {
  const a = site.agent;
  return (
    <section className="border-t border-border/60 py-24">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
            <SafeImg
              src={a.headshot}
              fallback="/agent-placeholder.svg"
              alt={site.teamPhotoCaption || a.name}
              width={960}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center md:col-span-7">
          <div className="eyebrow">About</div>
          <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{a.shortBio}</h2>
          <p className="mt-6 text-muted-foreground">{a.bio[0]}</p>
          <div className="mt-8">
            <Link href="/about" className={btn.outline}>
              Meet the team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

async function Areas() {
  const areas = await getAllAreas();
  if (!areas.length) return null;
  return (
    <section className="border-t border-border/60 py-20">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Neighborhood guides</div>
            <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">Where we work</h2>
          </div>
          <Link href="/areas" className={btn.link}>
            All guides →
          </Link>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 md:grid-cols-3">
          {areas.map((a) => (
            <Link key={a.slug} href={`/areas/${a.slug}`} className="group bg-background p-8 transition-colors hover:bg-secondary/50">
              <h3 className="font-serif text-2xl group-hover:text-accent">{a.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  if (!site.testimonials.length) return null;
  return (
    <section className="border-t border-border/60 bg-secondary/30 py-20">
      <div className="container-page">
        <div className="eyebrow">Client notes</div>
        <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">In their words</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {site.testimonials.map((t) => (
            <figure key={t.name + t.quote.slice(0, 20)}>
              <blockquote className="font-serif text-xl leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">
                {t.name}
                {t.context ? ` · ${t.context}` : ""}
                {t.source ? ` · via ${t.source}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

async function LatestPosts() {
  const posts = (await getAllPosts()).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="border-t border-border/60 py-20">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Journal</div>
            <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">Field notes from the practice</h2>
          </div>
          <Link href="/blog" className={btn.link}>
            All articles →
          </Link>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {posts.map((p) => (
            <article key={p.slug} className="group">
              <div className="eyebrow">
                {p.tags[0] ?? "Journal"} · {p.readingMinutes} min
              </div>
              <h3 className="mt-3 font-serif text-2xl leading-tight transition-colors group-hover:text-accent">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <time className="mt-4 block text-xs text-muted-foreground" dateTime={p.updated ?? p.date}>
                {formatDate(p.updated ?? p.date)}
              </time>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="border-t border-border/60 py-20">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="eyebrow">Questions</div>
          <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">Frequently asked</h2>
        </div>
        <div className="md:col-span-8">
          <FaqList faqs={site.faqs} />
        </div>
      </div>
    </section>
  );
}

const SECTIONS: Record<HomeSection, () => ReactNode | Promise<ReactNode>> = {
  hero: Hero,
  featuredListings: FeaturedListings,
  pillars: Pillars,
  valuationCta: ValuationCta,
  aboutSnippet: AboutSnippet,
  areas: Areas,
  testimonials: Testimonials,
  latestPosts: LatestPosts,
  faq: Faq,
};

export function HomeSections() {
  return (
    <>
      {site.home.sections.map((key, i) => {
        const Section = SECTIONS[key];
        return Section ? <Section key={`${key}-${i}`} /> : null;
      })}
    </>
  );
}
