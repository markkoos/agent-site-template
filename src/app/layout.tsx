import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
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
  robots: process.env.NEXT_PUBLIC_NOINDEX === "true" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  // Optional per-client color overrides on top of the theme preset.
  const overrides = {
    ...(site.brand.primaryColor ? { "--primary": site.brand.primaryColor } : {}),
    ...(site.brand.accentColor ? { "--accent": site.brand.accentColor } : {}),
  } as CSSProperties;

  return (
    <html lang="en" data-theme={site.theme} className={`${headingFont.variable} ${bodyFont.variable}`} style={overrides}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* Site-wide entity graph: agent, brokerage, website */}
        <JsonLd data={[agentSchema(), brokerageSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
