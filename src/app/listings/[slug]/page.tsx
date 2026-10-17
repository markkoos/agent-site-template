import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Old URL from the first template version → /properties/[slug]. */
export default async function LegacyListing({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/properties/${slug}`);
}
