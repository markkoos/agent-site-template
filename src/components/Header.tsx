import Link from "next/link";
import { site } from "@/site.config";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          {site.brand.siteName}
        </Link>

        <nav className="nav-desktop" aria-label="Main">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a className="btn" href={`tel:${site.agent.phone.replace(/[^0-9+]/g, "")}`}>
            {site.agent.phone}
          </a>
        </nav>

        <MobileNav items={site.nav} phone={site.agent.phone} />
      </div>
    </header>
  );
}
