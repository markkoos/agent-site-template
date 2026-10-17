# Notes for AI assistants working on this repo

This is a reusable real estate agent website template (Next.js App Router + MongoDB/Mongoose, TypeScript, Tailwind CSS v4). The visual design was ported from a Lovable (TanStack Start + Supabase) prototype; only the look carried over.

## Conventions
- Per-client settings live ONLY in `src/site.config.ts` (and fonts in `src/theme/fonts.ts`). Don't hardcode agent names, phones or cities in components.
- Styling: Tailwind utility classes with semantic tokens only (`bg-background`, `text-muted-foreground`, `text-accent`, `border-border/60`…), never raw colors, so theme presets keep working. Tokens and presets live in `src/app/globals.css`; a new look = a new `[data-theme]` block. Shared button/input class strings are in `src/components/ui.ts`. Custom utilities: `container-page`, `eyebrow`, `field`, `prose-editorial`.
- Remote images go through `SafeImg` (falls back to a placeholder if the URL breaks).
- Homepage blocks live in `src/components/sections.tsx` and are ordered by `site.home.sections`. New block → add a component, add its key to `HomeSection`, register it in `SECTIONS`.
- All listing reads go through `src/lib/listings/index.ts`. New data sources write into the `Listing` shape (see `types.ts`), never a separate read path.
- Every new public page: use `pageMetadata()` from `src/lib/seo.ts` (canonical + OG), add `Breadcrumbs`, add relevant JSON-LD, and add the route to `src/app/sitemap.ts`.
- Next.js 15+/16: `params` and `searchParams` are Promises — always `await` them.
- Keep pages server components; only forms, calculators, SafeImg and the mobile menu are client components.
- Routes: /properties, /properties/[slug], /home-evaluation, /areas, /blog ("Journal"), /about, /contact, /tools/mortgage-calculator. Old /listings and /home-valuation URLs permanently redirect.

## Content rules (SEO/AEO/E-E-A-T)
- Blog posts and area guides are markdown with frontmatter (`title`, `description`, `date`, `updated`, `tldr`, `faqs`, `sources`).
- Lead with a direct answer (`tldr`), then detail. FAQ answers 40–80 words, first sentence answers the question.
- Never invent testimonials, statistics, prices or market data for a real client. Cite sources for any figure. (The demo config's stats are placeholders for the fictional Ellery & Vale.)
- Fair Housing: describe places and amenities, never the people who live there or who a place is "good for" by protected class.
