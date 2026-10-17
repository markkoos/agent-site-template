/**
 * MLS → MongoDB replication over the RESO Web API (OData).
 *
 * Run only after the MLS has approved your data license and issued credentials.
 * Works with MLS Grid, Bridge Interactive, Trestle, Spark and most RESO-certified
 * feeds; each MLS has quirks, so read its docs and adjust the env filters.
 *
 *   npm run sync:reso            → incremental (changes since last run)
 *   npm run sync:reso -- --full  → full re-pull of displayable listings
 *
 * Schedule it with .github/workflows/sync-listings.yml (or any cron).
 */
import mongoose from "mongoose";
import { connectDb } from "../src/lib/db";
import { mapResoProperty } from "../src/lib/listings/reso";
import { ListingModel } from "../src/lib/models/Listing";
import { SyncStateModel } from "../src/lib/models/SyncState";

const BASE = process.env.RESO_BASE_URL?.replace(/\/$/, "");
const TOKEN = process.env.RESO_ACCESS_TOKEN;
const RESOURCE = process.env.RESO_RESOURCE || "Property";
const BASE_FILTER = process.env.RESO_BASE_FILTER || "";
const EXPAND = process.env.RESO_EXPAND ?? "Media";
const PAGE = 200;
const STATE_KEY = `reso:${RESOURCE}`;

const INITIAL_STATUS_FILTER =
  "(StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon' or StandardStatus eq 'Active Under Contract' or StandardStatus eq 'Pending')";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(url: string, attempt = 1): Promise<{ value: Record<string, unknown>[]; next?: string }> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" } });
  if (res.status === 429 && attempt <= 5) {
    // Most MLS APIs rate-limit — back off and retry.
    await sleep(2000 * attempt);
    return fetchPage(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`RESO ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { value: Record<string, unknown>[]; "@odata.nextLink"?: string };
  return { value: json.value ?? [], next: json["@odata.nextLink"] };
}

async function main() {
  if (!BASE || !TOKEN) {
    console.error("Set RESO_BASE_URL and RESO_ACCESS_TOKEN first (see .env.example).");
    process.exit(1);
  }
  const full = process.argv.includes("--full");
  await connectDb();
  const state = full ? null : await SyncStateModel.findOne({ key: STATE_KEY }).lean();
  const since = state?.lastModified;

  // Incremental runs pull ALL changes (incl. sold/withdrawn) so stale listings get removed.
  const parts = [BASE_FILTER, since ? `ModificationTimestamp gt ${since}` : INITIAL_STATUS_FILTER].filter(Boolean);
  const qs = new URLSearchParams({
    $filter: parts.map((p) => `(${p})`).join(" and "),
    $orderby: "ModificationTimestamp asc",
    $top: String(PAGE),
  });
  if (EXPAND) qs.set("$expand", EXPAND);

  let url: string | undefined = `${BASE}/${RESOURCE}?${qs.toString()}`;
  let upserts = 0;
  let removed = 0;
  let maxModified = since ?? "";

  console.log(since ? `Incremental sync since ${since}` : "Full sync of displayable listings");

  while (url) {
    const { value, next } = await fetchPage(url);
    const ops: Parameters<typeof ListingModel.bulkWrite>[0] = [];
    for (const raw of value) {
      const mod = String(raw.ModificationTimestamp ?? "");
      if (mod > maxModified) maxModified = mod;
      const key = String(raw.ListingKey ?? raw.ListingId ?? "");
      if (!key) continue;
      const listing = mapResoProperty(raw);
      if (listing) {
        // Keep any manual "featured" flag the agent set.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { featured, ...rest } = listing;
        ops.push({ updateOne: { filter: { listingKey: key }, update: { $set: rest }, upsert: true } });
        upserts++;
      } else {
        ops.push({ deleteOne: { filter: { listingKey: key, source: "reso" } } });
        removed++;
      }
    }
    if (ops.length) await ListingModel.bulkWrite(ops, { ordered: false });
    process.stdout.write(`  …${upserts} upserted, ${removed} removed\r`);
    url = next;
    if (url) await sleep(250); // be polite to the feed
  }

  await SyncStateModel.updateOne(
    { key: STATE_KEY },
    { $set: { lastModified: maxModified || since, lastRunAt: new Date(), lastCount: upserts } },
    { upsert: true },
  );
  console.log(`\nDone: ${upserts} upserted, ${removed} removed. Checkpoint: ${maxModified || since || "none"}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
