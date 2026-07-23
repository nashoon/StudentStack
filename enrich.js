// ============================================================
// EDITORIAL ENRICHMENT — merged into DEALS by slug at load time.
// Loaded after deals.js, before app.js (all three pages).
//
// deals.js stays the fact-checked catalog (prices, limits, deals);
// this file holds the editorial layer:
//   useCases  — "How students use it" bullets on the deal page
//   bestFor   — one-line qualitative fit, shown under the tagline
//   shots     — extra page URLs rendered as live screenshots in the
//               gallery (pricing/features/education pages). Live shots
//               occasionally catch a vendor's bot-challenge page — the
//               tradeoff of real screenshots over stock images.
//   image     — hero image (official og/press image, downloaded)
//   screenshot— true adds a live screenshot of deal.url to the visuals
//   impact    — a REAL, cited study only. Never an invented number.
//               { text, source, url } — rendered with the source link.
//               Tools with no published study get no impact block.
// ============================================================

const ENRICH = {
  "github-student-developer-pack": {
    bestFor: "CS students and anyone shipping code for class",
    useCases: [
      "Ship class projects with Copilot autocompleting boilerplate in VS Code",
      "Use the bundled cloud credits to host your capstone or hackathon build",
      "Grab the free domain + site hosting for your portfolio before recruiting season",
    ],
    shots: ["https://github.com/features/copilot", "https://github.com/education"],
    impact: {
      text: "In a controlled experiment, developers using GitHub Copilot (included in this pack) finished a coding task 55.8% faster than the control group (n=95).",
      source: "Peng et al., 2023 — arXiv",
      url: "https://arxiv.org/abs/2302.06590",
    },
  },
  "notion": {
    bestFor: "Running your whole semester from one workspace",
    useCases: [
      "One page per course: syllabus, lecture notes, readings, and deadlines together",
      "Share a group-project workspace so everyone edits the same plan",
      "Start from student templates (semester dashboard, thesis tracker) instead of a blank page",
    ],
    shots: ["https://www.notion.com/pricing", "https://www.notion.com/templates"],
  },
  "perplexity": {
    bestFor: "Research where you need to see where facts came from",
    useCases: [
      "Scope a paper topic and follow the inline citations to real sources",
      "Fact-check a claim and get the link, not just an answer",
      "Compare how different sources frame the same question before you write",
    ],
    shots: ["https://www.perplexity.ai/pro", "https://www.perplexity.ai/hub"],
  },
  "grammarly": {
    bestFor: "The final proofread on essays and emails",
    useCases: [
      "Run the final pass on an essay for grammar, clarity, and wordiness",
      "Tone-check emails to professors before you hit send",
      "Catch the small stuff spellcheck misses — duplicated words, dangling commas",
    ],
    shots: ["https://www.grammarly.com/plans", "https://www.grammarly.com/grammar-check"],
  },
  "quizlet": {
    bestFor: "Exam prep by self-testing, not re-reading",
    screenshot: true,
    useCases: [
      "Turn lecture notes into a flashcard set and drill the ones you miss",
      "Take a practice test the night before instead of re-reading the chapter",
      "Play Quizlet Live with your study group to make review less painful",
    ],
    shots: ["https://quizlet.com/upgrade", "https://quizlet.com/live"],
    impact: {
      text: "Self-testing with flashcards (retrieval practice) and spacing reviews over days are the two study techniques rated most effective in a major research review — the methods this app is built on.",
      source: "Dunlosky et al., 2013 — Psychological Science in the Public Interest",
      url: "https://doi.org/10.1177/1529100612453266",
    },
  },
  "otter-ai": {
    bestFor: "Lecture-heavy courses where typing can't keep up",
    useCases: [
      "Record a lecture (with permission) and get a searchable transcript",
      "Skim the AI summary before the exam instead of re-listening to audio",
      "Transcribe interviews for journalism, research, or club projects",
    ],
    shots: ["https://otter.ai/pricing", "https://otter.ai"],
  },
  "gamma": {
    bestFor: "Last-minute presentation decks",
    screenshot: true,
    useCases: [
      "Paste an essay outline and get a designed deck in minutes",
      "Generate a first-draft presentation, then just fix the content",
      "Share the deck as a live webpage instead of emailing a file",
    ],
    shots: ["https://gamma.app/pricing"],
  },
  "wolfram-alpha-pro": {
    bestFor: "STEM problem sets — the steps, not just the answer",
    useCases: [
      "Check your problem-set work against step-by-step solutions",
      "Photograph handwritten math and get it solved with steps",
      "Generate practice problems with hints before a calc or physics exam",
    ],
    shots: ["https://www.wolframalpha.com", "https://www.wolframalpha.com/pro"],
  },
  "speechify": {
    bestFor: "Getting through long readings by ear",
    screenshot: true,
    useCases: [
      "Listen to assigned readings on your commute or at the gym",
      "Speed-listen at 2–3x to review material you've already read once",
      "Scan printed handouts and have them read aloud",
    ],
    shots: ["https://speechify.com/pricing"],
  },
  "zotero": {
    bestFor: "Papers with real bibliographies",
    useCases: [
      "Save any source in one click with the browser connector",
      "Auto-generate citations and the bibliography inside Docs or Word",
      "Keep a shared group library for team research projects",
    ],
    shots: ["https://www.zotero.org/download", "https://www.zotero.org/groups"],
  },
  "canva": {
    bestFor: "Design without learning design tools",
    useCases: [
      "Make club posters and event flyers from templates in minutes",
      "Build presentation decks that don't look like default slides",
      "Design once, then resize the same graphic for Instagram, print, and slides",
    ],
    shots: ["https://www.canva.com/pricing", "https://www.canva.com/templates"],
  },
  "chatgpt": {
    bestFor: "The all-purpose explainer",
    screenshot: true,
    useCases: [
      "Have a confusing concept re-explained three different ways until it clicks",
      "Outline and draft writing, then edit it into your own voice (check your school's AI policy)",
      "Paste an error message and debug your code interactively",
    ],
    shots: ["https://openai.com/chatgpt/pricing"],
    impact: {
      text: "In a randomized experiment on professional writing tasks, ChatGPT users finished about 40% faster with higher-rated output quality (n=453).",
      source: "Noy & Zhang, 2023 — Science",
      url: "https://doi.org/10.1126/science.adh2586",
    },
  },
  "claude": {
    bestFor: "Long documents and careful writing help",
    image: "images/claude.jpg",
    screenshot: true,
    useCases: [
      "Upload a long PDF or reading packet and question it chapter by chapter",
      "Get essay feedback that engages with your argument, not just your grammar",
      "Work through coding assignments with explanations of the why, not just the fix",
    ],
    shots: ["https://claude.com/pricing", "https://www.anthropic.com/education"],
  },
  "google-gemini": {
    bestFor: "Research reports and Google-ecosystem coursework",
    useCases: [
      "Run a Deep Research report to get a sourced overview of a new topic",
      "Draft and refine essays right inside Gmail and Google Docs",
      "Generate diagrams-to-notes summaries from lecture images",
    ],
    shots: ["https://gemini.google", "https://gemini.google/subscriptions", "https://gemini.google/students"],
  },
  "cursor": {
    bestFor: "CS students who live in their editor",
    screenshot: true,
    useCases: [
      "Refactor a messy class project by describing the change in chat",
      "Let Tab autocomplete the boilerplate while you focus on the logic",
      "Point the agent at failing tests and review its proposed fix",
    ],
    shots: ["https://cursor.com/pricing", "https://cursor.com/features"],
  },
  "overleaf": {
    bestFor: "STEM papers and thesis writing",
    screenshot: true,
    useCases: [
      "Write lab reports and problem sets in LaTeX with zero local setup",
      "Collaborate on a paper in real time with your advisor or teammates",
      "Start from journal, thesis, and CV templates instead of raw LaTeX",
    ],
    shots: ["https://www.overleaf.com/user/subscription/plans", "https://www.overleaf.com/learn"],
  },
  "quillbot": {
    bestFor: "Rewriting clunky sentences",
    screenshot: true,
    useCases: [
      "Paraphrase your own awkward sentences until they read cleanly (rewrite your work — don't launder someone else's)",
      "Summarize long readings into skimmable notes",
      "Run a grammar pass on essays written in a hurry",
    ],
    shots: ["https://quillbot.com", "https://quillbot.com/summarize"],
  },
  "figma": {
    bestFor: "Design-minded students and student startups",
    screenshot: true,
    useCases: [
      "Mock up your club's app or startup idea with real UI components",
      "Brainstorm on a FigJam board during group-project meetings",
      "Build the design portfolio that gets you the internship",
    ],
    shots: ["https://www.figma.com/pricing", "https://www.figma.com"],
  },
  "notebooklm": {
    bestFor: "Turning your own course materials into a tutor",
    image: "images/notebooklm.png",
    useCases: [
      "Upload the semester's PDFs and slides, then ask questions grounded only in them",
      "Generate an Audio Overview and revise by listening like a podcast",
      "Auto-build study guides and quizzes from your actual lecture notes",
    ],
    shots: ["https://notebooklm.google", "https://support.google.com/notebooklm"],
  },
  "deepl": {
    bestFor: "Reading sources in languages you don't speak",
    image: "images/deepl.png",
    useCases: [
      "Translate foreign-language papers and primary sources for research",
      "Draft messages in another language and check the register with DeepL Write",
      "Translate whole PDFs while keeping the document layout",
    ],
    shots: ["https://www.deepl.com/translator", "https://www.deepl.com/write"],
  },
  "knowt": {
    bestFor: "Quizlet-style studying without the paywall",
    image: "images/knowt.png",
    screenshot: true,
    useCases: [
      "Upload lecture notes or a PDF and get flashcards built for you",
      "Use Learn mode and practice tests free — the modes Quizlet now charges for",
      "Import your old Quizlet sets and keep studying where you left off",
    ],
    shots: ["https://knowt.com/plans"],
    impact: {
      text: "Self-testing with flashcards (retrieval practice) and spacing reviews over days are the two study techniques rated most effective in a major research review — the methods this app is built on.",
      source: "Dunlosky et al., 2013 — Psychological Science in the Public Interest",
      url: "https://doi.org/10.1177/1529100612453266",
    },
  },
  "thea": {
    bestFor: "Free AI study sets while it lasts",
    image: "images/thea.png",
    screenshot: true,
    useCases: [
      "Upload a PDF and get flashcards, a study guide, and practice questions in one shot",
      "Paste a YouTube lecture link and study from it like a document",
      "Run adaptive quizzes that focus on what you keep missing",
    ],
    shots: ["https://www.theastudy.com"],
  },
  "notesxp": {
    bestFor: "iPhone/iPad studying from photos of your notes",
    image: "images/notesxp.png",
    screenshot: true,
    useCases: [
      "Photograph textbook pages and turn them into structured notes",
      "Record a lecture and get flashcards and a mind map from it",
      "Study offline on iPad with everything synced through iCloud",
    ],
    shots: ["https://apps.apple.com/us/app/notesxp-ai-study-guide/id6741755234"],
  },
  "mindomax": {
    bestFor: "Free spaced-repetition while the promo lasts",
    screenshot: true,
    useCases: [
      "Upload a PDF or lecture audio and get flashcards automatically",
      "Let spaced repetition schedule which cards you see each day",
      "Use the LaTeX editor for math and chemistry cards",
    ],
    shots: ["https://www.mindomax.com/price", "https://apps.apple.com/us/app/id6754225657"],
    impact: {
      text: "Self-testing with flashcards (retrieval practice) and spacing reviews over days are the two study techniques rated most effective in a major research review — the methods this app is built on.",
      source: "Dunlosky et al., 2013 — Psychological Science in the Public Interest",
      url: "https://doi.org/10.1177/1529100612453266",
    },
  },
  "brainden": {
    bestFor: "Turning lectures into a full study kit",
    image: "images/brainden.png",
    screenshot: true,
    useCases: [
      "Record a lecture and get notes, flashcards, and a quiz from one upload",
      "Use Feynman mode: explain the concept back and get gaps pointed out",
      "Turn a YouTube video into a mind map before the exam",
    ],
    shots: ["https://apps.apple.com/us/app/id6757434859"],
  },
  "solvo": {
    bestFor: "Homework help from your phone camera",
    screenshot: true,
    useCases: [
      "Scan a math problem and follow the step-by-step solution",
      "Use the steps to find where your own attempt went wrong",
      "Drill AI flashcards for quiz prep between classes",
    ],
    shots: ["https://apps.apple.com/us/app/id6447069698"],
  },
  "flashrecall": {
    bestFor: "Flashcards from any source, drilled on a schedule",
    image: "images/flashrecall.png",
    screenshot: true,
    useCases: [
      "Paste notes, PDFs, or a YouTube link and get a deck built for you",
      "Let spaced repetition resurface cards right before you'd forget them",
      "Study offline on your phone with decks synced across devices",
    ],
    shots: ["https://apps.apple.com/us/app/id6746757085"],
    impact: {
      text: "Self-testing with flashcards (retrieval practice) and spacing reviews over days are the two study techniques rated most effective in a major research review — the methods this app is built on.",
      source: "Dunlosky et al., 2013 — Psychological Science in the Public Interest",
      url: "https://doi.org/10.1177/1529100612453266",
    },
  },
};
