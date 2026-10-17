import mongoose from "mongoose";

/** True when a MongoDB connection string is configured (otherwise the site runs in demo mode). */
export function hasDb(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse one connection across hot reloads and serverless invocations.
const g = globalThis as unknown as { _mongooseCache?: Cache };
const cache: Cache = g._mongooseCache ?? (g._mongooseCache = { conn: null, promise: null });

export async function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      // Small pool: serverless hosts open many instances, and Atlas free tier caps connections.
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
