// ============================================================
// DEALS CATALOG
//
// IMPORTANT: This is SAMPLE data to show the site working.
// Before launch, verify every offer on the company's own site
// and set verified: true. Replace each url with your affiliate
// link once you've joined that company's program.
//
// Fields:
//   popular  — true = shows on the homepage "Popular deals" view
//   pricing  — "free"     = genuinely free for students
//              "freemium" = has a real free tier
//              "trial"    = free trial of a paid plan
//              "discount" = paid, but discounted for students
//              (free/freemium/trial also appear in the Free section)
//   trial      — true = also has a free trial of a paid plan
//   screenshot — true = show a live screenshot of the tool's site.
//                Opt-in only: many sites serve screenshot services a
//                "verify you are human" page, so only enable it after
//                checking the preview actually looks right.
//   image      — optional, beats everything. A usage demo (PNG or GIF)
//                saved from the vendor's official press/media kit into
//                images/, e.g. image: "images/notion-demo.gif"
//   (cards without screenshot/image get a clean branded logo tile)
// ============================================================

const DEALS = [
  {
    name: "GitHub Student Developer Pack",
    category: "Coding",
    deal: "Free with a school email",
    description: "GitHub Copilot Pro plus dozens of dev tools, free while you're a student. The single best student bundle on the internet.",
    url: "https://education.github.com/pack",
    image: "images/github.png",
    pricing: "free",
    popular: true,
    screenshot: true,
    verified: false,
  },
  {
    name: "Notion",
    category: "Productivity",
    deal: "Free Plus plan for students",
    description: "Notes, docs, and planning with Notion AI available as an add-on. The education plan is free with a school email.",
    url: "https://www.notion.so/students",
    image: "images/notion.png",
    pricing: "free",
    popular: true,
    screenshot: true,
    verified: false,
  },
  {
    name: "Perplexity",
    category: "Research",
    deal: "Student offer",
    description: "AI answer engine with cited sources — great for research without the hallucinated citations. Runs student promotions on Pro.",
    url: "https://www.perplexity.ai/",
    image: "images/perplexity.jpg",
    pricing: "discount",
    popular: true,
    verified: false,
  },
  {
    name: "Grammarly",
    category: "Writing",
    deal: "Free tier + education plans",
    description: "Grammar, tone, and clarity checking everywhere you write. Solid free tier; some schools cover Premium.",
    url: "https://www.grammarly.com/edu",
    image: "images/grammarly.png",
    pricing: "freemium",
    popular: true,
    verified: false,
  },
  {
    name: "Quizlet",
    category: "Studying",
    deal: "Free tier + Plus discount",
    description: "Flashcards and practice tests with AI-generated study modes from your own notes.",
    url: "https://quizlet.com/",
    pricing: "freemium",
    popular: true,
    verified: false,
  },
  {
    name: "Otter.ai",
    category: "Productivity",
    deal: "Education discount",
    description: "Records and transcribes lectures in real time, then gives you an AI summary and searchable notes.",
    url: "https://otter.ai/education",
    image: "images/otter.png",
    pricing: "discount",
    popular: false,
    verified: false,
  },
  {
    name: "Gamma",
    category: "Design",
    deal: "Generous free tier",
    description: "Generates full slide decks from a prompt. The fastest way to turn an outline into a presentation.",
    url: "https://gamma.app/",
    image: "images/gamma.png",
    pricing: "freemium",
    popular: false,
    verified: false,
  },
  {
    name: "Wolfram|Alpha Pro",
    category: "Studying",
    deal: "Student pricing",
    description: "Step-by-step math solutions, not just answers. Discounted Pro plan for students.",
    url: "https://www.wolframalpha.com/pro/pricing/students",
    image: "images/wolfram.png",
    pricing: "discount",
    popular: false,
    verified: false,
  },
  {
    name: "Speechify",
    category: "Studying",
    deal: "Free tier",
    description: "Turns readings and PDFs into natural-sounding audio so you can get through them faster.",
    url: "https://speechify.com/",
    image: "images/speechify.jpg",
    pricing: "freemium",
    popular: false,
    verified: false,
  },
  {
    name: "Zotero",
    category: "Research",
    deal: "100% free",
    description: "The standard tool for collecting sources and generating citations. Free and open source, with AI plugins available.",
    url: "https://www.zotero.org/",
    pricing: "free",
    popular: false,
    screenshot: true,
    verified: false,
  },
  {
    name: "Canva",
    category: "Design",
    deal: "Education offer",
    description: "Design anything — posters, decks, social posts — with built-in AI image and text tools.",
    url: "https://www.canva.com/education/",
    image: "images/canva.jpg",
    pricing: "free",
    trial: true,
    popular: false,
    verified: false,
  },
  {
    name: "ChatGPT",
    category: "Writing",
    deal: "Free tier",
    description: "The general-purpose assistant everyone knows. The free tier covers a lot of student use cases.",
    url: "https://chatgpt.com/",
    image: "images/chatgpt.png",
    pricing: "freemium",
    popular: true,
    verified: false,
  },
];
