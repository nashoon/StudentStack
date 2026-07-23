# StudentStack — AI tool deals for students

A curated directory of student discounts, free education tiers, and (eventually)
exclusive negotiated deals on AI tools. Revenue model: affiliate commissions.
Every deal links to the vendor's own checkout — this site never handles payments.

## Run locally

```
python -m http.server 4173 --directory .
```

Then open http://localhost:4173

## Files

- `index.html` — home page: hero + popular deals only
- `browse.html` — full catalog: compact 4-per-row grid, category filters
  (`?category=Writing`), and pricing filters (`?pricing=free`, `?pricing=trial`,
  `?pricing=discount`)
- `deal.html` — deal detail page (`?d=<slug>`): breadcrumb, big visual, and an
  AppSumo-style side card with the claim checklist. Cards everywhere link here;
  only this page's CTA links out to the vendor
- `styles.css` — styling (light + dark mode)
- `deals.js` — the deals catalog (this is the file you'll edit most)
- `app.js` — shared rendering for both pages, signup form

## Card images

Each card shows, in priority order:
1. `image:` — a usage demo (PNG/GIF) you save from the vendor's official press
   kit into `images/` — best option, use this for the tools you feature hardest
2. `screenshot: true` — a live screenshot of the tool's site (opt-in per deal;
   many sites serve screenshot services a "verify you are human" page, so only
   enable after checking it looks right)
3. otherwise — a branded logo tile (always safe)

The images currently in `images/` are each vendor's own official Open Graph /
social-share image, downloaded from their site (10 of 12 tools; Quizlet had
none usable so it shows the tile, Zotero uses its live screenshot). To upgrade
any card to an animated demo, replace the file with a GIF from that vendor's
press kit and update the `image:` path in `deals.js`.

## Before launch checklist

- [ ] **Verify every deal** in `deals.js` on the vendor's own site, set `verified: true`
- [ ] **Join affiliate programs** and swap each `url` for your affiliate link
      (check each program's terms — some prohibit coupon/deal sites; if you're
      under 18, payouts likely need a parent to sign up)
- [ ] **Connect the email form** to a real list (Buttondown / Mailchimp / ConvertKit) — see TODO in `app.js`
- [ ] **Remove the demo banner** (`.demo-banner` div in `index.html`)
- [ ] **(Optional) Add demo GIFs** — see "Card images" above; a real usage GIF
      from each vendor's press kit beats everything else for conversion
- [ ] **Pick a real name + domain** ("StudentStack" is a placeholder — check trademark/domain availability)
- [ ] **Deploy** — this is a static site, so GitHub Pages, Netlify, or Vercel are all free

## Strategy notes

1. Phase 1 (now): directory of existing deals + affiliate links. Build audience.
2. Phase 2: with real traffic numbers, cold-outreach AI companies for exclusive
   student deals and better commission terms.
3. Phase 3 (maybe): become the storefront via a merchant-of-record service
   (Paddle / Lemon Squeezy) so checkout carries your brand without you holding
   funds or payment data. Do NOT build a site-currency/wallet system — holding
   stored value makes you a regulated money-services business.
