"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** <details>-based menu (works without JS); closes itself after navigation. */
export function MobileNav({ items, phone }: { items: { label: string; href: string }[]; phone: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details className="nav-mobile" ref={ref}>
      <summary aria-label="Open menu">Menu</summary>
      <nav aria-label="Mobile">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>Call {phone}</a>
      </nav>
    </details>
  );
}
