/**
 * SEO + structured data helpers.
 * Structured data (JSON-LD) is what lets Google, Bing and AI answer engines
 * understand WHO the agent is, WHERE they work, and WHAT each page is about.
 */
import type { Metadata } from "next";
import { site } from "@/site.config";
import type { Area, Faq, Post } from "./content";
import { fullAddress } from "./format";
import type { Listing } from "./listings/types";

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const AGENT_ID = `${site.url}/#agent`;
export const BROKERAGE_ID = `${site.url}/#brokerage`;
export const WEBSITE_ID = `${site.url}/#website`;

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: absoluteUrl(opts.path) },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: absoluteUrl(opts.path),
      siteName: site.brand.siteName,
      type: opts.type ?? "website",
      ...(opts.image ? { images: [{ url: opts.image }] } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}

const sameAs = () => Object.values(site.social).filter(Boolean);

/** RealEstateAgent entity — the core E-E-A-T signal, rendered on every page. */
export function agentSchema() {
  const b = site.brokerage;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": AGENT_ID,
    name: site.agent.name,
    jobTitle: site.agent.jobTitle,
    description: site.agent.shortBio,
    url: site.url,
    image: absoluteUrl(site.agent.headshot),
    telephone: site.agent.phone,
    email: site.agent.email,
    knowsLanguage: site.agent.languages,
    areaServed: site.serviceAreas.map((name) => ({ "@type": "City", name })),
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.state,
      postalCode: b.address.zip,
      addressCountry: "US",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: `Real estate license ${site.agent.licenseLabel}${site.agent.licenseNumber}`,
        url: site.agent.licenseVerifyUrl || undefined,
      },
      ...site.agent.designations.map((d) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: d,
      })),
    ],
    award: site.agent.awards,
    worksFor: { "@id": BROKERAGE_ID },
    sameAs: sameAs(),
  };
}

export function brokerageSchema() {
  const b = site.brokerage;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": BROKERAGE_ID,
    name: b.name,
    telephone: b.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.state,
      postalCode: b.address.zip,
      addressCountry: "US",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.brand.siteName,
    publisher: { "@id": AGENT_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/listings?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

const residenceType = (t: string) =>
  /condo|apartment/i.test(t) ? "Apartment" : /town/i.test(t) ? "House" : /single|house|residential/i.test(t) ? "SingleFamilyResidence" : "Accommodation";

export function listingSchema(l: Listing, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: fullAddress(l),
    url: absoluteUrl(path),
    description: l.description.slice(0, 500),
    datePosted: l.listedAt,
    dateModified: l.updatedAt,
    image: l.photos.slice(0, 5),
    offers: {
      "@type": "Offer",
      price: l.price,
      priceCurrency: "USD",
      availability: l.status === "Sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    mainEntity: {
      "@type": residenceType(l.propertyType),
      name: fullAddress(l),
      numberOfBedrooms: l.beds,
      numberOfBathroomsTotal: l.baths,
      ...(l.sqft ? { floorSize: { "@type": "QuantitativeValue", value: l.sqft, unitCode: "FTK" } } : {}),
      ...(l.yearBuilt ? { yearBuilt: l.yearBuilt } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: l.street,
        addressLocality: l.city,
        addressRegion: l.state,
        postalCode: l.zip,
        addressCountry: "US",
      },
      ...(l.lat && l.lng ? { geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lng } } : {}),
    },
  };
}

export function postSchema(p: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    url: absoluteUrl(`/blog/${p.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`),
    author: { "@id": AGENT_ID, "@type": "Person", name: site.agent.name, url: absoluteUrl("/about") },
    publisher: { "@id": AGENT_ID },
    keywords: p.tags.join(", "),
    ...(p.sources.length ? { citation: p.sources.map((s) => s.url) } : {}),
  };
}

export function areaSchema(a: Area) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: a.name,
    description: a.description,
    url: absoluteUrl(`/areas/${a.slug}`),
  };
}

/** ProfilePage for /about — Google's recommended markup for a person's profile. */
export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.agent.name,
      jobTitle: site.agent.jobTitle,
      image: absoluteUrl(site.agent.headshot),
      worksFor: { "@id": BROKERAGE_ID },
      knowsLanguage: site.agent.languages,
      sameAs: sameAs(),
    },
  };
}
