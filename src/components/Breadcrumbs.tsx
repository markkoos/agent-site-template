import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumbs + matching BreadcrumbList schema. */
export function Breadcrumbs({ items, className = "" }: { items: { name: string; path: string }[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-muted-foreground ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((it, i) => (
          <li key={`${it.path}-${i}`} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {it.name}
              </span>
            ) : (
              <Link href={it.path} className="hover:text-foreground">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbSchema(all)} />
    </nav>
  );
}
