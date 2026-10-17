import Link from "next/link";
import { site } from "@/site.config";
import { MobileNav } from "./MobileNav";
import { btn } from "./ui";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl tracking-tight text-foreground">{site.brand.siteName}</span>
          {site.brand.logoSuffix ? <span className="eyebrow hidden sm:inline">{site.brand.logoSuffix}</span> : null}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href={site.headerCta.href} className={`${btn.primary} ml-2 px-4 py-2`}>
            {site.headerCta.label}
          </Link>
        </nav>

        <MobileNav items={site.nav} phone={site.agent.phone} cta={site.headerCta} />
      </div>
    </header>
  );
}
