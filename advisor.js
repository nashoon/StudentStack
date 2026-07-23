// ============================================================
// TOOL FINDER — a client-side advisor widget.
//
// A student describes their problem in plain words; this scores all
// deals against the catalog text (name/category/description/details/
// useCases/bestFor) plus a curated intent lexicon, then recommends the
// best 2-3 and links straight to each deal page.
//
// Why client-side (no LLM): the site is static GitHub Pages with no
// server, so a real model call would mean exposing an API key in public
// JS. This matcher is instant, free, and private. To upgrade to a true
// LLM later, replace recommend() with a fetch() to a serverless proxy
// (e.g. a Cloudflare Worker holding the key) — the widget is unchanged.
// ============================================================

(function () {
  if (typeof DEALS === "undefined") return; // deals.js must load first

  const slugOf = (d) => d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const STOP = new Set(("a an the i im i'm my me we our you your it its is are be to of for on in with and or " +
    "need want help me some any that this how do can could would should what which best good app tool tools " +
    "student students college school class classes homework assignment work stuff thing things use using").split(" "));

  // token -> extra concept tokens folded into the query
  const SYNONYMS = {
    essay: ["writing", "paper"], paper: ["writing", "essay"], write: ["writing"], writing: ["write"],
    proofread: ["grammar"], spelling: ["grammar"], grammar: ["proofread"],
    paraphrase: ["reword", "rewrite"], reword: ["paraphrase"], rewrite: ["paraphrase"], plagiarism: ["paraphrase"],
    summarize: ["summary"], summary: ["summarize"],
    cite: ["citation", "bibliography", "sources"], citation: ["cite"], bibliography: ["cite"], references: ["cite"], mla: ["cite"], apa: ["cite"],
    research: ["sources"], sources: ["research", "cite"],
    flashcard: ["flashcards", "memorize", "study"], flashcards: ["flashcard"], memorize: ["flashcard", "study"], memorise: ["flashcard"],
    study: ["studying", "exam", "review"], studying: ["study"], exam: ["study", "test"], test: ["exam", "study"], quiz: ["study"], revision: ["study"], cram: ["study", "exam"],
    lecture: ["transcribe", "notes"], transcribe: ["lecture", "transcription"], record: ["lecture", "transcribe"], notes: ["notetaking"],
    code: ["coding", "programming"], coding: ["code"], program: ["coding"], programming: ["code"], python: ["code"], java: ["code"], javascript: ["code"], debug: ["code"], developer: ["code"], app: ["code"],
    math: ["mathematics", "calculus"], calculus: ["math"], physics: ["math", "science"], equation: ["math"], solve: ["math", "homework"], chemistry: ["science"],
    presentation: ["slides", "deck"], slides: ["presentation"], deck: ["presentation"], powerpoint: ["presentation", "slides"], pitch: ["presentation"],
    design: ["graphic", "ui"], poster: ["design"], flyer: ["design"], graphic: ["design"], logo: ["design"], ui: ["design"], mockup: ["design"], prototype: ["design"],
    translate: ["translation", "language"], translation: ["translate"], language: ["translate"], foreign: ["translate"],
    listen: ["audio"], audio: ["listen"], dyslexia: ["audio", "listen"], reading: ["read"],
    organize: ["organized", "plan"], plan: ["planner", "organize"], planner: ["plan"], schedule: ["plan"], todo: ["plan"], workspace: ["organize", "notes"],
    explain: ["understand", "tutor"], understand: ["explain"], tutor: ["explain", "study"],
    cheap: ["free", "budget"], broke: ["free"], budget: ["free"], affordable: ["free"],
  };

  // concept -> deal slugs to boost, with weight
  const INTENT = [
    { on: ["grammar", "proofread"], slugs: ["grammarly", "quillbot"], w: 6 },
    { on: ["paraphrase", "reword", "rewrite", "plagiarism"], slugs: ["quillbot", "grammarly"], w: 6 },
    { on: ["essay", "writing", "paper", "draft"], slugs: ["grammarly", "quillbot", "chatgpt", "claude", "notion"], w: 4 },
    { on: ["cite", "citation", "bibliography", "references"], slugs: ["zotero"], w: 7 },
    { on: ["research", "sources"], slugs: ["perplexity", "google-gemini", "notebooklm", "zotero"], w: 5 },
    { on: ["flashcard", "memorize", "study", "exam", "test", "quiz", "revision", "cram"], slugs: ["quizlet", "knowt", "thea", "notesxp", "mindomax", "flashrecall", "brainden"], w: 5 },
    { on: ["lecture", "transcribe", "record"], slugs: ["otter-ai", "notebooklm", "notesxp", "brainden"], w: 6 },
    { on: ["notes", "notetaking"], slugs: ["notion", "notebooklm", "notesxp"], w: 3 },
    { on: ["code", "coding", "programming", "debug", "developer"], slugs: ["github-student-developer-pack", "cursor", "chatgpt", "claude"], w: 6 },
    { on: ["math", "calculus", "physics", "equation", "solve"], slugs: ["wolfram-alpha-pro", "solvo"], w: 7 },
    { on: ["presentation", "slides", "deck", "powerpoint", "pitch"], slugs: ["gamma", "canva", "figma"], w: 6 },
    { on: ["design", "poster", "flyer", "graphic", "logo", "ui", "mockup", "prototype"], slugs: ["canva", "figma"], w: 6 },
    { on: ["translate", "translation", "language", "foreign"], slugs: ["deepl"], w: 8 },
    { on: ["audio", "listen", "dyslexia"], slugs: ["speechify"], w: 7 },
    { on: ["organize", "plan", "planner", "schedule", "todo", "workspace"], slugs: ["notion"], w: 6 },
    { on: ["latex", "thesis", "dissertation"], slugs: ["overleaf"], w: 8 },
    { on: ["explain", "understand", "tutor", "assistant"], slugs: ["chatgpt", "claude", "google-gemini"], w: 3 },
  ];

  const FREE_SIGNALS = ["free", "cheap", "broke", "budget", "affordable", "money", "poor"];

  function tokenize(text) {
    const raw = (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    const out = [];
    for (const t of raw) {
      if (STOP.has(t) || t.length < 2) continue;
      // naive singular so "citations"/"flashcards"/"slides" match the lexicon
      const forms = t.endsWith("s") && t.length > 3 ? [t, t.slice(0, -1)] : [t];
      for (const f of forms) {
        out.push(f);
        if (SYNONYMS[f]) out.push(...SYNONYMS[f]);
      }
    }
    return out;
  }

  // Build a searchable token bag per deal from the merged catalog text.
  const INDEX = DEALS.map((d) => {
    const parts = [d.name, d.category, d.deal, d.description, (d.bestFor || ""),
      ...(d.details || []), ...(d.useCases || [])];
    const bag = {};
    for (const tok of tokenize(parts.join(" "))) bag[tok] = (bag[tok] || 0) + 1;
    return { deal: d, slug: slugOf(d), bag };
  });

  function recommend(query) {
    const qToks = tokenize(query);
    if (!qToks.length) return [];
    const qSet = new Set(qToks);
    const wantsFree = FREE_SIGNALS.some((s) => qSet.has(s));

    const scored = INDEX.map((item) => {
      let score = 0;
      for (const t of qToks) if (item.bag[t]) score += Math.min(item.bag[t], 3);
      for (const rule of INTENT) {
        if (rule.on.some((c) => qSet.has(c)) && rule.slugs.includes(item.slug)) score += rule.w;
      }
      if (wantsFree && (item.deal.pricing === "free" || item.deal.pricing === "freemium")) score += 2;
      if (qSet.has(item.slug) || item.deal.name.toLowerCase().split(/\s+/).some((w) => qSet.has(w))) score += 4;
      return { ...item, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

    return scored.slice(0, 3);
  }

  function reasonFor(item) {
    const d = item.deal;
    const s = d.bestFor || d.category;
    // lowercase the first letter only for ordinary words, not acronyms (STEM)
    const bf = /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
    const price = /free/i.test(d.price) ? "has a free tier" : "a paid pick";
    return `Best for ${bf} — ${price}.`;
  }

  // ---------- widget ----------
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  const fab = el("button", "advisor-fab");
  fab.setAttribute("aria-label", "Open the tool finder");
  fab.innerHTML = "<span>🎯</span> Find your tool";

  const panel = el("div", "advisor-panel");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="advisor-head">
      <div><strong>Tool Finder</strong><span>Describe what you're working on</span></div>
      <button class="advisor-close" aria-label="Close">×</button>
    </div>
    <div class="advisor-log" id="advisor-log"></div>
    <div class="advisor-chips" id="advisor-chips"></div>
    <form class="advisor-input" id="advisor-form">
      <input type="text" id="advisor-q" placeholder="e.g. I need to write a lab report in LaTeX" autocomplete="off" />
      <button type="submit" aria-label="Send">→</button>
    </form>`;

  document.body.append(fab, panel);
  const log = panel.querySelector("#advisor-log");
  const chipsWrap = panel.querySelector("#advisor-chips");
  const form = panel.querySelector("#advisor-form");
  const input = panel.querySelector("#advisor-q");

  const EXAMPLES = [
    "Write and proofread my essay",
    "Study for an exam with flashcards",
    "Translate a foreign paper",
    "Make a presentation fast",
    "Help me code my project",
    "Solve a calculus problem",
  ];

  function addMsg(text, who) {
    const m = el("div", "advisor-msg " + who);
    m.textContent = text;
    log.append(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function addResults(items) {
    if (!items.length) {
      addMsg("Hmm, I couldn't match that to a tool. Try naming the task — writing, studying, coding, design, research, translating, or math.", "bot");
      return;
    }
    addMsg(items.length === 1 ? "Here's your best match:" : `Here are your top ${items.length} matches:`, "bot");
    const wrap = el("div", "advisor-results");
    for (const item of items) {
      const d = item.deal;
      const card = el("a", "advisor-result");
      card.href = `deal.html?d=${item.slug}`;
      const name = el("div", "ar-name", d.name);
      const price = el("div", "ar-price", d.price);
      const why = el("div", "ar-why", reasonFor(item));
      const cta = el("div", "ar-cta", "View deal →");
      card.append(name, price, why, cta);
      wrap.append(card);
    }
    log.append(wrap);
    log.scrollTop = log.scrollHeight;
  }

  function ask(q) {
    if (!q.trim()) return;
    addMsg(q, "user");
    chipsWrap.hidden = true;
    setTimeout(() => addResults(recommend(q)), 220);
  }

  function greet() {
    if (log.dataset.greeted) return;
    log.dataset.greeted = "1";
    addMsg("👋 Tell me what you're trying to do and I'll point you to the right tool + deal. What are you working on?", "bot");
    chipsWrap.innerHTML = "";
    chipsWrap.hidden = false;
    for (const ex of EXAMPLES) {
      const c = el("button", "advisor-chip", ex);
      c.type = "button";
      c.addEventListener("click", () => ask(ex));
      chipsWrap.append(c);
    }
  }

  function toggle(open) {
    const show = open == null ? panel.hidden : open;
    panel.hidden = !show;
    fab.classList.toggle("hidden", show);
    if (show) { greet(); setTimeout(() => input.focus(), 50); }
  }

  fab.addEventListener("click", () => toggle(true));
  panel.querySelector(".advisor-close").addEventListener("click", () => toggle(false));
  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; ask(v); });
})();
