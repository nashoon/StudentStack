// Shared rendering for StudentStack.
// index.html  — popular deals grid + email signup
// browse.html — full catalog, compact 4-per-row grid, category + pricing filters

const PRICING_LABELS = {
  free: "Free",
  freemium: "Free tier",
  trial: "Free trial",
  discount: "Student discount",
};

const MONOGRAM_COLORS = ["#4f46e5", "#059669", "#d97706", "#dc2626", "#0891b2", "#7c3aed"];

function dealSlug(deal) {
  return deal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

function mshotsUrl(url, attempt) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=640${attempt ? `&r=${attempt}` : ""}`;
}

// Card visual, in priority order:
// 1. deal.image      — hand-picked usage demo (PNG/GIF from the vendor's press kit)
// 2. deal.screenshot — live site screenshot via mShots (opt-in, verified per deal)
// 3. branded logo tile
function buildVisual(deal) {
  if (deal.image) {
    const img = document.createElement("img");
    img.className = "deal-shot";
    img.alt = `${deal.name} demo`;
    img.src = deal.image;
    img.addEventListener("error", () => img.replaceWith(buildTile(deal)));
    return img;
  }

  if (deal.screenshot) {
    const img = document.createElement("img");
    img.className = "deal-shot";
    img.alt = `${deal.name} preview`;
    img.addEventListener("error", () => img.replaceWith(buildTile(deal)));
    let attempts = 0;
    img.addEventListener("load", () => {
      // real screenshots come back 640px wide; smaller means the
      // "generating…" placeholder, so retry until the real one exists
      if (img.naturalWidth < 640 && attempts < 4) {
        attempts++;
        setTimeout(() => { img.src = mshotsUrl(deal.url, attempts); }, 4000);
      }
    });
    img.src = mshotsUrl(deal.url, 0);
    return img;
  }

  return buildTile(deal);
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

  const desc = document.createElement("p");
  desc.className = "deal-desc";
  desc.textContent = deal.description;

  // cards link to our own deal page; only the deal page links out to the vendor
  const cta = document.createElement("a");
  cta.className = "btn btn-primary deal-cta";
  cta.textContent = compact ? "View deal →" : "View this deal →";
  cta.href = `deal.html?d=${dealSlug(deal)}`;

  card.append(top, badges, buildVisual(deal), desc, cta);
  return card;
}

// ---------- home page: popular deals ----------

const popularGrid = document.getElementById("popular-grid");
if (popularGrid) {
  for (const deal of DEALS.filter((d) => d.popular)) {
    popularGrid.appendChild(buildCard(deal));
  }
}

// ---------- browse page: full catalog with filters ----------

const browseGrid = document.getElementById("browse-grid");
if (browseGrid) {
  const headingEl = document.getElementById("browse-heading");
  const catFiltersEl = document.getElementById("category-filters");
  const priceFiltersEl = document.getElementById("pricing-filters");
  const emptyEl = document.getElementById("deals-empty");

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
    const visible = DEALS.filter(
      (d) => pricing.match(d) && (activeCategory === "All" || d.category === activeCategory),
    );

    headingEl.textContent = `${pricing.heading} (${visible.length})`;
    browseGrid.innerHTML = "";
    emptyEl.hidden = visible.length > 0;
    for (const deal of visible) browseGrid.appendChild(buildCard(deal, { compact: true }));
  }

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

    const main = document.createElement("div");
    main.className = "detail-body";
    const h1 = document.createElement("h1");
    h1.textContent = deal.name;
    const tagline = document.createElement("p");
    tagline.className = "detail-tagline";
    tagline.textContent = deal.description;
    const visual = buildVisual(deal);
    const visualWrap = document.createElement("div");
    visualWrap.className = "detail-visual";
    visualWrap.append(visual);
    main.append(h1, tagline, visualWrap);

    const card = document.createElement("aside");
    card.className = "price-card";
    const identity = document.createElement("div");
    identity.className = "deal-identity";
    identity.append(buildLogo(deal));
    const cardName = document.createElement("h2");
    cardName.className = "deal-name";
    cardName.textContent = deal.name;
    identity.append(cardName);

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

    card.append(identity, badges, points, cta, fine);
    gridEl.append(main, card);
    detailRoot.append(crumbs, gridEl);
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
