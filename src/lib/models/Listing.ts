import mongoose, { Schema, type Model } from "mongoose";
import type { Listing } from "../listings/types";

const ListingSchema = new Schema<Listing>(
  {
    listingKey: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    mlsNumber: String,
    status: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    sqft: Number,
    lotSqft: Number,
    yearBuilt: Number,
    propertyType: { type: String, index: true },
    street: String,
    city: { type: String, index: true },
    state: String,
    zip: { type: String, index: true },
    lat: Number,
    lng: Number,
    description: String,
    photos: [String],
    features: [String],
    listOffice: String,
    listAgent: String,
    featured: { type: Boolean, default: false, index: true },
    source: { type: String, default: "manual" },
    listedAt: String,
    updatedAt: String,
  },
  { versionKey: false },
);

ListingSchema.index({ status: 1, price: 1 });
ListingSchema.index({ status: 1, listedAt: -1 });

export const ListingModel: Model<Listing> =
  (mongoose.models.Listing as Model<Listing>) || mongoose.model<Listing>("Listing", ListingSchema);
