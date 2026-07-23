# StudentStack — changelog

## 2026-07-23 → overnight session

A big build + self-refinement night. Newest first.

### Self-refinement rounds (each its own commit)
Live search · screenshot QA (denylisted bot-wall captures) · +26 free deals ·
enrichment layer · mobile hamburger nav · richer footer nav · related deals ·
accessibility (skip-link, focus rings, `aria-current`) · home category row ·
light-mode verified · Tool Finder closes on Escape/click-outside · branded
404 page · favicon preconnect · browse sort control (Featured/Top rated/A–Z) ·
cleaner signup message.

### Features
- **Tool Finder chatbot** (`advisor.js`) — a floating "🎯 Find your tool" widget.
  Describe your problem in plain words; it scores all deals against the catalog
  + a curated intent lexicon and recommends the best matches with links. Fully
  client-side (no API key), so it runs on static Pages.
- **Live search** on the browse page — filter the whole catalog as you type.
- **Related deals** — each deal page shows more tools in the same category.
- **Trial-length pills** — deals with a free trial show its length (e.g. "30-day
  Pro trial") on the card and deal page.

### Catalog
- Grew from **12 → 53 deals**, all fact-checked + source-verified by a
  research/verify agent pass. Every category now has **7+ free deals**
  (Coding, Productivity, Research, Writing, Studying, Design).
- Each deal has: a "What you get" facts list, a "Best for" line, 3 "How students
  use it" scenarios, and — only where a real published study exists — a cited
  "Research-backed impact" stat (Copilot 55.8%, ChatGPT ~40%, retrieval-practice
  studies). No invented numbers.

### Previews
- All screenshots captured as **static 2× (1280px) local images** — no live
  screenshot service, so no "generating preview" state.
- QA'd every shot via contact sheets; **denylisted bot-wall/error captures**
  (Cloudflare/security/404 pages). Those deals fall back to their official
  og-image hero or a clean branded logo tile.

### UI / trust
- Home page: value-prop subhead, trust points (official links only / never see
  your payment / hand-checked), and a **live stats strip** (counts computed from
  the catalog so they never go stale).
- **Mobile hamburger nav** (the old nav overflowed on phones).
- **Richer footer** with Browse + Category navigation.
- Belt updated to "Backed by students at …" (Johns Hopkins, Cornell added).

### SEO / social
- Favicon, Open Graph + Twitter cards with a generated 1200×630 share image,
  per-page canonical + meta descriptions, `robots.txt`, and a `sitemap.xml`.

### Docs
- `docs/outreach.md` — cold-email playbook (template + rules).
- `docs/outreach-contacts.md` — verified contact emails for the small
  cold-email-target companies (and which already run affiliate programs).

### Still owed before launch
- Verify each offer on the vendor's own site and flip `verified: true`
  (the "Demo data" banner + "not yet verified" notes come off then).
- Replace each `url` with your affiliate link once you've joined programs.
- Wire the email signup form to a real list provider.
- Point `studentstack.co` at the site once you own it.
