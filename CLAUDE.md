# Notes for AI assistants working on this repo

This is a reusable real estate agent website template (Next.js App Router + MongoDB/Mongoose, TypeScript, plain CSS).

## Conventions
- Per-client settings live ONLY in `src/site.config.ts` (and fonts in `src/theme/fonts.ts`). Don't hardcode agent names, phones or cities in components.
- Styling uses CSS custom properties in `src/app/globals.css`. Components must use tokens (`var(--primary)`, etc.), never raw colors, so theme presets keep working. New looks = new `[data-theme]` block.
- Homepage blocks live in `src/components/sections.tsx` and are ordered by `site.home.sections`. New block → add a component, add its key to `HomeSection`, register it in `SECTIONS`.
- All listing reads go through `src/lib/listings/index.ts`. New data sources write into the `Listing` shape (see `types.ts`), never a separate read path.
- Every new public page: use `pageMetadata()` from `src/lib/seo.ts` (canonical + OG), add `Breadcrumbs`, add relevant JSON-LD, and add the route to `src/app/sitemap.ts`.
- Next.js 15+/16: `params` and `searchParams` are Promises — always `await` them.
- Keep pages server components; only forms/calculators are client components.

## Content rules (SEO/AEO/E-E-A-T)
- Blog posts and area guides are markdown with frontmatter (`title`, `description`, `date`, `updated`, `tldr`, `faqs`, `sources`).
- Lead with a direct answer (`tldr`), then detail. FAQ answers 40–80 words, first sentence answers the question.
- Never invent testimonials, statistics, prices or market data. Cite sources for any figure.
- Fair Housing: describe places and amenities, never the people who live there or who a place is "good for" by protected class.
