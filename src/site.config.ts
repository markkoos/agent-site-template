/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the one file you edit per client.
 *  Everything below is placeholder demo content for a fictional agent.
 *  Replace it with the client's real details before launch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ThemePreset = "coastal" | "modern" | "luxury";

export type HomeSection =
  | "hero"
  | "featuredListings"
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
    siteName: "Jordan Rivera Homes",
    tagline: "Coastal real estate, handled with care.",
    /** Optional overrides on top of the theme preset (any CSS color). */
    primaryColor: "",
    accentColor: "",
  },

  /** Visual preset: "coastal" | "modern" | "luxury". Fonts live in src/theme/fonts.ts. */
  theme: "coastal" as ThemePreset,

  agent: {
    name: "Jordan Rivera",
    jobTitle: "REALTOR®",
    headshot: "/agent-placeholder.svg",
    phone: "(555) 010-2030",
    email: "hello@example.com",
    /** State license — most states require it on agent advertising. */
    licenseLabel: "DRE #",
    licenseNumber: "00000000",
    /** Public license lookup page so visitors (and AI engines) can verify credentials. */
    licenseVerifyUrl: "https://example.com/license-lookup",
    yearsExperience: 12,
    designations: ["ABR® (Accredited Buyer's Representative)", "SRS (Seller Representative Specialist)"],
    languages: ["English", "Spanish"],
    shortBio:
      "Jordan has helped more than 200 families buy and sell along the coast, with a focus on clear communication and data-backed pricing.",
    bio: [
      "I've lived in Harbor Point for over twenty years and have spent the last twelve helping neighbors buy, sell, and invest here. Before real estate I worked in construction management, which means I notice the things inspections flag before they become negotiation problems.",
      "My approach is simple: honest pricing backed by recent comparable sales, a marketing plan you can see in writing, and weekly updates whether there's news or not.",
    ],
    awards: ["Top 5% of agents, Harbor Point Association of REALTORS® (example)"],
  },

  brokerage: {
    name: "Example Realty Group",
    licenseNumber: "00000000",
    phone: "(555) 010-9000",
    address: {
      street: "100 Main Street, Suite 200",
      city: "Harbor Point",
      state: "CA",
      zip: "90000",
    },
  },

  /** Cities/neighborhoods served — used in schema areaServed and the footer. */
  serviceAreas: ["Harbor Point", "Cedar Ridge", "Bayview Heights"],

  /** Profiles for schema "sameAs" — powerful for E-E-A-T and entity recognition. */
  social: {
    google: "", // Google Business Profile URL
    zillow: "",
    realtor: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  },

  officeHours: "Mon–Sat 9am–6pm, Sun by appointment",

  nav: [
    { label: "Search Homes", href: "/listings" },
    { label: "Home Value", href: "/home-valuation" },
    { label: "Areas", href: "/areas" },
    { label: "Blog", href: "/blog" },
    { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  home: {
    hero: {
      headline: "Find your place on the coast.",
      subhead: "Search every home for sale, see what yours is worth, and get local advice without the pressure.",
    },
    /** Reorder, remove or repeat sections to restyle the homepage per client. */
    sections: [
      "hero",
      "featuredListings",
      "valuationCta",
      "aboutSnippet",
      "areas",
      "testimonials",
      "latestPosts",
      "faq",
    ] as HomeSection[],
  },

  /**
   * REAL client reviews only (copy from Google/Zillow with permission).
   * Never publish invented testimonials — it violates FTC rules and kills trust.
   * Example: { quote: "…", name: "Maria G.", context: "Sold in Cedar Ridge, 2026", source: "Google" }
   */
  testimonials: [] as { quote: string; name: string; context?: string; source?: string }[],

  /** General FAQs (homepage + About). Answer-first, 40–80 words each — ideal for AEO. */
  faqs: [
    {
      q: "How much does it cost to work with a buyer's agent?",
      a: "Buyer-agent compensation is negotiable and is agreed in writing before you tour homes. Sometimes the seller offers to cover part or all of it; sometimes the buyer pays. I'll walk you through the options and put our agreement in plain language before we start.",
    },
    {
      q: "How long does it take to sell a home here?",
      a: "It depends on price, condition and season. Well-priced, well-prepared homes often go under contract within a few weeks, while overpriced homes tend to sit. I'll show you current days-on-market for homes like yours in a free pricing review.",
    },
    {
      q: "Is the online home value estimate accurate?",
      a: "Automated estimates are a starting point based on public records and nearby sales. They can't see your upgrades or condition. For a reliable number, request a free comparative market analysis (CMA) and I'll prepare one personally.",
    },
  ],

  legal: {
    /** Required by most MLSs on any page showing IDX listings — get exact wording from the MLS. */
    mlsDisclaimer:
      "Listing information is deemed reliable but not guaranteed and should be independently verified. Listings displayed may be held by brokerages other than the site owner. Demo data shown — not actual listings.",
    equalHousing: true,
  },

  seo: {
    defaultTitle: "Jordan Rivera | Harbor Point Real Estate Agent",
    defaultDescription:
      "Search homes for sale in Harbor Point, Cedar Ridge and Bayview Heights, get a free home value estimate, and get local real estate advice from Jordan Rivera, REALTOR®.",
    /** Let AI answer engines (ChatGPT, Claude, Perplexity, Gemini) crawl and cite the site. */
    allowAiCrawlers: true,
  },
};

export type SiteConfig = typeof site;
