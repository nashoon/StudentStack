// Shared rendering for StudentStack.
// index.html  — popular deals grid + email signup
// browse.html — full catalog, compact 4-per-row grid, category + pricing filters
// deal.html   — deal detail page (?d=<slug>)

const PRICING_LABELS = {
  free: "Free",
  freemium: "Free tier",
  trial: "Free trial",
  discount: "Student discount",
};

// Ratings with fewer than this many reviews don't show a score —
// a 5-star average from 3 reviews is noise, not signal.
const MIN_REVIEWS = 20;

const MONOGRAM_COLORS = ["#4f46e5", "#059669", "#d97706", "#dc2626", "#0891b2", "#7c3aed"];

function dealSlug(deal) {
  return deal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Merge the editorial layer (enrich.js) into the catalog by slug.
if (typeof ENRICH !== "undefined") {
  for (const d of DEALS) Object.assign(d, ENRICH[dealSlug(d)] || {});
}

// Mobile nav hamburger toggle (runs on every page).
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

function brandColor(name) {
  const hash = [...name].reduce((h, ch) => h + ch.charCodeAt(0), 0);
  return MONOGRAM_COLORS[hash % MONOGRAM_COLORS.length];
}

function faviconUrl(deal) {
  return `https://www.google.com/s2/favicons?domain=${new URL(deal.url).hostname}&sz=128`;
}

// ---------- card pieces ----------

function buildLogo(deal) {
  const img = document.createElement("img");
  img.className = "deal-logo";
  img.src = faviconUrl(deal);
  img.alt = "";
  img.addEventListener("error", () => img.replaceWith(buildMonogram(deal.name)));
  return img;
}

function buildMonogram(name) {
  const tile = document.createElement("div");
  tile.className = "deal-logo deal-monogram";
  tile.textContent = name[0].toUpperCase();
  tile.style.background = brandColor(name);
  return tile;
}

// Branded logo tile — the default card visual. Safe and consistent:
// screenshot services get served bot-challenge pages by many sites,
// so live screenshots are opt-in per deal (screenshot: true).
function buildTile(deal) {
  const tile = document.createElement("div");
  tile.className = "deal-tile";
  const c = brandColor(deal.name);
  tile.style.background = `linear-gradient(135deg, ${c}1f, ${c}52)`;
  const icon = document.createElement("img");
  icon.src = faviconUrl(deal);
  icon.alt = "";
  icon.addEventListener("error", () => icon.remove());
  tile.append(icon);
  return tile;
}

// Screenshots are pre-captured into images/shots/ at build time (see
// shots-cache.js), so the gallery uses local files only — no live
// screenshot service, so no low-res "generating…" placeholder ever.
function cachedShot(url) {
  return (typeof SHOT_CACHE !== "undefined" && url && SHOT_CACHE[url]) || null;
}

function buildImg(deal, src, alt) {
  const img = document.createElement("img");
  img.className = "deal-shot";
  img.loading = "lazy";
  img.alt = alt || `${deal.name} preview`;
  img.src = src;
  img.addEventListener("error", () => img.replaceWith(buildTile(deal)));
  return img;
}

// Every gallery source a deal can offer, in priority order, as local
// image src strings (deduped). Empty ⇒ fall back to the branded tile.
function visualSources(deal) {
  const out = [];
  if (deal.image) out.push(deal.image);
  for (const g of deal.gallery || []) out.push(g);
  if (deal.screenshot && cachedShot(deal.url)) out.push(cachedShot(deal.url));
  for (const u of deal.shots || []) { const s = cachedShot(u); if (s) out.push(s); }
  const seen = new Set();
  return out.filter((s) => s && !seen.has(s) && seen.add(s));
}

// Card visual: hero image → cached screenshot → branded tile.
function buildVisual(deal) {
  const src = visualSources(deal)[0];
  return src ? buildImg(deal, src, `${deal.name} preview`) : buildTile(deal);
}

function formatCount(n) {
  return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
}

// Rating row. Scores from few reviews are hidden (see MIN_REVIEWS);
// the detail page says why instead of showing nothing.
function buildRating(deal, { detail = false } = {}) {
  const r = deal.rating;
  if (!r) return null;
  if (r.count < MIN_REVIEWS) {
    if (!detail) return null;
    const few = document.createElement("p");
    few.className = "deal-rating deal-rating-few";
    few.textContent = `Only ${r.count} reviews on ${r.source} — too few for a fair score`;
    return few;
  }
  const wrap = document.createElement(detail ? "p" : "div");
  wrap.className = "deal-rating";
  const star = document.createElement("span");
  star.className = "rating-star";
  star.textContent = "★";
  const score = document.createElement("strong");
  score.textContent = r.score.toFixed(1);
  const src = document.createElement("a");
  src.href = r.url;
  src.target = "_blank";
  src.rel = "noopener";
  src.className = "rating-source";
  src.textContent = detail
    ? `${r.count.toLocaleString()} reviews on ${r.source}`
    : `${formatCount(r.count)} · ${r.source}`;
  wrap.append(star, score, src);
  return wrap;
}

function buildCard(deal, { compact = false } = {}) {
  const card = document.createElement("article");
  card.className = "deal-card" + (compact ? " compact-card" : "");

  const top = document.createElement("div");
  top.className = "deal-top";
  const identity = document.createElement("div");
  identity.className = "deal-identity";
  identity.append(buildLogo(deal));
  const name = document.createElement("h3");
  name.className = "deal-name";
  name.textContent = deal.name;
  identity.append(name);
  top.append(identity);
  if (!compact) {
    const cat = document.createElement("span");
    cat.className = "deal-category";
    cat.textContent = deal.category;
    top.append(cat);
  }

  const badges = document.createElement("div");
  badges.className = "deal-badges";
  const badge = document.createElement("span");
  badge.className = "deal-badge";
  badge.textContent = deal.deal;
  badges.append(badge);
  if (compact && PRICING_LABELS[deal.pricing]) {
    const tag = document.createElement("span");
    tag.className = "pricing-tag";
    tag.textContent = PRICING_LABELS[deal.pricing];
    badges.append(tag);
  }
  if (deal.trialLength) {
    const tp = document.createElement("span");
    tp.className = "trial-pill";
    tp.textContent = deal.trialLength;
    badges.append(tp);
  }

  const price = document.createElement("p");
  price.className = "deal-price";
  price.textContent = deal.price;

  const desc = document.createElement("p");
  desc.className = "deal-desc";
  desc.textContent = deal.description;

  // cards link to our own deal page; only the deal page links out to the vendor
  const cta = document.createElement("a");
  cta.className = "btn btn-primary deal-cta";
  cta.textContent = compact ? "View deal →" : "View this deal →";
  cta.href = `deal.html?d=${dealSlug(deal)}`;

  card.append(top, badges, buildVisual(deal), price, desc);
  const rating = buildRating(deal);
  if (rating) card.append(rating);
  card.append(cta);
  return card;
}

// ---------- home page: popular deals ----------

const popularGrid = document.getElementById("popular-grid");
if (popularGrid) {
  for (const deal of DEALS.filter((d) => d.popular)) {
    popularGrid.appendChild(buildCard(deal));
  }
}

// Home-page stats strip — computed live so the numbers can't go stale.
const statsRow = document.getElementById("stats-row");
if (statsRow) {
  const free = DEALS.filter((d) => d.pricing === "free" || d.pricing === "freemium").length;
  const cats = new Set(DEALS.map((d) => d.category)).size;
  const stats = [
    [String(DEALS.length), "AI tools curated"],
    [String(free), "free for students"],
    [String(cats), "categories"],
    ["100%", "links to official sites"],
  ];
  for (const [n, label] of stats) {
    const tile = document.createElement("div");
    tile.className = "stat";
    const num = document.createElement("div");
    num.className = "stat-num";
    num.textContent = n;
    const lab = document.createElement("div");
    lab.className = "stat-label";
    lab.textContent = label;
    tile.append(num, lab);
    statsRow.append(tile);
  }
}

// ---------- browse page: full catalog with filters ----------

const browseGrid = document.getElementById("browse-grid");
if (browseGrid) {
  const headingEl = document.getElementById("browse-heading");
  const catFiltersEl = document.getElementById("category-filters");
  const priceFiltersEl = document.getElementById("pricing-filters");
  const emptyEl = document.getElementById("deals-empty");
  const searchEl = document.getElementById("browse-search");
  let searchTerm = "";
  if (searchEl) searchEl.placeholder = `Search ${DEALS.length} tools…`;
  const sortEl = document.getElementById("browse-sort");
  let sortKey = "featured";

  const categories = ["All", ...new Set(DEALS.map((d) => d.category))];

  const PRICING_FILTERS = {
    all: { label: "All pricing", heading: "All deals", match: () => true },
    free: { label: "Free", heading: "Free deals", match: (d) => d.pricing === "free" || d.pricing === "freemium" },
    trial: { label: "Free trials", heading: "Free trials", match: (d) => d.pricing === "trial" || d.trial },
    discount: { label: "Student discounts", heading: "Student discounts", match: (d) => d.pricing === "discount" },
  };

  const params = new URLSearchParams(location.search);
  let activeCategory = categories.includes(params.get("category")) ? params.get("category") : "All";
  let activePricing = params.get("pricing") || "all";
  if (!(activePricing in PRICING_FILTERS)) activePricing = "all";

  function renderChips(el, items, active, onPick) {
    el.innerHTML = "";
    for (const { key, label } of items) {
      const btn = document.createElement("button");
      btn.className = "filter-chip" + (key === active ? " active" : "");
      btn.textContent = label;
      btn.addEventListener("click", () => onPick(key));
      el.appendChild(btn);
    }
  }

  function renderBrowse() {
    renderChips(
      catFiltersEl,
      categories.map((c) => ({ key: c, label: c })),
      activeCategory,
      (key) => { activeCategory = key; renderBrowse(); },
    );
    renderChips(
      priceFiltersEl,
      Object.entries(PRICING_FILTERS).map(([key, f]) => ({ key, label: f.label })),
      activePricing,
      (key) => {
        activePricing = key;
        const url = key === "all" ? "browse.html" : `browse.html?pricing=${key}`;
        history.replaceState(null, "", url);
        renderBrowse();
      },
    );

    const pricing = PRICING_FILTERS[activePricing];
    const q = searchTerm.trim().toLowerCase();
    const visible = DEALS.filter(
      (d) =>
        pricing.match(d) &&
        (activeCategory === "All" || d.category === activeCategory) &&
        (!q || `${d.name} ${d.description} ${d.category} ${d.deal || ""}`.toLowerCase().includes(q)),
    );

    if (sortKey === "rating") {
      visible.sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0));
    } else if (sortKey === "name") {
      visible.sort((a, b) => a.name.localeCompare(b.name));
    }

    headingEl.textContent = q
      ? `“${searchTerm.trim()}” (${visible.length})`
      : `${pricing.heading} (${visible.length})`;
    browseGrid.innerHTML = "";
    emptyEl.hidden = visible.length > 0;
    for (const deal of visible) browseGrid.appendChild(buildCard(deal, { compact: true }));
  }

  if (searchEl) searchEl.addEventListener("input", () => { searchTerm = searchEl.value; renderBrowse(); });
  if (sortEl) sortEl.addEventListener("change", () => { sortKey = sortEl.value; renderBrowse(); });

  renderBrowse();
}

// ---------- deal detail page ----------

const detailRoot = document.getElementById("deal-detail");
if (detailRoot) {
  const slug = new URLSearchParams(location.search).get("d");
  const deal = DEALS.find((x) => dealSlug(x) === slug);

  if (!deal) {
    const missing = document.createElement("div");
    missing.className = "detail-missing";
    const h = document.createElement("h1");
    h.textContent = "Deal not found";
    const p = document.createElement("p");
    p.textContent = "This deal doesn't exist (or was removed).";
    const back = document.createElement("a");
    back.className = "btn btn-primary";
    back.textContent = "Browse all deals";
    back.href = "browse.html";
    missing.append(h, p, back);
    detailRoot.append(missing);
  } else {
    document.title = `${deal.name} — StudentStack`;
    const domain = new URL(deal.url).hostname.replace(/^www\./, "");

    const crumbs = document.createElement("nav");
    crumbs.className = "breadcrumb";
    const crumbHome = document.createElement("a");
    crumbHome.href = "index.html";
    crumbHome.textContent = "Home";
    const crumbCat = document.createElement("a");
    crumbCat.href = `browse.html?category=${encodeURIComponent(deal.category)}`;
    crumbCat.textContent = deal.category;
    const crumbHere = document.createElement("span");
    crumbHere.textContent = deal.name;
    crumbs.append(crumbHome, " / ", crumbCat, " / ", crumbHere);

    const gridEl = document.createElement("div");
    gridEl.className = "detail-grid";

    // ----- left column: title, gallery, what you get -----
    const main = document.createElement("div");
    main.className = "detail-body";
    const h1 = document.createElement("h1");
    h1.textContent = deal.name;
    const tagline = document.createElement("p");
    tagline.className = "detail-tagline";
    tagline.textContent = deal.description;
    main.append(h1, tagline);

    if (deal.bestFor) {
      const bf = document.createElement("p");
      bf.className = "best-for";
      const bfLabel = document.createElement("strong");
      bfLabel.textContent = "Best for: ";
      bf.append(bfLabel, deal.bestFor);
      main.append(bf);
    }

    // gallery: main visual + thumbnails. All sources are local pre-captured
    // images (hero image + cached screenshots of the deal's key pages).
    const imgs = visualSources(deal);

    const visualWrap = document.createElement("div");
    visualWrap.className = "detail-visual";
    const makeMain = (src) => {
      visualWrap.innerHTML = "";
      visualWrap.append(src ? buildImg(deal, src, `${deal.name} preview`) : buildTile(deal));
    };
    makeMain(imgs[0]);
    main.append(visualWrap);

    if (imgs.length > 1) {
      const strip = document.createElement("div");
      strip.className = "thumb-strip";
      imgs.forEach((src, i) => {
        const t = document.createElement("button");
        t.className = "thumb" + (i === 0 ? " active" : "");
        t.type = "button";
        t.setAttribute("aria-label", `Image ${i + 1}`);
        const ti = document.createElement("img");
        ti.src = src;
        ti.loading = "lazy";
        ti.alt = "";
        t.append(ti);
        t.addEventListener("click", () => {
          makeMain(src);
          strip.querySelectorAll(".thumb").forEach((x) => x.classList.remove("active"));
          t.classList.add("active");
        });
        strip.append(t);
      });
      main.append(strip);
    }

    if (deal.details && deal.details.length) {
      const dh = document.createElement("h2");
      dh.className = "detail-section-title";
      dh.textContent = "What you get";
      const dl = document.createElement("ul");
      dl.className = "detail-points";
      for (const t of deal.details) {
        const li = document.createElement("li");
        li.textContent = t;
        dl.append(li);
      }
      main.append(dh, dl);
    }

    if (deal.useCases && deal.useCases.length) {
      const uh = document.createElement("h2");
      uh.className = "detail-section-title";
      uh.textContent = "How students use it";
      const ul = document.createElement("ul");
      ul.className = "detail-points use-cases";
      for (const t of deal.useCases) {
        const li = document.createElement("li");
        li.textContent = t;
        ul.append(li);
      }
      main.append(uh, ul);
    }

    // Research-backed impact — only rendered when a real, cited study
    // exists for this tool (see enrich.js). Never an invented number.
    if (deal.impact) {
      const box = document.createElement("aside");
      box.className = "impact-note";
      const ih = document.createElement("p");
      ih.className = "impact-title";
      ih.textContent = "⚡ Research-backed impact";
      const it = document.createElement("p");
      it.className = "impact-text";
      it.textContent = deal.impact.text;
      const isrc = document.createElement("a");
      isrc.className = "impact-source";
      isrc.href = deal.impact.url;
      isrc.target = "_blank";
      isrc.rel = "noopener";
      isrc.textContent = `Source: ${deal.impact.source} →`;
      box.append(ih, it, isrc);
      main.append(box);
    }

    // ----- right column: price card -----
    const card = document.createElement("aside");
    card.className = "price-card";
    const identity = document.createElement("div");
    identity.className = "deal-identity";
    identity.append(buildLogo(deal));
    const cardName = document.createElement("h2");
    cardName.className = "deal-name";
    cardName.textContent = deal.name;
    identity.append(cardName);

    const priceBig = document.createElement("p");
    priceBig.className = "price-big";
    priceBig.textContent = deal.price;

    const badges = document.createElement("div");
    badges.className = "deal-badges";
    const badge = document.createElement("span");
    badge.className = "deal-badge";
    badge.textContent = deal.deal;
    badges.append(badge);
    if (PRICING_LABELS[deal.pricing]) {
      const tag = document.createElement("span");
      tag.className = "pricing-tag";
      tag.textContent = PRICING_LABELS[deal.pricing];
      badges.append(tag);
    }
    if (deal.trialLength) {
      const tp = document.createElement("span");
      tp.className = "trial-pill";
      tp.textContent = deal.trialLength;
      badges.append(tp);
    }

    const points = document.createElement("ul");
    points.className = "price-points";
    const pointTexts = [
      `Claimed on ${domain}'s own official checkout — we never touch your payment info`,
      "Offer terms and final pricing are set by the company",
      deal.verified
        ? "Verified by StudentStack"
        : "Not yet verified — confirm the offer on the official site",
    ];
    for (const t of pointTexts) {
      const li = document.createElement("li");
      li.textContent = t;
      points.append(li);
    }

    const cta = document.createElement("a");
    cta.className = "btn btn-primary price-cta";
    cta.textContent = `Get this deal on ${domain} →`;
    cta.href = deal.url;
    cta.target = "_blank";
    cta.rel = "noopener";

    const fine = document.createElement("p");
    fine.className = "price-fine";
    fine.textContent = "If this is an affiliate link, we may earn a commission — at no extra cost to you.";

    card.append(identity, priceBig, badges);
    const ratingRow = buildRating(deal, { detail: true });
    if (ratingRow) card.append(ratingRow);
    card.append(points, cta, fine);

    gridEl.append(main, card);
    detailRoot.append(crumbs, gridEl);

    // related deals — up to 4 others in the same category
    const related = DEALS.filter((x) => x.category === deal.category && dealSlug(x) !== slug).slice(0, 4);
    if (related.length) {
      const sec = document.createElement("section");
      sec.className = "related";
      const rh = document.createElement("h2");
      rh.className = "detail-section-title";
      rh.textContent = `More ${deal.category} deals`;
      const grid = document.createElement("div");
      grid.className = "deals-grid compact related-grid";
      for (const r of related) grid.appendChild(buildCard(r, { compact: true }));
      sec.append(rh, grid);
      detailRoot.append(sec);
    }
  }
}

// ---------- email signup (home page) ----------
// Not hooked to a backend yet.
// TODO before launch: point this at a real list provider
// (Buttondown, Mailchimp, ConvertKit all have simple form endpoints).

const form = document.getElementById("signup-form");
if (form) {
  const status = document.getElementById("signup-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent =
      "Signups aren't live yet — this form isn't connected to a mailing list. (Dev note: see TODO in app.js)";
    status.hidden = false;
  });
}
