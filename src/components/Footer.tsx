import Link from "next/link";
import { site } from "@/site.config";

export function Footer() {
  const b = site.brokerage;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Consistent NAP (name, address, phone) matters for local SEO */}
          <div>
            <h2>{site.agent.name}</h2>
            <p className="small">
              {site.agent.jobTitle} · {site.agent.licenseLabel}
              {site.agent.licenseNumber}
              <br />
              {b.name}
              <br />
              {b.address.street}
              <br />
              {b.address.city}, {b.address.state} {b.address.zip}
            </p>
            <p className="small">
              <a href={`tel:${site.agent.phone.replace(/[^0-9+]/g, "")}`}>{site.agent.phone}</a>
              <br />
              <a href={`mailto:${site.agent.email}`}>{site.agent.email}</a>
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Areas served</h2>
            <ul>
              {site.serviceAreas.map((a) => (
                <li key={a}>
                  <Link href={`/listings?city=${encodeURIComponent(a)}`}>Homes for sale in {a}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            © {year} {site.agent.name}. Brokered by {b.name}
            {b.licenseNumber ? ` (${site.agent.licenseLabel}${b.licenseNumber})` : ""}.{" "}
            <Link href="/privacy">Privacy</Link>
          </p>
          {site.legal.equalHousing && (
            <p>
              Equal Housing Opportunity. We are pledged to the letter and spirit of U.S. policy for the achievement of
              equal housing opportunity throughout the nation.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
