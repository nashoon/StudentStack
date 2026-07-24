# Connecting studentstack.co to this site

The site is hosted on **GitHub Pages** from this repo (`nashoon/StudentStack`, `main` branch).
Buying a domain doesn't move the site — it just points a friendlier address at the same
GitHub Pages hosting. Claude keeps editing + pushing exactly as before; every push still
deploys to both `studentstack.co` and `nashoon.github.io/StudentStack/`.

---

## Step 1 — Buy the domain (you)

Register **studentstack.co** at any registrar (Porkbun, Cloudflare, or Namecheap are all fine).
Decline every upsell — hosting, email, SSL, WHOIS-privacy-upsell. GitHub provides hosting + HTTPS free.

## Step 2 — Add these DNS records at your registrar (you)

In the registrar's **DNS settings** for studentstack.co, add:

**Apex (root) — four A records.** Host/Name = `@` (or blank / "studentstack.co"):

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**Apex — four AAAA records (IPv6, optional but recommended).** Host = `@`:

| Type | Host | Value |
|------|------|-------|
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

**www subdomain — one CNAME** (so www.studentstack.co works and redirects to the apex):

| Type | Host | Value |
|------|------|-------|
| CNAME | www | nashoon.github.io. |

> If the registrar already created placeholder A records or a "parking" record, delete those first.
> DNS changes usually take 10–30 min (can be up to a few hours) to propagate.

## Step 3 — Tell Claude (you → me)

Message: **"bought it, DNS added"** (and which registrar). Then I do Step 4 in one push.

## Step 4 — Activate + migrate (me, ~2 min + a short wait)

1. Add a `CNAME` file to the repo containing `studentstack.co` → this sets the GitHub Pages custom domain.
2. Update the absolute references that assume the `/StudentStack/` sub-path (they change to the root domain):
   - `404.html` — `/StudentStack/…` → `/…`
   - `<link rel="canonical">` and `og:url` / `og:image` / `twitter:image` in `index.html`, `browse.html`, `deal.html` — `nashoon.github.io/StudentStack/…` → `studentstack.co/…`
   - `sitemap.xml` / `robots.txt` — swap the base URL
3. Push. GitHub verifies the domain, then auto-issues a free HTTPS certificate (~15 min).
4. In the repo's **Settings → Pages**, "Enforce HTTPS" gets ticked once the cert is ready (I'll confirm).

## Step 5 — Verify (me)

- `https://studentstack.co` loads the site
- `http://` and `www.` both redirect to `https://studentstack.co`
- Deal pages, filters, and the Tool Finder all work at the new address

---

### Notes
- **Everyday links don't change** — `browse.html`, `styles.css?v=…`, deal links are all relative and work at any address.
- **The old URL keeps working** — `nashoon.github.io/StudentStack/` redirects to the custom domain after activation.
- **No downtime if done in this order** — the `CNAME` file is only committed *after* DNS points at GitHub, so the live site never redirects into a dead domain.
