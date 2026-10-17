import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { AGENT_ID, absoluteUrl, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: `Contact ${site.brand.siteName}`,
  description: `Schedule a viewing, discuss selling, or ask about off-market homes in ${site.serviceAreas.join(", ")}. We reply within one business day.`,
  path: "/contact",
});

export default function ContactPage() {
  const b = site.brokerage;
  const tel = site.agent.phone.replace(/[^0-9+]/g, "");
  const address = `${b.address.street}, ${b.address.city}, ${b.address.state} ${b.address.zip}`;

  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <div className="mt-10 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="eyebrow">Contact</div>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Let&apos;s start a quiet conversation.</h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Whether you&apos;re considering selling, buying, or simply want a considered second opinion on a property, we
            read every message.
          </p>
          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="eyebrow">Office</dt>
              <dd className="mt-1">
                {b.address.street}
                <br />
                {b.address.city}, {b.address.state} {b.address.zip}
                <br />
                <a
                  className="text-muted-foreground underline underline-offset-4"
                  target="_blank"
                  rel="noopener"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                >
                  Get directions
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Direct</dt>
              <dd className="mt-1">
                <a href={`tel:${tel}`}>{site.agent.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.agent.email}`}>{site.agent.email}</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-1">{site.officeHours}</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-7">
          <div className="rounded-md border border-border/60 bg-card p-6 md:p-8">
            <LeadForm />
          </div>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl("/contact"),
          mainEntity: { "@id": AGENT_ID },
        }}
      />
    </div>
  );
}
