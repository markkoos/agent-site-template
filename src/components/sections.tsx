/**
 * Homepage building blocks. Order/visibility is controlled by
 * site.home.sections in site.config.ts — rearrange per client without code.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllAreas, getAllPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getFeaturedListings } from "@/lib/listings";
import { site, type HomeSection } from "@/site.config";
import { FaqList } from "./FaqList";
import { ListingCard } from "./ListingCard";

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <p className="eyebrow" style={{ color: "#fff", opacity: 0.85 }}>
          {site.agent.name} · {site.agent.jobTitle}
        </p>
        <h1>{site.home.hero.headline}</h1>
        <p>{site.home.hero.subhead}</p>
        <form className="hero-search" action="/listings" role="search">
          <label htmlFor="hero-q" className="visually-hidden">
            City, ZIP or address
          </label>
          <input id="hero-q" name="q" placeholder="City, ZIP or address" />
          <button className="btn">Search</button>
        </form>
        <div className="hero-links">
          <Link href="/home-valuation">What&apos;s my home worth? →</Link>
          <Link href="/tools/mortgage-calculator">Estimate a payment →</Link>
        </div>
      </div>
    </section>
  );
}

async function FeaturedListings() {
  const listings = await getFeaturedListings(6);
  if (!listings.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">For sale now</p>
            <h2>Featured homes</h2>
          </div>
          <Link className="btn btn-ghost" href="/listings">
            View all homes
          </Link>
        </div>
        <div className="grid">
          {listings.map((l) => (
            <ListingCard key={l.listingKey} listing={l} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuationCta() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band">
          <div>
            <h2 style={{ marginBottom: 6 }}>What is your home worth today?</h2>
            <p>Get an instant estimate plus a free, personal market analysis — no obligation.</p>
          </div>
          <Link href="/home-valuation" className="btn btn-light">
            Get my home value
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutSnippet() {
  const a = site.agent;
  return (
    <section className="section section-alt">
      <div className="container split">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="headshot" src={a.headshot} alt={`${a.name}, ${a.jobTitle}`} width={480} height={600} loading="lazy" />
        <div>
          <p className="eyebrow">Meet your agent</p>
          <h2>{a.name}</h2>
          <p>{a.shortBio}</p>
          <ul className="muted">
            <li>{a.yearsExperience}+ years of local experience</li>
            {a.designations.slice(0, 2).map((d) => (
              <li key={d}>{d}</li>
            ))}
            <li>Speaks {a.languages.join(" & ")}</li>
          </ul>
          <Link className="btn" href="/about">
            More about {a.name.split(" ")[0]}
          </Link>
        </div>
      </div>
    </section>
  );
}

async function Areas() {
  const areas = await getAllAreas();
  if (!areas.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Neighborhood guides</p>
            <h2>Areas I serve</h2>
          </div>
        </div>
        <div className="grid">
          {areas.map((a) => (
            <Link key={a.slug} href={`/areas/${a.slug}`} className="card card-body listing-card">
              <h3>{a.name}</h3>
              <p className="muted small" style={{ margin: 0 }}>
                {a.description}
              </p>
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
    <section className="section section-alt">
      <div className="container">
        <p className="eyebrow">Client stories</p>
        <h2>What clients say</h2>
        <div className="grid" style={{ marginTop: 24 }}>
          {site.testimonials.map((t) => (
            <figure key={t.name + t.quote.slice(0, 20)} className="card quote">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption className="small muted">
                — {t.name}
                {t.context ? `, ${t.context}` : ""}
                {t.source ? ` (via ${t.source})` : ""}
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
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Local advice</p>
            <h2>From the blog</h2>
          </div>
          <Link className="btn btn-ghost" href="/blog">
            All articles
          </Link>
        </div>
        <div className="grid">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-body listing-card">
              <p className="small muted" style={{ margin: "0 0 6px" }}>
                {formatDate(p.updated ?? p.date)} · {p.readingMinutes} min read
              </p>
              <h3>{p.title}</h3>
              <p className="muted small" style={{ margin: 0 }}>
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section section-alt">
      <div className="narrow">
        <p className="eyebrow">Questions</p>
        <h2>Frequently asked questions</h2>
        <FaqList faqs={site.faqs} />
      </div>
    </section>
  );
}

const SECTIONS: Record<HomeSection, () => ReactNode | Promise<ReactNode>> = {
  hero: Hero,
  featuredListings: FeaturedListings,
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
