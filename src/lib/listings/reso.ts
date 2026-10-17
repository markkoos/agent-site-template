/**
 * Maps a RESO Data Dictionary "Property" record into the site's Listing shape.
 * Field names follow the RESO Data Dictionary used by MLS Grid, Bridge, Trestle,
 * Spark and most MLS Web APIs. Individual MLSs add local fields — extend as needed.
 */
import { slugify } from "../format";
import type { Listing, ListingStatus } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResoRecord = Record<string, any>;

const STATUS: Record<string, ListingStatus> = {
  Active: "Active",
  "Coming Soon": "Coming Soon",
  "Active Under Contract": "Pending",
  Pending: "Pending",
  Closed: "Sold",
};

const toList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? v.split(",").map((s) => s.trim()) : [];

/** Returns null when the record should NOT be shown (off-market, withheld from IDX, etc.). */
export function mapResoProperty(p: ResoRecord): Listing | null {
  const status = STATUS[p.StandardStatus as string];
  if (!status) return null;
  // Respect seller opt-outs and feed visibility flags.
  if (p.InternetEntireListingDisplayYN === false) return null;
  if (p.MlgCanView === false) return null;

  const street =
    (p.UnparsedAddress as string | undefined)?.split(",")[0] ||
    [p.StreetNumber, p.StreetDirPrefix, p.StreetName, p.StreetSuffix, p.UnitNumber ? `#${p.UnitNumber}` : ""]
      .filter(Boolean)
      .join(" ");

  const key = String(p.ListingKey ?? p.ListingId);
  const city = String(p.City ?? "");
  const state = String(p.StateOrProvince ?? "");
  const zip = String(p.PostalCode ?? "");

  const media = Array.isArray(p.Media) ? [...p.Media] : [];
  media.sort((a: ResoRecord, b: ResoRecord) => (a.Order ?? 0) - (b.Order ?? 0));
  const photos = media
    .filter((m: ResoRecord) => !m.MediaCategory || /photo/i.test(String(m.MediaCategory)))
    .map((m: ResoRecord) => m.MediaURL as string)
    .filter(Boolean)
    .slice(0, 40);

  const baths =
    p.BathroomsTotalDecimal ??
    p.BathroomsTotalInteger ??
    (Number(p.BathroomsFull ?? 0) + 0.5 * Number(p.BathroomsHalf ?? 0) || 0);

  return {
    listingKey: key,
    slug: slugify(`${street} ${city} ${state} ${zip} ${key}`),
    mlsNumber: p.ListingId ? String(p.ListingId) : undefined,
    status,
    price: Number(status === "Sold" ? (p.ClosePrice ?? p.ListPrice) : p.ListPrice) || 0,
    beds: Number(p.BedroomsTotal ?? 0),
    baths: Number(baths),
    sqft: p.LivingArea ? Number(p.LivingArea) : undefined,
    lotSqft: p.LotSizeSquareFeet ? Number(p.LotSizeSquareFeet) : undefined,
    yearBuilt: p.YearBuilt ? Number(p.YearBuilt) : undefined,
    propertyType: String(p.PropertySubType ?? p.PropertyType ?? "Residential"),
    street,
    city,
    state,
    zip,
    lat: p.Latitude ? Number(p.Latitude) : undefined,
    lng: p.Longitude ? Number(p.Longitude) : undefined,
    description: String(p.PublicRemarks ?? ""),
    photos,
    features: [
      ...toList(p.InteriorFeatures),
      ...toList(p.ExteriorFeatures),
      ...toList(p.View).map((v) => `View: ${v}`),
      ...(p.PoolPrivateYN ? ["Private pool"] : []),
      ...(p.GarageSpaces ? [`${p.GarageSpaces}-car garage`] : []),
    ].slice(0, 30),
    listOffice: p.ListOfficeName ? String(p.ListOfficeName) : undefined,
    listAgent: p.ListAgentFullName ? String(p.ListAgentFullName) : undefined,
    featured: false,
    source: "reso",
    listedAt: p.OnMarketDate ?? p.ListingContractDate ?? undefined,
    updatedAt: String(p.ModificationTimestamp ?? new Date().toISOString()),
  };
}
