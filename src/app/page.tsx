import type { Metadata } from "next";
import { HomeSections } from "@/components/sections";
import { site } from "@/site.config";

// Re-render the homepage at most hourly so featured listings stay fresh.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: site.seo.defaultTitle },
  description: site.seo.defaultDescription,
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return <HomeSections />;
}
