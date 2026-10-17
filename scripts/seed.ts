/**
 * Loads data/demo-listings.json (or your own JSON file) into MongoDB.
 *   npm run seed                      → demo listings
 *   npm run seed -- path/to/file.json → your own manually-entered listings
 * Upserts by listingKey, so it's safe to run repeatedly.
 */
import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { connectDb } from "../src/lib/db";
import type { Listing } from "../src/lib/listings/types";
import { ListingModel } from "../src/lib/models/Listing";

async function main() {
  const file = process.argv[2] ?? "data/demo-listings.json";
  const listings = JSON.parse(await fs.readFile(path.resolve(file), "utf8")) as Listing[];
  await connectDb();
  await ListingModel.syncIndexes();

  const ops = listings.map((l) => ({
    updateOne: { filter: { listingKey: l.listingKey }, update: { $set: l }, upsert: true },
  }));
  const res = await ListingModel.bulkWrite(ops);
  console.log(`Seeded ${listings.length} listings (${res.upsertedCount} new, ${res.modifiedCount} updated) from ${file}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
