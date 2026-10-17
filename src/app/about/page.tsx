import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { SafeImg } from "@/components/SafeImg";
import { btn } from "@/components/ui";
import { pageMetadata, profilePageSchema } from "@/lib/seo";
import { site } from "@/site.config";

const a = site.agent;

export const metadata = pageMetadata({
  title: `About ${site.brand.siteName}`,
  description: `Meet ${site.team.length > 1 ? site.team.map((m) => m.name).join(" and ") : a.name} — ${a.yearsExperience}+ years representing homes across ${site.serviceAreas.join(", ")}. Credentials, approach and license verification.`,
  path: "/about",
});

export default function AboutPage() {
  const facts = [
    site.foundingYear ? { k: "Founded", v: String(site.foundingYear) } : null,
    { k: "Experience", v: `${a.yearsExperience}+ years` },
    { k: "Cities", v: site.serviceAreas.join(" · ") },
    { k: "License", v: `${a.licenseLabel}${a.licenseNumber}` },
  ].filter((x): x is { k: string; v: string } => x !== null);

  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <div className="mt-10 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="eyebrow">About</div>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{a.shortBio}</h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            {a.bio.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className={btn.primary}>
              Work with us
            </Link>
            <Link href="/home-evaluation" className={btn.outline}>
              Request a valuation
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
            <SafeImg
              src={a.headshot}
              fallback="/agent-placeholder.svg"
              alt={site.teamPhotoCaption || a.name}
              loading="eager"
              width={960}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-6 text-sm text-muted-foreground">{site.teamPhotoCaption || `${a.name}, ${a.jobTitle}`}</div>
        </div>
      </div>

      {/* Concrete, verifiable facts = Experience + Expertise + Trust */}
      <dl className="mt-24 grid gap-10 border-t border-border/60 pt-16 sm:grid-cols-2 md:grid-cols-4">
        {facts.map((row) => (
          <div key={row.k}>
            <dt className="eyebrow">{row.k}</dt>
            <dd className="mt-2 font-serif text-xl">{row.v}</dd>
          </div>
        ))}
      </dl>
      {a.licenseVerifyUrl ? (
        <p className="mt-6 text-xs text-muted-foreground">
          Licenses can be verified with the state licensing authority:{" "}
          <a href={a.licenseVerifyUrl} target="_blank" rel="noopener" className="underline underline-offset-4">
            public license lookup
          </a>
          .
        </p>
      ) : null}

      {site.team.length > 1 && (
        <section className="mt-20">
          <div className="eyebrow">The team</div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.team.map((m) => (
              <div key={m.name} className="rounded-md border border-border/60 bg-card p-6">
                <div className="font-serif text-2xl">{m.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{m.title}</div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {a.licenseLabel}
                  {m.licenseNumber}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(a.designations.length > 0 || a.languages.length > 0 || a.awards.length > 0) && (
        <section className="mt-20 grid gap-10 md:grid-cols-3">
          {a.designations.length > 0 && (
            <div>
              <div className="eyebrow">Designations</div>
              <ul className="mt-3 space-y-2 text-sm">
                {a.designations.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {a.languages.length > 0 && (
            <div>
              <div className="eyebrow">Languages</div>
              <p className="mt-3 text-sm">{a.languages.join(", ")}</p>
            </div>
          )}
          {a.awards.length > 0 && (
            <div>
              <div className="eyebrow">Recognition</div>
              <ul className="mt-3 space-y-2 text-sm">
                {a.awards.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {site.testimonials.length > 0 && (
        <section className="mt-20 border-t border-border/60 pt-16">
          <div className="eyebrow">Client notes</div>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {site.testimonials.map((t) => (
              <figure key={t.name + t.quote.slice(0, 20)}>
                <blockquote className="font-serif text-xl leading-snug">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  {t.name}
                  {t.context ? ` · ${t.context}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mt-20 grid gap-12 border-t border-border/60 pt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="eyebrow">Questions</div>
          <h2 className="mt-2 font-serif text-3xl">Common questions</h2>
        </div>
        <div className="md:col-span-8">
          <FaqList faqs={site.faqs} />
        </div>
      </section>

      <JsonLd data={profilePageSchema()} />
    </div>
  );
}
