"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Item = { label: string; href: string };

/** <details>-based menu (works without JS); closes itself after navigation. */
export function MobileNav({ items, phone, cta }: { items: Item[]; phone: string; cta: Item }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary className="cursor-pointer list-none rounded-md border border-input px-3 py-2 text-sm text-foreground [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <nav
        aria-label="Mobile"
        className="absolute right-0 top-12 grid w-64 rounded-md border border-border/60 bg-card p-2 shadow-lg"
      >
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-sm px-3 py-2.5 text-sm text-foreground hover:bg-secondary">
            {item.label}
          </Link>
        ))}
        <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary">
          Call {phone}
        </a>
        <Link
          href={cta.href}
          className="mt-1 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
        >
          {cta.label}
        </Link>
      </nav>
    </details>
  );
}
