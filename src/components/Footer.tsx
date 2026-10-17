import Link from "next/link";
import { site } from "@/site.config";

export function Footer() {
  const b = site.brokerage;
  const tel = site.agent.phone.replace(/[^0-9+]/g, "");
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl tracking-tight">{site.brand.siteName}</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{site.agent.shortBio}</p>
          <div className="eyebrow mb-3 mt-8">Areas served</div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {site.serviceAreas.map((a) => (
              <li key={a}>
                <Link
                  href={`/properties?city=${encodeURIComponent(a)}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Homes for sale in {a}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Explore</div>
          <ul className="space-y-2 text-sm">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted-foreground hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tools/mortgage-calculator" className="text-muted-foreground hover:text-foreground">
                Mortgage calculator
              </Link>
            </li>
          </ul>
        </div>
        {/* Consistent NAP (name, address, phone) matters for local SEO */}
        <div>
          <div className="eyebrow mb-3">Office</div>
          <address className="space-y-2 text-sm not-italic text-muted-foreground">
            <div>{b.address.street}</div>
            <div>
              {b.address.city}, {b.address.state} {b.address.zip}
            </div>
            <div>
              <a href={`tel:${tel}`} className="hover:text-foreground">
                {site.agent.phone}
              </a>
            </div>
            <div>
              <a href={`mailto:${site.agent.email}`} className="hover:text-foreground">
                {site.agent.email}
              </a>
            </div>
          </address>
        </div>
      </div>
      <div className="border-t border-border/60 py-5">
        <div className="container-page flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.brand.siteName}. {site.agent.name}, {site.agent.licenseLabel}
            {site.agent.licenseNumber}. Brokered by {b.name}
            {b.licenseNumber ? ` (${site.agent.licenseLabel}${b.licenseNumber})` : ""}.{" "}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Privacy
            </Link>
          </span>
          {site.legal.equalHousing ? <span>An equal housing opportunity.</span> : null}
        </div>
      </div>
    </footer>
  );
}
