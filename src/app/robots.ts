import type { MetadataRoute } from "next";
import { site } from "@/site.config";

/**
 * AI crawlers listed explicitly so the choice is visible and easy to flip per client.
 * Search-type bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot) are what get
 * a site cited in AI answers — blocking them removes the site from those answers.
 */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") return { rules: { userAgent: "*", disallow: "/" } };

  const ai = site.seo.allowAiCrawlers
    ? [{ userAgent: AI_BOTS, allow: "/", disallow: ["/api/"] }]
    : [{ userAgent: AI_BOTS, disallow: "/" }];

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }, ...ai],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
