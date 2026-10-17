# Agent Site — real estate website template

A config-driven website template for real estate agents, built to rank in search (SEO), be quoted by answer engines and AI assistants (AEO/GEO), and show the credentials Google looks for (E-E-A-T). One file — `src/site.config.ts` — turns it into a new client's site.

**Stack:** Next.js (App Router, React, Node) + MongoDB/Mongoose. That's MERN with Next.js standing in for Express + a client-only React app, because search engines and AI crawlers need server-rendered HTML — a plain React SPA ships an empty page to them.

---

## Quick start (5 minutes, no database needed)

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Without `MONGODB_URI` the site runs in **demo mode**: listings come from `data/demo-listings.json` and form submissions are logged to the console. Commit `package-lock.json` after the first install.

### Add the database

1. Create a free **MongoDB Atlas** cluster (Free / M0 tier) → Database Access → add a user → Network Access → allow `0.0.0.0/0` (serverless hosts don't have fixed IPs).
2. Put the connection string in `.env.local` as `MONGODB_URI`.
3. `npm run seed` — loads the demo listings (or `npm run seed -- my-listings.json` for real ones).

Leads (contact, showing requests, valuations) are stored in the `leads` collection. Set `LEAD_WEBHOOK_URL` to also push each lead to Zapier/Make/n8n, a Slack channel, or a CRM.

---

## What's included

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Section order set in config (`home.sections`) |
| Property search | `/listings` | Server-rendered filters (city, price, beds, baths, type, status, sort), pagination, works without JS |
| Listing detail | `/listings/[slug]` | Gallery, facts, payment estimate, showing request, listing attribution, MLS disclaimer |
| Home valuation | `/home-valuation` | 3-step lead form; instant AVM estimate when `RENTCAST_API_KEY` is set |
| Mortgage calculator | `/tools/mortgage-calculator` | P&I + tax + insurance + HOA |
| Area guides | `/areas`, `/areas/[slug]` | Markdown in `content/areas`, with live listings for that city |
| Blog | `/blog`, `/blog/[slug]` | Markdown in `content/blog` with TL;DR, FAQs, sources, author box |
| About / Contact / Privacy | `/about`, `/contact`, `/privacy` | Credentials, license verification link, NAP |
| JSON search API | `/api/listings` | Same filters, for a map view or widgets |

### Built-in search & AI optimization

- **SEO:** server rendering, per-page titles/descriptions/canonicals, Open Graph image, `sitemap.xml` (incl. listings, areas, posts), `robots.txt`, clean listing URLs (`/listings/412-seabreeze-lane-harbor-point-ca-90000-demo1001`), noindex on filter combinations and sold listings to save crawl budget, fast pages (client JS only for forms, the calculator and the mobile menu).
- **AEO (answer engines):** answer-first "Short answer" summaries, question-style FAQ blocks with `FAQPage` schema, tables for scannable facts.
- **GEO (generative engines):** explicit AI-crawler rules in `robots.txt` (toggle with `seo.allowAiCrawlers`), `/llms.txt` site summary, a consistent entity graph (`RealEstateAgent` → `Organization` → `WebSite`) so models can identify and cite the agent.
- **E-E-A-T:** author byline + bio box on every article, license number with a verification link, designations, years of experience, `ProfilePage` schema on About, `sameAs` links to Google Business Profile / Zillow / LinkedIn, published & updated dates, source lists, consistent NAP in the footer.

The template gives you the technical foundation. What actually earns rankings and AI citations is **specific, first-hand local content** in the area guides and blog — that's the part to work on with each client.

---

## Customizing for a client

See `docs/NEW-CLIENT-CHECKLIST.md`. In short:

1. `src/site.config.ts` — agent, brokerage, license, areas, socials, FAQs, homepage section order, theme preset.
2. `src/theme/fonts.ts` — swap the two Google Fonts.
3. `src/app/globals.css` — add a new `[data-theme="..."]` block for a fully custom look.
4. `public/` — headshot, logo. `src/app/icon.svg` — favicon.
5. `content/areas/*.md` and `content/blog/*.md` — real local content.

---

## Listing data (property search)

Every listing source writes into the same MongoDB `listings` collection, so pages never change:

| Option | Cost | SEO value | Effort |
|---|---|---|---|
| **A. Agent's own listings only** — enter them as JSON and `npm run seed -- file.json` | Free | Good (pages on the agent's domain) | Low — best place to start |
| **B. Full MLS via RESO Web API** — `npm run sync:reso` + the GitHub Actions schedule | MLS/vendor fees vary by MLS | Best: thousands of indexable pages | Medium; requires an MLS data license |
| **C. Third-party IDX widget/iframe** | Monthly subscription | Low — listing pages usually live on the vendor's domain | Lowest |

**About option B:** you can't legally scrape Zillow/Realtor.com or display MLS data without a license. The agent's broker must participate in the MLS's IDX program, and you (as the tech vendor) sign the MLS's data license agreement. Ask the client's MLS for its "IDX data feed / Web API" page — many use MLS Grid, Bridge or a similar RESO feed, and fees and refresh rules differ by MLS. Notes:

- Put the MLS's exact disclaimer text in `legal.mlsDisclaimer` and keep the "Listing courtesy of" attribution.
- Some feeds (e.g. MLS Grid) don't allow hotlinking photos; you'd copy media to your own storage (Cloudflare R2 has a free tier) and store those URLs.
- Set `ENABLE_MLS_SYNC=true` under repo Settings → Variables and add the secrets to turn on the scheduled sync.
- 512 MB on Atlas free tier holds tens of thousands of listings as long as you store photo URLs, not images.

## Home valuation

The form always captures the lead and promises a personal CMA (the most valuable thing for the agent). With `RENTCAST_API_KEY` set it also shows an instant estimate from RentCast's AVM. RentCast's free developer tier only covers a small number of calls per month, so results are cached per address for 30 days; a busy site needs a paid plan or another AVM provider (swap `fetchEstimate` in `src/app/api/valuation/route.ts`).

---

## Hosting

The site is a standard Next.js app with a MongoDB connection, so it runs on any Node host.

| Host | Free tier fits a client site? | Notes |
|---|---|---|
| **Netlify** (recommended free start) | Yes — commercial use allowed | Free plan is credit-based (300 credits/mo); sites pause if credits run out. Personal plan ~$9/mo for more headroom. |
| **Vercel** | No — Hobby is non-commercial only | Best Next.js experience. Use Hobby for your own portfolio/demo; client sites need Pro ($20/mo). |
| **Cloudflare Workers/Pages** | Static yes; this app needs adjustments | Free Workers: 100k requests/day, 10 ms CPU per request. Next.js runs via the OpenNext adapter, larger apps often need Workers Paid ($5/mo), and Mongoose doesn't fit the Workers runtime well — you'd swap to a Data API/HTTP driver. |
| **Render** | Not for lead-gen sites | Free web services sleep after 15 min idle and take ~1 min to wake. Starter instance ~$7/mo. |
| **MongoDB Atlas** | Yes | Free cluster: 512 MB storage, ~100 ops/sec. One free cluster per project → one project per client. |
| **GitHub Actions** | Yes | Runs the MLS sync on a schedule. |

**Business tip:** bill clients a monthly hosting & maintenance fee (domain, hosting, backups, content updates). That covers a paid tier the moment a site outgrows free limits, and it's recurring revenue for you.

### Deploy to Netlify

1. Push the repo to GitHub.
2. Netlify → Add new site → Import from Git. Next.js is auto-detected.
3. Add env vars: `NEXT_PUBLIC_SITE_URL`, `MONGODB_URI`, optional `LEAD_WEBHOOK_URL`, `RENTCAST_API_KEY`.
4. Add the client's custom domain (free SSL).

### After launch

- Verify the domain in **Google Search Console** and **Bing Webmaster Tools** (Bing feeds several AI assistants); submit `/sitemap.xml`.
- Make sure the client's **Google Business Profile** links to the site and uses the exact same name/address/phone.
- Test structured data with Google's Rich Results Test and the Schema.org validator.
- Run Lighthouse on mobile; aim for 90+.

---

## Project structure

```
src/site.config.ts       ← per-client settings
src/theme/fonts.ts       ← per-client fonts
src/app/                 ← pages, API routes, sitemap/robots/llms.txt
src/components/          ← UI (sections.tsx = homepage blocks)
src/lib/listings/        ← listing search + RESO mapping
src/lib/seo.ts           ← metadata + JSON-LD builders
src/lib/content.ts       ← markdown loader
content/blog, content/areas
data/demo-listings.json
scripts/seed.ts, scripts/sync-reso.ts
```

## Compliance reminders (not legal advice)

Have the client confirm with their broker: license number display rules, brokerage name prominence, MLS/IDX display rules and disclaimer text, Equal Housing logo/text, Fair Housing-compliant area descriptions (describe amenities, not who lives there), TCPA consent wording on forms, and the privacy policy. Only publish real, permissioned testimonials.
