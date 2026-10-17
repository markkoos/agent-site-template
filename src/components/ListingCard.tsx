import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/listings/types";
import { SafeImg } from "./SafeImg";

export function ListingCard({ listing: l }: { listing: Listing }) {
  const badge = l.status !== "Active" ? l.status : l.featured ? "Featured" : null;
  const title = l.title || l.street;
  return (
    <Link href={`/properties/${l.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        <SafeImg
          src={l.photos[0]}
          alt={`${title}, ${l.city} — ${l.beds} bed ${l.propertyType.toLowerCase()}`}
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow">
            {l.city}, {l.state}
          </div>
          <h3 className="mt-1 font-serif text-xl leading-tight text-foreground">{title}</h3>
          {l.title ? <p className="mt-1 truncate text-sm text-muted-foreground">{l.street}</p> : null}
        </div>
        <div className="shrink-0 text-right font-serif text-lg text-foreground">{formatPrice(l.price)}</div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span>{l.beds} bd</span>
        <span>{l.baths} ba</span>
        {l.sqft ? <span>{formatNumber(l.sqft)} sq ft</span> : null}
        <span>{l.propertyType}</span>
      </div>
      {l.listOffice ? <p className="mt-2 text-[11px] text-muted-foreground">Courtesy of {l.listOffice}</p> : null}
    </Link>
  );
}
