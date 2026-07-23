// ============================================================
// DEALS CATALOG
//
// IMPORTANT: This is SAMPLE data to show the site working.
// Before launch, verify every offer on the company's own site
// and set verified: true. Replace each url with your affiliate
// link once you've joined that company's program.
//
// Fields:
//   popular    — true = shows on the homepage "Popular deals" view
//   pricing    — "free" | "freemium" | "trial" | "discount" (drives the Free filter)
//   price      — short price string shown on cards ("Free", "Free tier · Pro $20/mo").
//                Prices marked ~ are approximate — confirm before launch.
//   details    — "What you get" bullets on the deal page. Keep them factual
//                and specific (limits, trial lengths, eligibility).
//   rating     — Trustpilot score scraped on the date in `checked`. Refresh
//                periodically. Under 20 reviews the UI hides the score.
//   trial      — true = also has a free trial of a paid plan
//   screenshot — true = show a live screenshot of the tool's site (opt-in)
//   image      — card/hero image (vendor og image or press-kit PNG/GIF)
//   gallery    — extra images for the deal page thumbnail strip (optional)
// ============================================================

const DEALS = [
  {
    name: "GitHub Student Developer Pack",
    category: "Coding",
    deal: "Free with a school email",
    price: "Free for students",
    description: "GitHub Copilot Pro plus dozens of dev tools, free while you're a student. The single best student bundle on the internet.",
    details: [
      "GitHub Copilot Pro free while you're a verified student",
      "Dozens of partner tools included: cloud credits, free domains, IDEs, and more",
      "Free for as long as you're enrolled — re-verify each year",
      "Requires proof of enrollment (school email or student ID)",
    ],
    url: "https://education.github.com/pack",
    image: "images/github.png",
    rating: { score: 2.0, count: 253, source: "Trustpilot", url: "https://www.trustpilot.com/review/github.com", checked: "2026-07-23" },
    pricing: "free",
    popular: true,
    screenshot: true,
    verified: false,
  },
  {
    name: "Notion",
    category: "Productivity",
    deal: "Free Plus plan for students",
    price: "Free for students",
    description: "Notes, docs, and planning with Notion AI available as an add-on. The education plan is free with a school email.",
    details: [
      "Education Plus plan free with a school email",
      "Unlimited pages and blocks, file uploads, and version history",
      "Notion AI is a paid add-on — not included in the free education plan",
      "Free for as long as you have a valid school email",
    ],
    url: "https://www.notion.so/students",
    image: "images/notion.png",
    rating: { score: 2.3, count: 418, source: "Trustpilot", url: "https://www.trustpilot.com/review/notion.so", checked: "2026-07-23" },
    pricing: "free",
    popular: true,
    screenshot: true,
    verified: false,
  },
  {
    name: "Perplexity",
    category: "Research",
    deal: "Student offer",
    price: "Free tier · Pro $20/mo",
    description: "AI answer engine with cited sources — great for research without the hallucinated citations. Runs student promotions on Pro.",
    details: [
      "Free tier: unlimited quick searches with cited sources",
      "Pro: more advanced searches per day, file uploads, and model choice",
      "Runs student promotions on Pro periodically — check their site",
    ],
    url: "https://www.perplexity.ai/",
    image: "images/perplexity.jpg",
    rating: { score: 1.5, count: 714, source: "Trustpilot", url: "https://www.trustpilot.com/review/perplexity.ai", checked: "2026-07-23" },
    pricing: "discount",
    popular: true,
    verified: false,
  },
  {
    name: "Grammarly",
    category: "Writing",
    deal: "Free tier + education plans",
    price: "Free tier · Premium ~$12/mo",
    description: "Grammar, tone, and clarity checking everywhere you write. Solid free tier; some schools cover Premium.",
    details: [
      "Free: grammar, spelling, and tone basics everywhere you write",
      "Premium: full-sentence rewrites, plagiarism detection, citation support",
      "Premium is ~$12/mo billed annually — but check if your school licenses it for free first",
    ],
    url: "https://www.grammarly.com/edu",
    image: "images/grammarly.png",
    rating: { score: 3.3, count: 10461, source: "Trustpilot", url: "https://www.trustpilot.com/review/grammarly.com", checked: "2026-07-23" },
    pricing: "freemium",
    popular: true,
    verified: false,
  },
  {
    name: "Quizlet",
    category: "Studying",
    deal: "Free tier + Plus discount",
    price: "Free tier · Plus ~$7.99/mo",
    description: "Flashcards and practice tests with AI-generated study modes from your own notes.",
    details: [
      "Free: flashcards, practice tests, and basic study modes",
      "Plus: ad-free, offline access, and unlimited AI-powered study modes",
      "New users typically get a free trial of Plus — length varies by promo",
    ],
    url: "https://quizlet.com/",
    rating: { score: 1.3, count: 640, source: "Trustpilot", url: "https://www.trustpilot.com/review/quizlet.com", checked: "2026-07-23" },
    pricing: "freemium",
    trial: true,
    popular: true,
    verified: false,
  },
  {
    name: "Otter.ai",
    category: "Productivity",
    deal: "Education discount",
    price: "Free tier · student discount on Pro",
    description: "Records and transcribes lectures in real time, then gives you an AI summary and searchable notes.",
    details: [
      "Free: 300 transcription minutes per month, 30 min per conversation",
      "Pro: 1,200 minutes/month, longer conversations, better exports",
      "Students and teachers get a discount on Pro with a school email",
    ],
    url: "https://otter.ai/education",
    image: "images/otter.png",
    rating: { score: 3.1, count: 570, source: "Trustpilot", url: "https://www.trustpilot.com/review/otter.ai", checked: "2026-07-23" },
    pricing: "discount",
    popular: false,
    verified: false,
  },
  {
    name: "Gamma",
    category: "Design",
    deal: "Generous free tier",
    price: "Free tier · paid from ~$8/mo",
    description: "Generates full slide decks from a prompt. The fastest way to turn an outline into a presentation.",
    details: [
      "Free: AI deck generation with starting credits, share and present online",
      "Paid plans: unlimited AI creation and watermark-free exports",
      "No credit card needed for the free tier",
    ],
    url: "https://gamma.app/",
    image: "images/gamma.png",
    rating: { score: 1.7, count: 118, source: "Trustpilot", url: "https://www.trustpilot.com/review/gamma.app", checked: "2026-07-23" },
    pricing: "freemium",
    popular: false,
    verified: false,
  },
  {
    name: "Wolfram|Alpha Pro",
    category: "Studying",
    deal: "Student pricing",
    price: "Student plan from ~$5/mo",
    description: "Step-by-step math solutions, not just answers. Discounted Pro plan for students.",
    details: [
      "Pro: step-by-step solutions for math, physics, and chemistry problems",
      "Practice problems with hints, and photo input for handwritten math",
      "Discounted student pricing — cheaper than a single tutoring session per year",
    ],
    url: "https://www.wolframalpha.com/pro/pricing/students",
    image: "images/wolfram.png",
    rating: { score: 3.3, count: 3, source: "Trustpilot", url: "https://www.trustpilot.com/review/wolframalpha.com", checked: "2026-07-23" },
    pricing: "discount",
    popular: false,
    verified: false,
  },
  {
    name: "Speechify",
    category: "Studying",
    deal: "Free tier",
    price: "Free tier · Premium ~$139/yr",
    description: "Turns readings and PDFs into natural-sounding audio so you can get through them faster.",
    details: [
      "Free: listen to docs, PDFs, and web pages at standard speeds",
      "Premium: natural AI voices, up to 4.5x speed, scan-and-listen for printed pages",
      "Works across phone, browser extension, and desktop",
    ],
    url: "https://speechify.com/",
    image: "images/speechify.jpg",
    rating: { score: 4.7, count: 6662, source: "Trustpilot", url: "https://www.trustpilot.com/review/speechify.com", checked: "2026-07-23" },
    pricing: "freemium",
    popular: false,
    verified: false,
  },
  {
    name: "Zotero",
    category: "Research",
    deal: "100% free",
    price: "Free",
    description: "The standard tool for collecting sources and generating citations. Free and open source, with AI plugins available.",
    details: [
      "Completely free, open-source citation manager — no premium upsell",
      "Browser connector saves any source in one click",
      "Word and Google Docs plugins generate citations and bibliographies",
      "Paid only if you want extra cloud sync storage (from $20/yr)",
    ],
    url: "https://www.zotero.org/",
    rating: { score: 3.7, count: 14, source: "Trustpilot", url: "https://www.trustpilot.com/review/zotero.org", checked: "2026-07-23" },
    pricing: "free",
    popular: false,
    screenshot: true,
    verified: false,
  },
  {
    name: "Canva",
    category: "Design",
    deal: "Free tier + Pro trial",
    price: "Free tier · Pro ~$13/mo",
    description: "Design anything — posters, decks, social posts — with built-in AI image and text tools.",
    details: [
      "Free: thousands of templates and basic AI design tools",
      "Pro: premium assets, background remover, brand kits, and more AI credits",
      "30-day free trial of Pro",
      "Heads up: Canva's free education program covers K-12 only, not college",
    ],
    url: "https://www.canva.com/education/",
    image: "images/canva.jpg",
    rating: { score: 4.0, count: 6130, source: "Trustpilot", url: "https://www.trustpilot.com/review/canva.com", checked: "2026-07-23" },
    pricing: "freemium",
    trial: true,
    popular: false,
    verified: false,
  },
  {
    name: "ChatGPT",
    category: "Writing",
    deal: "Free tier",
    price: "Free · Plus $20/mo",
    description: "The general-purpose assistant everyone knows. The free tier covers a lot of student use cases.",
    details: [
      "Free: full chat access with daily usage limits",
      "Plus: higher limits, stronger models, file uploads, and image generation",
      "No student discount currently — the free tier is the student play",
    ],
    url: "https://chatgpt.com/",
    image: "images/chatgpt.png",
    rating: { score: 1.2, count: 1094, source: "Trustpilot", url: "https://www.trustpilot.com/review/openai.com", checked: "2026-07-23" },
    pricing: "freemium",
    popular: true,
    verified: false,
  },
];
