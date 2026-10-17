import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumbs + matching BreadcrumbList schema. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {all.map((it, i) => (
          <li key={it.path}>
            {i === all.length - 1 ? <span aria-current="page">{it.name}</span> : <Link href={it.path}>{it.name}</Link>}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbSchema(all)} />
    </nav>
  );
}
