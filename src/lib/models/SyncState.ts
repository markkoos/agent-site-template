import mongoose, { Schema, type Model } from "mongoose";

export interface SyncState {
  key: string;
  lastModified?: string;
  lastRunAt?: Date;
  lastCount?: number;
}

const SyncStateSchema = new Schema<SyncState>(
  {
    key: { type: String, required: true, unique: true },
    lastModified: String,
    lastRunAt: Date,
    lastCount: Number,
  },
  { versionKey: false },
);

export const SyncStateModel: Model<SyncState> =
  (mongoose.models.SyncState as Model<SyncState>) ||
  mongoose.model<SyncState>("SyncState", SyncStateSchema);
