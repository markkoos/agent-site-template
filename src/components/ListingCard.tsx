import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/listings/types";

export function ListingCard({ listing: l }: { listing: Listing }) {
  const badgeClass = l.status === "Pending" ? "badge pending" : l.status === "Sold" ? "badge sold" : "badge";
  return (
    <Link href={`/listings/${l.slug}`} className="card listing-card">
      <div className="listing-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={l.photos[0] || "/placeholder-home.svg"}
          alt={`${l.street}, ${l.city} — ${l.beds} bed ${l.propertyType.toLowerCase()}`}
          width={640}
          height={480}
          loading="lazy"
          decoding="async"
        />
        <span className={badgeClass}>{l.status}</span>
      </div>
      <div className="card-body">
        <p className="price">{formatPrice(l.price)}</p>
        <div className="facts">
          <span>{l.beds} bd</span>
          <span>{l.baths} ba</span>
          {l.sqft ? <span>{formatNumber(l.sqft)} sq ft</span> : null}
          <span>{l.propertyType}</span>
        </div>
        <p className="small" style={{ margin: "8px 0 0" }}>
          {l.street}, {l.city}, {l.state} {l.zip}
        </p>
        {l.listOffice ? <p className="small muted" style={{ margin: "6px 0 0" }}>Courtesy of {l.listOffice}</p> : null}
      </div>
    </Link>
  );
}
