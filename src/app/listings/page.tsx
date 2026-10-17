import { permanentRedirect } from "next/navigation";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Old URL from the first template version → /properties (keeps any filters). */
export default async function LegacyListings({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val) qs.set(k, val);
  }
  const q = qs.toString();
  permanentRedirect(`/properties${q ? `?${q}` : ""}`);
}
