/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the one file you edit per client.
 *  Demo content: "Ellery & Vale", a fictional boutique practice (from the
 *  Lovable design). Replace everything with the client's real details.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ThemePreset = "editorial" | "coastal" | "modern";

export type HomeSection =
  | "hero"
  | "featuredListings"
  | "pillars"
  | "valuationCta"
  | "aboutSnippet"
  | "areas"
  | "testimonials"
  | "latestPosts"
  | "faq";

export const site = {
  /** Public URL, no trailing slash. Prefer setting NEXT_PUBLIC_SITE_URL in the host. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  brand: {
    siteName: "Ellery & Vale",
    /** Small label next to the logo text. */
    logoSuffix: "Residential",
    tagline: "Homes with a point of view.",
  },

  /** Visual preset: "editorial" | "coastal" | "modern" (see globals.css). Fonts: src/theme/fonts.ts. */
  theme: "editorial" as ThemePreset,

  /** Primary contact person — used for bylines, author boxes and schema. */
  agent: {
    name: "Margaux Ellery",
    jobTitle: "Founder & REALTOR®",
    headshot: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80",
    phone: "(310) 555-0148",
    email: "hello@example.com",
    licenseLabel: "DRE #",
    licenseNumber: "00000000",
    /** Public license lookup so visitors (and AI engines) can verify credentials. */
    licenseVerifyUrl: "https://www2.dre.ca.gov/PublicASP/pplinfo.asp",
    yearsExperience: 15,
    designations: ["Certified Luxury Home Marketing Specialist (example)", "SRS (Seller Representative Specialist)"],
    languages: ["English", "French"],
    shortBio:
      "Ellery & Vale is a boutique residential practice representing architecturally significant homes across Los Angeles, the canyons, and the coast.",
    bio: [
      "Ellery & Vale is a two-person residential practice founded in 2011 by Margaux Ellery and Jonah Vale. We work with a small roster of sellers and a curated buyer network — never more than we can personally handle.",
      "We spend most of our time thinking about how a house is positioned: its story, its photography, and the small, tactile details that decide whether the right buyer walks in. When we're not on-site, we're on the phone.",
      "The number we care about most is the one we don't publish: repeat clients. Most of our work today comes from someone we sold a home to a decade ago.",
    ],
    awards: [] as string[],
  },

  /** Optional team shown on About (leave empty for a solo agent). */
  team: [
    { name: "Margaux Ellery", title: "Founder, Real Estate Agent", licenseNumber: "00000000" },
    { name: "Jonah Vale", title: "Founder, Real Estate Agent", licenseNumber: "00000000" },
  ],
  teamPhotoCaption: "Margaux Ellery & Jonah Vale — Founders",
  foundingYear: 2011,

  brokerage: {
    name: "Ellery & Vale Residential (example brokerage)",
    licenseNumber: "00000000",
    phone: "(310) 555-0148",
    address: {
      street: "100 Example Blvd, Suite 720",
      city: "West Hollywood",
      state: "CA",
      zip: "90069",
    },
  },

  /** Cities served — used in schema areaServed, the footer and search landing pages. */
  serviceAreas: ["Los Angeles", "Malibu", "Palm Springs"],

  /** Profiles for schema "sameAs" — strong E-E-A-T and entity signals. */
  social: {
    google: "",
    zillow: "",
    realtor: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  },

  officeHours: "Mon–Fri 9am–6pm",

  nav: [
    { label: "Properties", href: "/properties" },
    { label: "Home value", href: "/home-evaluation" },
    { label: "Areas", href: "/areas" },
    { label: "Journal", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  headerCta: { label: "Schedule a viewing", href: "/contact" },

  home: {
    hero: {
      eyebrow: "Est. 2011 · Los Angeles",
      headline: "Homes with a",
      headlineAccent: "point of view.",
      subhead:
        "Ellery & Vale is a boutique residential practice representing architecturally significant homes across Los Angeles, the canyons, and the coast.",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
      imageAlt: "A modern hillside home at dusk",
      /** Small overlay card on the hero image — point it at a real listing. */
      spotlight: { label: "Now representing", title: "Modern Hillside Retreat", meta: "Los Angeles · $4.25M" },
    },
    /**
     * Headline numbers under the hero. Use real, verifiable figures only
     * (the client should be able to back each one up). Demo values below.
     */
    stats: [
      { label: "Sold volume", value: "$1.4B" },
      { label: "Homes represented", value: "312" },
      { label: "Avg. days on market", value: "21" },
    ],
    pillars: [
      { title: "Discretion", text: "Off-market representation and quiet buyer introductions across our private roster." },
      { title: "Craft", text: "Positioning, brand, and photography treated with the same seriousness as the house itself." },
      { title: "Reach", text: "A curated network of buyers who understand what they're looking at." },
    ],
    /** Reorder, remove or repeat sections to restyle the homepage per client. */
    sections: [
      "hero",
      "featuredListings",
      "pillars",
      "valuationCta",
      "areas",
      "latestPosts",
      "testimonials",
      "faq",
    ] as HomeSection[],
  },

  /**
   * REAL client reviews only (copy from Google/Zillow with permission).
   * Never publish invented testimonials — it violates FTC rules and kills trust.
   * Example: { quote: "…", name: "Maria G.", context: "Sold in Malibu, 2026", source: "Google" }
   */
  testimonials: [] as { quote: string; name: string; context?: string; source?: string }[],

  /** General FAQs (homepage + About). Answer-first, 40–80 words each — ideal for AEO. */
  faqs: [
    {
      q: "What areas does Ellery & Vale cover?",
      a: "We represent homes across Los Angeles, the canyons, Malibu, and Palm Springs. If you're considering a property just outside those areas, reach out — we'll tell you honestly whether we're the right fit or refer you to someone who is.",
    },
    {
      q: "Do you handle off-market listings?",
      a: "Yes. Some sellers prefer a quiet sale introduced only to qualified buyers. It can protect privacy and reduce disruption, but it also limits exposure, so we walk through the trade-offs before recommending it.",
    },
    {
      q: "How can I get a valuation of my home?",
      a: "Request a private, agent-prepared valuation on our Home Evaluation page. We review recent comparable sales and current demand in your micro-market, and respond within one business day.",
    },
  ],

  legal: {
    /** Required by most MLSs on any page showing IDX listings — get exact wording from the MLS. */
    mlsDisclaimer:
      "Listing information is deemed reliable but not guaranteed and should be independently verified. Demo data shown — not actual listings.",
    equalHousing: true,
  },

  seo: {
    defaultTitle: "Ellery & Vale — Boutique Los Angeles Real Estate",
    defaultDescription:
      "Boutique Los Angeles real estate representing architecturally significant homes across LA, the canyons, Malibu and Palm Springs. Search properties, request a home valuation, and read market notes.",
    /** Let AI answer engines (ChatGPT, Claude, Perplexity, Gemini) crawl and cite the site. */
    allowAiCrawlers: true,
  },
};

export type SiteConfig = typeof site;
