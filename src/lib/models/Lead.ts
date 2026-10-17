import mongoose, { Schema, type Model } from "mongoose";

export type LeadType = "contact" | "showing" | "valuation";

export interface Lead {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  listingSlug?: string;
  page?: string;
  address?: string;
  addressKey?: string;
  details?: {
    propertyType?: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    condition?: string;
    timeline?: string;
  };
  estimate?: {
    value: number;
    low: number;
    high: number;
    source: string;
    at: Date;
  };
  createdAt: Date;
}

const LeadSchema = new Schema<Lead>(
  {
    type: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: String,
    listingSlug: String,
    page: String,
    address: String,
    addressKey: { type: String, index: true },
    details: {
      propertyType: String,
      beds: Number,
      baths: Number,
      sqft: Number,
      condition: String,
      timeline: String,
    },
    estimate: {
      value: Number,
      low: Number,
      high: Number,
      source: String,
      at: Date,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false },
);

export const LeadModel: Model<Lead> =
  (mongoose.models.Lead as Model<Lead>) || mongoose.model<Lead>("Lead", LeadSchema);
