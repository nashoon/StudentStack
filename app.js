// Shared rendering for StudentStack (editorial redesign).
// index.html  — hero card fan + popular deals grid + email signup
// browse.html — full catalog, filter pills + search + sort
// deal.html   — deal detail page (?d=<slug>)

const PRICING_LABELS = {
  free: "Free",
  freemium: "Free tier",
  trial: "Free trial",
  discount: "Student discount",
};

// Deal badge color class by pricing type (design system pills).
const PILL_CLASS = { free: "free", freemium: "free", trial: "trial", discount: "discount" };

// Ratings with fewer than this many reviews don't show a score —
// a 5-star average from 3 reviews is noise, not signal.
const MIN_REVIEWS = 20;

const MONOGRAM_COLORS = ["#7c5cff", "#4d6414", "#d97706", "#c2402a", "#20808d", "#141414"];

function dealSlug(deal) {
  return deal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Merge the editorial layer (enrich.js) into the catalog by slug.
if (typeof ENRICH !== "undefined") {
  for (const d of DEALS) Object.assign(d, ENRICH[dealSlug(d)] || {});
}

// Nav drawer (Menu button in the pill nav).
const navMenuBtn = document.querySelector(".nav-menu");
const navDrawer = document.querySelector(".nav-drawer");
if (navMenuBtn && navDrawer) {
  navMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = navDrawer.classList.toggle("open");
    navMenuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (navDrawer.classList.contains("open") && !navDrawer.contains(e.target)) {
      navDrawer.classList.remove("open");
      navMenuBtn.setAttribute("aria-expanded", "false");
    }
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
  img.className = "dc-logo";
  img.src = faviconUrl(deal);
  img.alt = "";
  img.addEventListener("error", () => img.replaceWith(buildMonogram(deal.name)));
  return img;
}

function buildMonogram(name) {
  const tile = document.createElement("div");
  tile.className = "dc-logo dc-logo-mono";
  tile.textContent = name[0].toUpperCase();
  tile.style.background = brandColor(name);
  return tile;
}

// Branded tile — fallback visual when a deal has no image/screenshot.
function buildTile(deal) {
  const tile = document.createElement("div");
  tile.className = "dc-tile";
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
// shots-cache.js), so the gallery uses local files only.
function cachedShot(url) {
  return (typeof SHOT_CACHE !== "undefined" && url && SHOT_CACHE[url]) || null;
}

function buildImg(deal, src, alt) {
  const img = document.createElement("img");
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

// Card visual: hero image → cached screenshot → branded tile,
// wrapped in the fixed-height .dc-visual frame.
function buildVisual(deal) {
  const wrap = document.createElement("div");
  wrap.className = "dc-visual";
  const src = visualSources(deal)[0];
  wrap.append(src ? buildImg(deal, src, `${deal.name} preview`) : buildTile(deal));
  return wrap;
}

function formatCount(n) {
  return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
}

// Rating fragment. Scores from few reviews are hidden (see MIN_REVIEWS);
// the detail page says why instead of showing nothing.
function buildRating(deal, { detail = false } = {}) {
  const r = deal.rating;
  if (!r) return null;
  if (r.count < MIN_REVIEWS) {
    if (!detail) return null;
    const few = document.createElement("p");
    few.className = "detail-rating";
    few.textContent = `Only ${r.count} reviews on ${r.source} — too few for a fair score`;
    return few;
  }
  const wrap = document.createElement(detail ? "p" : "span");
  wrap.className = detail ? "detail-rating" : "dc-rating";
  const star = document.createElement("span");
  star.className = "star";
  star.textContent = "★";
  const score = document.createElement("strong");
  score.textContent = r.score.toFixed(1);
  const src = document.createElement("a");
  src.href = r.url;
  src.target = "_blank";
  src.rel = "noopener";
  src.textContent = detail
    ? `${r.count.toLocaleString()} reviews on ${r.source}`
    : `${formatCount(r.count)} · ${r.source}`;
  wrap.append(star, " ", score, " ", src);
  return wrap;
}

function buildCard(deal) {
  const card = document.createElement("article");
  card.className = "deal-card";

  // head: logo + name + category chip
  const head = document.createElement("div");
  head.className = "dc-head";
  head.append(buildLogo(deal));
  const name = document.createElement("h3");
  name.className = "dc-name";
  name.textContent = deal.name;
  head.append(name);
  const cat = document.createElement("span");
  cat.className = "dc-cat";
  cat.textContent = deal.category.toUpperCase();
  head.append(cat);

  // colored offer pill
  const pill = document.createElement("div");
  pill.className = `dc-pill ${PILL_CLASS[deal.pricing] || "free"}`;
  pill.textContent = deal.deal;

  // price headline + description
  const offer = document.createElement("div");
  offer.className = "dc-offer";
  offer.textContent = deal.price;
  const desc = document.createElement("p");
  desc.className = "dc-desc";
  desc.textContent = deal.description;

  // meta row: rating (if fair) + trial length
  const meta = document.createElement("div");
  meta.className = "dc-meta";
  const rating = buildRating(deal);
  if (rating) meta.append(rating);
  if (deal.trialLength) {
    const tp = document.createElement("span");
    tp.className = "dc-trial";
    tp.textContent = deal.trialLength.toUpperCase();
    meta.append(tp);
  }

  // cards link to our own deal page; only the deal page links out to the vendor
  const cta = document.createElement("a");
  cta.className = "dc-cta";
  cta.textContent = "View this deal →";
  cta.href = `deal.html?d=${dealSlug(deal)}`;

  card.append(head, pill, buildVisual(deal), offer, desc);
  if (meta.childNodes.length) card.append(meta);
  card.append(cta);
  return card;
}

// ---------- home page: card fan ----------

const fanDeck = document.getElementById("fan-deck");
if (fanDeck) {
  const fanScale = document.querySelector(".fan-scale");
  const fanOuter = document.querySelector(".fan-outer");
  // color variants straight from the design mockup
  const VARIANTS = [
    { bg: "#eee5d3", fg: "#141414", mono: "#8a877d", chipBg: "#141414", chipFg: "#fff" },
    { bg: "#141414", fg: "#fff", mono: "#c6f24e", chipBg: "#c6f24e", chipFg: "#141414" },
    { bg: "#ffffff", fg: "#141414", mono: "#8a877d", chipBg: "#7c5cff", chipFg: "#fff" },
    { bg: "#7c5cff", fg: "#fff", mono: "rgba(255,255,255,.7)", chipBg: "#fff", chipFg: "#7c5cff" },
    { bg: "#c6f24e", fg: "#141414", mono: "#4d6414", chipBg: "#141414", chipFg: "#fff" },
    { bg: "#f2b63c", fg: "#141414", mono: "rgba(20,20,20,.55)", chipBg: "#141414", chipFg: "#fff" },
    { bg: "#4a90d9", fg: "#fff", mono: "rgba(255,255,255,.75)", chipBg: "#fff", chipFg: "#2c5d8f" },
  ];
  const fanDeals = DEALS.filter((d) => d.popular);
  const COUNT = Math.min(7, fanDeals.length);
  const CENTER = (COUNT - 1) / 2;
  let offset = 0, hover = -1;

  function fanLabel(d) {
    return `${d.category} · ${PRICING_LABELS[d.pricing] || "Deal"}`.toUpperCase();
  }

  function renderFan() {
    fanDeck.innerHTML = "";
    const n = fanDeals.length;
    for (let i = 0; i < COUNT; i++) {
      const d = fanDeals[(((i + offset) % n) + n) % n];
      const v = VARIANTS[(((i + offset) % VARIANTS.length) + VARIANTS.length) % VARIANTS.length];
      const baseRot = (i - CENTER) * 6;
      const baseY = Math.pow(Math.abs(i - CENTER), 1.7) * 10;
      const dist = hover < 0 ? 9 : Math.abs(i - hover);
      let rot = baseRot, y = baseY, scale = 1, z = i + 1;
      if (dist === 0) { rot = baseRot * 0.25; y = baseY - 46; scale = 1.09; z = 20; }
      else if (dist === 1) { y = baseY - 16; scale = 1.02; z = 12; }
      else if (dist === 2) { y = baseY - 5; }

      const card = document.createElement("a");
      card.className = "fan-card";
      card.href = `deal.html?d=${dealSlug(d)}`;
      card.style.background = v.bg;
      card.style.color = v.fg;
      card.style.marginLeft = i === 0 ? "0" : "-62px";
      card.style.zIndex = z;
      card.style.transform = `translateY(${y}px) rotate(${rot}deg) scale(${scale})`;

      const label = document.createElement("div");
      label.className = "fc-label";
      label.style.color = v.mono;
      label.textContent = fanLabel(d);

      const nm = document.createElement("div");
      nm.className = "fc-name";
      nm.textContent = d.name;

      const ds = document.createElement("div");
      ds.className = "fc-desc";
      ds.style.color = v.fg === "#fff" ? "rgba(255,255,255,.65)" : "rgba(20,20,20,.6)";
      ds.textContent = d.deal;

      const art = document.createElement("div");
      art.className = "fc-art";
      const logo = document.createElement("img");
      logo.src = faviconUrl(d);
      logo.alt = "";
      logo.style.cssText = "width:56px;height:56px;border-radius:12px;background:rgba(255,255,255,.85);padding:8px;box-shadow:0 6px 16px rgba(20,20,20,.18)";
      logo.addEventListener("error", () => logo.remove());
      art.append(logo);

      const chip = document.createElement("div");
      chip.className = "fc-chip";
      chip.style.background = v.chipBg;
      chip.style.color = v.chipFg;
      chip.textContent = "Claim →";

      card.append(label, nm, ds, art, chip);
      card.addEventListener("mouseenter", () => { hover = i; renderFan(); });
      fanDeck.append(card);
    }
  }

  fanDeck.addEventListener("mouseleave", () => { hover = -1; renderFan(); });
  document.getElementById("fan-left").addEventListener("click", () => { offset -= 1; hover = -1; renderFan(); });
  document.getElementById("fan-right").addEventListener("click", () => { offset += 1; hover = -1; renderFan(); });

  function sizeFan() {
    const s = Math.min(1, (window.innerWidth - 32) / 1380);
    fanScale.style.transform = `scale(${s})`;
    fanOuter.style.height = `${390 * s}px`;
  }
  window.addEventListener("resize", sizeFan);
  sizeFan();
  renderFan();
}

// ---------- home page: popular deals ----------

const popularGrid = document.getElementById("popular-grid");
if (popularGrid) {
  for (const deal of DEALS.filter((d) => d.popular).slice(0, 6)) {
    popularGrid.appendChild(buildCard(deal));
  }
}

// ---------- browse page: full catalog with filters ----------

const browseGrid = document.getElementById("browse-grid");
if (browseGrid) {
  const countEl = document.getElementById("browse-count");
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
    all: { label: "All", match: () => true },
    free: { label: "Free", match: (d) => d.pricing === "free" || d.pricing === "freemium" },
    trial: { label: "Free trial", match: (d) => d.pricing === "trial" || d.trial },
    discount: { label: "Discount", match: (d) => d.pricing === "discount" },
  };

  const params = new URLSearchParams(location.search);
  let activeCategory = categories.includes(params.get("category")) ? params.get("category") : "All";
  let activePricing = params.get("pricing") || "all";
  if (!(activePricing in PRICING_FILTERS)) activePricing = "all";

  function renderChips(el, items, active, onPick) {
    el.innerHTML = "";
    for (const { key, label } of items) {
      const btn = document.createElement("button");
      btn.className = "filter-pill" + (key === active ? " active" : "");
      if (key === active) btn.setAttribute("aria-current", "true");
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

    if (countEl) countEl.textContent = `${visible.length} OF ${DEALS.length} DEALS SHOWN`;
    browseGrid.innerHTML = "";
    emptyEl.hidden = visible.length > 0;
    for (const deal of visible) browseGrid.appendChild(buildCard(deal));
  }

  const clearBtn = document.getElementById("clear-filters");
  if (clearBtn) clearBtn.addEventListener("click", () => {
    activeCategory = "All"; activePricing = "all"; searchTerm = "";
    if (searchEl) searchEl.value = "";
    history.replaceState(null, "", "browse.html");
    renderBrowse();
  });

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
    back.className = "btn btn-ink";
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
    crumbHome.textContent = "HOME";
    const crumbCat = document.createElement("a");
    crumbCat.href = `browse.html?category=${encodeURIComponent(deal.category)}`;
    crumbCat.textContent = deal.category.toUpperCase();
    const crumbHere = document.createElement("span");
    crumbHere.className = "here";
    crumbHere.textContent = deal.name.toUpperCase();
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

    // gallery: main visual + thumbnails, all local pre-captured images
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
    identity.className = "pc-id";
    identity.append(buildLogo(deal));
    const cardName = document.createElement("h2");
    cardName.textContent = deal.name;
    identity.append(cardName);

    const priceBig = document.createElement("p");
    priceBig.className = "price-big";
    priceBig.textContent = deal.price;

    const badges = document.createElement("div");
    badges.className = "price-badges";
    const badge = document.createElement("span");
    badge.className = `dc-pill ${PILL_CLASS[deal.pricing] || "free"}`;
    badge.textContent = deal.deal;
    badges.append(badge);
    if (deal.trialLength) {
      const tp = document.createElement("span");
      tp.className = "dc-trial";
      tp.textContent = deal.trialLength.toUpperCase();
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
    cta.className = "price-cta";
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

    // related deals — up to 3 others in the same category
    const related = DEALS.filter((x) => x.category === deal.category && dealSlug(x) !== slug).slice(0, 3);
    if (related.length) {
      const sec = document.createElement("section");
      sec.className = "related";
      const rh = document.createElement("h2");
      rh.className = "detail-section-title";
      rh.textContent = `More ${deal.category} deals`;
      const grid = document.createElement("div");
      grid.className = "deals-grid related-grid";
      for (const r of related) grid.appendChild(buildCard(r));
      sec.append(rh, grid);
      detailRoot.append(sec);
    }
  }
}

// ---------- email signup ----------
// Not hooked to a backend yet.
// TODO before launch: point this at a real list provider
// (Buttondown, Mailchimp, ConvertKit all have simple form endpoints).

const form = document.getElementById("signup-form");
if (form) {
  const status = document.getElementById("signup-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent =
      "Email alerts are coming soon — we're not collecting signups just yet. Check back before the school year starts!";
    status.hidden = false;
  });
}
