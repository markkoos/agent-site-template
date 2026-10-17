export type ListingStatus = "Active" | "Coming Soon" | "Pending" | "Sold";

/** Normalized listing shape. Every data source (manual, RESO feed) maps into this. */
export interface Listing {
  listingKey: string;
  slug: string;
  /** Optional marketing name ("Modern Hillside Retreat"). Falls back to the street address. */
  title?: string;
  mlsNumber?: string;
  status: ListingStatus;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  lotSqft?: number;
  yearBuilt?: number;
  propertyType: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  description: string;
  photos: string[];
  features: string[];
  listOffice?: string;
  listAgent?: string;
  featured?: boolean;
  source: "manual" | "reso";
  listedAt?: string;
  updatedAt: string;
}

export type StatusFilter = "active" | "pending" | "sold" | "all";
export type SortOption = "newest" | "price-asc" | "price-desc";

export interface ListingFilters {
  q?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  type?: string;
  status?: StatusFilter;
  sort?: SortOption;
  page?: number;
}

export interface SearchResult {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
}
