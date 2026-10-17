import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { agentSchema, brokerageSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/site.config";
import { bodyFont, headingFont } from "@/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.defaultTitle, template: `%s | ${site.brand.siteName}` },
  description: site.seo.defaultDescription,
  applicationName: site.brand.siteName,
  authors: [{ name: site.agent.name, url: `${site.url}/about` }],
  creator: site.agent.name,
  openGraph: { type: "website", siteName: site.brand.siteName, locale: "en_US" },
  formatDetection: { telephone: true },
  // Demo/staging sites: set NEXT_PUBLIC_NOINDEX=true to keep them out of search.
  robots:
    process.env.NEXT_PUBLIC_NOINDEX === "true"
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={site.theme} className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Site-wide entity graph: agent, brokerage, website */}
        <JsonLd data={[agentSchema(), brokerageSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
