import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, profilePageSchema } from "@/lib/seo";
import { site } from "@/site.config";

const a = site.agent;

export const metadata = pageMetadata({
  title: `About ${a.name}, ${a.jobTitle}`,
  description: `${a.name} is a licensed ${a.jobTitle} with ${a.yearsExperience}+ years serving ${site.serviceAreas.join(", ")}. Credentials, approach and client reviews.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <div className="container">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      </div>
      <section className="section" style={{ paddingTop: 16 }}>
        <div className="container split">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="headshot" src={a.headshot} alt={`${a.name}, ${a.jobTitle}`} width={480} height={600} />
          <div>
            <p className="eyebrow">About</p>
            <h1>{a.name}</h1>
            <p className="muted">
              {a.jobTitle} · {site.brokerage.name} · {a.licenseLabel}
              {a.licenseNumber}
            </p>
            {a.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="btn" href="/contact">
                Work with {a.name.split(" ")[0]}
              </Link>
              <Link className="btn btn-ghost" href="/home-valuation">
                Get a home value
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials block: concrete, verifiable facts = Experience + Expertise + Trust */}
      <section className="section section-alt">
        <div className="container">
          <h2>Credentials</h2>
          <dl className="fact-table">
            <div>
              <dt>Experience</dt>
              <dd>{a.yearsExperience}+ years</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>
                {a.licenseLabel}
                {a.licenseNumber}
                {a.licenseVerifyUrl ? (
                  <>
                    {" "}
                    <a className="small" href={a.licenseVerifyUrl} target="_blank" rel="noopener">
                      Verify
                    </a>
                  </>
                ) : null}
              </dd>
            </div>
            <div>
              <dt>Brokerage</dt>
              <dd>{site.brokerage.name}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{a.languages.join(", ")}</dd>
            </div>
            <div>
              <dt>Service areas</dt>
              <dd>{site.serviceAreas.join(", ")}</dd>
            </div>
          </dl>
          {a.designations.length > 0 && (
            <>
              <h3>Designations</h3>
              <ul>
                {a.designations.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}
          {a.awards.length > 0 && (
            <>
              <h3>Recognition</h3>
              <ul>
                {a.awards.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {site.testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <h2>Client reviews</h2>
            <div className="grid">
              {site.testimonials.map((t) => (
                <figure key={t.name + t.quote.slice(0, 20)} className="card quote">
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption className="small muted">
                    — {t.name}
                    {t.context ? `, ${t.context}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="narrow">
          <h2>Common questions</h2>
          <FaqList faqs={site.faqs} />
        </div>
      </section>

      <JsonLd data={profilePageSchema()} />
    </>
  );
}
