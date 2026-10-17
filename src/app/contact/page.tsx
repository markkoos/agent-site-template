import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm } from "@/components/LeadForm";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: `Contact ${site.agent.name}`,
  description: `Call, text or email ${site.agent.name}, ${site.agent.jobTitle}, about buying or selling in ${site.serviceAreas.join(", ")}.`,
  path: "/contact",
});

export default function ContactPage() {
  const b = site.brokerage;
  const tel = site.agent.phone.replace(/[^0-9+]/g, "");
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <div className="page-head" style={{ paddingTop: 8 }}>
        <h1>Let&apos;s talk</h1>
        <p>Questions about a home, your home&apos;s value, or timing a move? Send a note and I&apos;ll reply personally.</p>
      </div>
      <div className="detail-layout" style={{ marginBottom: 72 }}>
        <div className="card card-body">
          <LeadForm />
        </div>
        <aside>
          <div className="card card-body">
            <h2 style={{ fontSize: "1.2rem" }}>{site.agent.name}</h2>
            <p>
              <a href={`tel:${tel}`}>{site.agent.phone}</a>
              <br />
              <a href={`mailto:${site.agent.email}`}>{site.agent.email}</a>
            </p>
            <address style={{ fontStyle: "normal" }}>
              {b.name}
              <br />
              {b.address.street}
              <br />
              {b.address.city}, {b.address.state} {b.address.zip}
            </address>
            <p className="small muted" style={{ marginTop: 12 }}>
              {site.officeHours}
            </p>
            <a
              className="btn btn-ghost"
              target="_blank"
              rel="noopener"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${b.address.street}, ${b.address.city}, ${b.address.state} ${b.address.zip}`,
              )}`}
            >
              Get directions
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
