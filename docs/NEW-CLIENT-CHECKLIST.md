# New client checklist

A repeatable flow for spinning up a client site. Target: first preview the same day.

## 1. Intake (send as a form before kickoff)

- [ ] Full name, title (REALTOR®?), license number + state lookup URL
- [ ] Brokerage name, address, phone, broker license number
- [ ] Headshot (high-res), logo, brand colors, sites they like the look of
- [ ] Service areas (cities/neighborhoods) — ranked by priority
- [ ] Years in business, designations, languages, awards
- [ ] Bio in their own words (or a 20-min call you record and turn into copy)
- [ ] Links: Google Business Profile, Zillow, Realtor.com, Instagram, Facebook, LinkedIn, YouTube
- [ ] 3–10 real reviews they're OK publishing (with source)
- [ ] Their MLS name, and whether their broker is in the IDX program
- [ ] Domain: do they own one? Registrar login?
- [ ] Where leads should go (email, CRM, phone/text)

## 2. Build

- [ ] Copy the template into a new repo (`client-lastname-site`)
- [ ] Edit `src/site.config.ts` (every field) and pick `theme`
- [ ] Swap fonts in `src/theme/fonts.ts`; adjust tokens in `globals.css` if needed
- [ ] Replace `public/agent-placeholder.svg` with the headshot (update `agent.headshot`)
- [ ] Update `src/app/icon.svg` colors (and `opengraph-image.tsx` gradient)
- [ ] One `content/areas/<slug>.md` per priority area — first-hand details, FAQs
- [ ] 2–3 starter blog posts answering questions their clients actually ask
- [ ] Delete the sample posts/areas and `data/demo-listings.json` entries
- [ ] Listings: agent's own listings via `npm run seed -- file.json`, or start the MLS license process
- [ ] Paste the MLS's exact disclaimer into `legal.mlsDisclaimer`
- [ ] Have the client (and their broker) review the privacy page and consent wording

## 3. Launch

- [ ] Atlas: new project + free cluster for this client; DB user; network access
- [ ] Netlify: import repo, env vars, custom domain, HTTPS
- [ ] Submit a test lead from every form (contact, showing, valuation) and confirm delivery
- [ ] Google Search Console + Bing Webmaster Tools: verify, submit sitemap
- [ ] Update Google Business Profile website link; keep NAP identical everywhere
- [ ] Rich Results Test on home, a listing, a blog post, an area page
- [ ] Lighthouse mobile check

## 4. Monthly (the retainer)

- [ ] 1–2 new posts or area-guide updates (refresh "updated" dates only when content changes)
- [ ] Add new reviews
- [ ] Check Search Console for errors and top queries → write content for them
- [ ] Dependency updates (`npm outdated`), check MLS sync logs
