// English content. Only the text is translated: images, URLs, dates and
// technologies come from es.ts. content.test.ts checks that every item has
// its translation.
import { es, type Content } from "./es";

// Applies the translations to each item, matched by `key` (name, slug...).
const translate = <T, K extends keyof T>(
  items: T[],
  key: K,
  text: Record<string, Partial<T>>,
): T[] =>
  items.map((item) => {
    const translation = text[String(item[key])];
    if (!translation) {
      throw new Error(`Missing English text for "${String(item[key])}"`);
    }
    return { ...item, ...translation };
  });

const profile: Content["profile"] = {
  ...es.profile,
  jobTitle: "Web Developer",
  headline: "Systems and Computer Engineer | Web Developer",
  summary:
    "Web developer from El Salvador, focused on modern web applications and agentic development with AI: Claude Code, Codex, MCP and verification through automated tests.",
  intro:
    "I build robust **web solutions,** blending **efficient code** with **intuitive** and **creative design.** I believe programming goes beyond logic: it's a space to **innovate** and solve problems with **clever solutions.**",
};

const projects = translate(es.projects, "name", {
  Yamgurumi: {
    description:
      "Live amigurumi store with its own AI assistant, WhatsApp ordering and an admin panel.",
  },
  TechZone: {
    description:
      "Online tech store with a modern design and an admin dashboard.",
  },
  "IBG Arcade": {
    description:
      "Christian website with three games: classic tic-tac-toe and two quiz games.",
  },
  Pokédex: {
    description: "Web Pokédex powered by the PokeAPI.",
  },
  "Portafolio Académico": {
    name: "Academic Portfolio",
    description:
      "Academic project that sums up eleven weeks of coursework on the strategic management of business and technology resources.",
  },
});

const caseStudies = translate(es.caseStudies, "slug", {
  yamgurumi: {
    title: "Yamgurumi: a store with an AI assistant",
    summary:
      "A store for handmade amigurumi, live on its own domain: catalog, WhatsApp checkout, custom orders, customer accounts, a full admin panel and its own AI assistant that helps shoppers and recommends products.",
    context:
      "I built it end to end for a craft workshop in El Salvador with Next.js 16 (App Router and Server Actions), React 19, PostgreSQL and Prisma on Vercel. It's live at yamgurumi.com and in active development.",
    role: "Design, development, deployment and maintenance",
    problem:
      "A solo artisan needed to sell online with no payment gateway and no support team: show the catalog, take orders and custom requests, answer questions at any hour and run sales, inventory and customers from one place.",
    contributions: [
      "**Its own AI assistant**, instead of a third-party chat widget: it streams answers on **Gemini 3.5 Flash-Lite** from the store's real catalog, prices, shipping and FAQ, and recommends products the way a shop clerk would, with cards that link to each product",
      "**A chat built to sell:** quick questions, stop and retry, long conversations without breaking, and a handoff to WhatsApp with a ready greeting when a person is needed",
      "**Catalog:** categories and subcategories (a product can sit in several), filters, tags, in-stock or made-to-order availability, a product page with zoom, related products and reviews from verified purchases",
      "**Checkout without a gateway:** a bag with gift options (wrapping and card), base or keyring and coupons; the order is confirmed over WhatsApp with bank transfer payment, followed by a confirmation page, an email and public order tracking with no account needed",
      "**Custom and wholesale orders:** a public request form and, in the admin panel, a quote with the WhatsApp message ready to send",
      "**Customer accounts:** sign-up with email verification, password recovery, order history with a timeline, favorites, notifications and customer levels",
      "**Admin panel:** products with image upload and compression, categories, orders with a printable packing slip, custom orders, coupons, review moderation, users and roles, store settings, WhatsApp templates and a review of chat conversations",
      "**Reports and oversight:** daily sales, average ticket, best sellers, inventory turnover and coupon usage, plus an audit log; all exportable to Excel-ready CSV",
      "**Newsletter** with double opt-in, campaigns from the admin panel and one-click unsubscribe; transactional emails with React Email and Resend",
      "**Technical SEO:** per-page metadata and Open Graph, schema.org structured data, a sitemap and indexable category pages",
      "**3D hero** with React Three Fiber, loaded only where it's seen, and GSAP animations",
    ],
    decisions: [
      "**The AI only knows what's public:** the context is built from a closed list of store data; the model has no tools and no database access, and bank details never reach the prompt",
      "**Answers that keep shoppers in the store:** the chat only renders links to known store pages",
      "**Swappable provider:** the chat uses the OpenAI-compatible API, so the model (Gemini, Groq, Claude…) changes with environment variables alone",
      "**AI with a controlled cost:** per-visitor, burst and store-wide daily limits, an origin check, a trimmed history and a response timeout",
      "**Privacy:** shoppers are told before the conversation is saved, the name is optional and everything deletes itself after 90 days",
      "**The server decides:** prices in cents, stock and atomically redeemed coupons, and Zod validation in every Server Action",
      "**Secure accounts:** sessions checked against the database on every request, one-time tokens stored as hashes, responses that don't reveal which accounts exist and attempt limits with Upstash Redis",
      "**Safe images:** validated by content, re-encoded without EXIF metadata and stored in Vercel Blob",
    ],
    results: [
      "**Live** on its own domain: yamgurumi.com",
      "Help **at any hour** from its own assistant, with a handoff to a person over WhatsApp when needed",
      "The owner runs **sales, inventory, customers and content** from one panel",
      "Over **260 unit tests** plus Playwright **E2E** tests in CI, against a freshly migrated database",
    ],
    flow: [
      "Customer",
      "AI chat",
      "Recommendation",
      "Bag",
      "WhatsApp order",
      "Admin panel",
    ],
    link: {
      label: "Visit yamgurumi.com",
      url: "https://yamgurumi.com/",
    },
  },
  "financiamiento-automotriz": {
    title: "AI-powered auto loan calculator",
    summary:
      "Auto financing: it calculates the offer and the loan for each application from the vehicle's market value and the allowed rates, and uses AI to write a customer profile.",
    context:
      "Vehicle financing platform built with CodeIgniter 4 (PHP) and MySQL.",
    role: "Full Stack Developer",
    problem:
      "Every application arrives with documents and every lender has its own terms. All of that had to become a consistent offer and loan, within legal limits, plus a summary of the customer for the decision maker.",
    contributions: [
      "**Loan calculator:** offer based on the vehicle's market value, amount to finance with its associated costs and a monthly payment with the amortization formula",
      "**Configurable legal rates** by vehicle year, refreshed automatically",
      "**Per-lender settings** in the lender and admin views",
      "**AI customer narrative** from their documents, with an editable prompt and PDF download",
      "**AI document analysis** (OpenAI and Gemini) with an OCR fallback",
      "**Tabbed interface** with validations, approval states and contextual help for uploading each document",
    ],
    decisions: [
      "**Configurable rules, not hard-coded:** rates, terms and prompts are adjusted from the admin panel",
      "**The calculator doesn't guess:** if information is missing, it says what's missing instead of calculating with partial data",
      "**More than one way to read a document:** if one method fails, another takes over",
    ],
    results: [
      "From application to decision in one flow: **documents, valuation, loan and a PDF narrative**",
    ],
    flow: [
      "Documents",
      "AI reading",
      "Market value",
      "Allowed rate",
      "Offer and payment",
      "PDF narrative",
    ],
  },
  "marketplace-subastas": {
    title: "Marketplace with auctions",
    summary:
      "Buy-and-sell marketplace with auctions: safe concurrent bids, automatic closing, card payments and delivery pinned on a map.",
    context: "Marketplace with a Next.js frontend and a FastAPI API on MySQL.",
    role: "Full Stack Developer",
    problem:
      "Many people can bid on the same item at once: every bid must be validated without colliding with another, the auction must open and close by itself, and the winner must be able to pay without double charges and receive the purchase where they asked.",
    contributions: [
      "**Concurrent bids** with database row locking, validated inside a transaction",
      "**Scheduled jobs** that open and close auctions, pick the winner and keep orders up to date",
      "**Card payments** integrated with a payment gateway, with an audit log",
      "**Map-based checkout:** the buyer pins the delivery point and the address fills itself in",
      "Transactional emails, notifications, JWT and Google sign-in, ratings and an admin dashboard",
    ],
    decisions: [
      "**The database orders the bids:** row locking handles concurrency with no extra services",
      "**Closing doesn't depend on visits:** it happens on time even if nobody is on the page",
      "**Idempotent payments:** a retry never creates a second charge",
    ],
    results: [
      "The whole flow on one platform: **list, bid, win, pay and receive**",
    ],
    flow: [
      "Bid",
      "Automatic closing",
      "Winner and email",
      "Card payment",
      "Delivery on the map",
    ],
  },
  "portafolio-agentico": {
    title: "This portfolio, built with agentic development",
    summary:
      "A site full of animation that stays fast, accessible and indexable, built alongside AI agents and verified on every change.",
    context:
      "My personal portfolio: React, TypeScript, Vite, Tailwind CSS v4, GSAP and Three.js, deployed on Vercel.",
    role: "Design, development and maintenance",
    problem:
      "Coding with AI agents is fast, but without context or verification changes break things and nobody notices. On top of that, a site this animated risks being slow, inaccessible or invisible to search engines.",
    contributions: [
      "Working with **Claude Code** guided by rules, memory and **custom skills**: plan first, one branch per task, conventional commits and a manual test guide",
      "Connecting the agent to tools through **MCP**",
      "A single content source that generates the **static HTML**, JSON-LD, **/llms.txt**, /index.md and the sitemap at build time",
    ],
    decisions: [
      "**Tests as the agent's safety net:** every change runs through Vitest and Playwright before the commit and again in CI",
      "**Accessibility measured, not assumed:** axe audits inside the E2E tests",
      "**Animations that don't cost:** they pause off screen and respect reduced motion",
      "**Secure by default:** strict Content Security Policy and HTTP security headers",
    ],
    results: [
      "Over **200 automated tests** on every commit",
      "Full content **indexable without JavaScript**, also for AI models",
      "**Light and dark mode**, with accessibility verified by axe",
    ],
    flow: [
      "Plan",
      "Agent + skills and MCP",
      "Code",
      "Tests (Vitest, Playwright, axe)",
      "CI",
      "Vercel",
    ],
    link: {
      label: "See the code on GitHub",
      url: "https://github.com/carlosBenitez0/carlos-benitez-portfolio",
    },
  },
});

const about: Content["about"] = {
  paragraphs: [
    "I'm Carlos Benítez, a **web developer** with a background in **Systems and Computer Engineering.** I focus on building **modern web applications** that pair **careful design** with **solid architecture.**",
    "My experience ranges from building **dynamic interfaces** with [[React]] / [[Next.js]] to crafting efficient APIs with [[Python]] / [[FastAPI]]. I'm especially interested in connecting **frontend** and **backend** to deliver smooth experiences.",
    "Today much of my work is **agentic development:** I code alongside **AI agents** and pick the right tool for each task. With **harness engineering** I give them the **right context** (rules, memory and skills), connect them to tools through **MCP** and verify every change with **automated tests.** That's how I optimized this portfolio, which now has over 200 tests.",
  ],
};

const experience = translate(es.experience, "company", {
  "Uassist.me": {
    role: "Full Stack Web Developer",
    summary:
      "Building and maintaining web applications and sites: new features, integrations and AI-powered process automation.",
    highlights: [
      "**Process automation** with **n8n** workflows and AI models",
      "Integrating forms with **CRM** and **analytics**",
      "Web **SEO** and **performance** optimization",
    ],
  },
  "Web Informática S.A. de C.V.": {
    role: "Full Stack Web Developer",
    summary:
      "Full stack development of client platforms: interfaces, APIs, payments and AI service integration.",
    highlights: [
      "**Auto loan calculator:** offer and payment from the vehicle's market value, AI document analysis and a PDF customer narrative",
      "**Marketplace with auctions:** safe concurrent bids, automatic closing, card payments and delivery pinned on a map",
      "**Interfaces for complex financial data:** tabbed workflows, approval states and tooltips that guide document uploads",
      "Turning clients' **business rules** into clear admin tools",
    ],
  },
  "DYGAV · Digitalización y Gestión de Alquileres Vacacionales": {
    role: "Full Stack Web Developer (internship)",
    company: "DYGAV · Vacation rental digitalization and management",
    summary: "Process automation and frontend for a vacation rental platform.",
    highlights: [
      "**Automation** of invoices and settlements with Python scripts from raw data, removing manual work",
      "Automatic image conversion to **WebP** and upload to **AWS S3** to lighten the site",
      "**Figma** prototypes turned into Next.js and TypeScript interfaces",
      "**Messaging** automation through APIs",
    ],
  },
  "La Nevería": {
    role: "Frontend Developer (freelance)",
    summary: "Inventory and sales management system.",
    highlights: [
      "**UX/UI** design of the inventory and sales interface, built to record every transaction quickly",
    ],
  },
  "Programa Estudiante Tutor · UNAB": {
    role: "Web development tutor",
    company: "Student Tutor Program · UNAB",
    summary: "Mentoring students at Universidad Doctor Andrés Bello.",
    highlights: [
      "Tutoring in **JavaScript, C#, HTML/CSS and MySQL**: programming logic, page layout and relational database design",
    ],
  },
});

const technologyCategories: Content["technologyCategories"] = {
  frontend: "Frontend",
  backend: "Backend",
  learning: "Learning",
  tools: "Tools",
};

const ai: Content["ai"] = {
  intro:
    "AI is at the core of how I build software: I work with coding agents that plan, edit code and run tests, and with assistants for research, design and review. These are the tools I use every day.",
  tools: translate(es.ai.tools, "nombre", {
    "Claude Code": {
      descripcion:
        "Anthropic's coding agent that works from the terminal: it understands the repository, edits code, runs tests and prepares commits.",
      beneficios: [
        "Multi-step tasks across the whole project",
        "Per-project rules, memory and skills",
        "Integration with MCP, Git and GitHub",
      ],
    },
    Claude: {
      descripcion:
        "Anthropic's AI assistant, built for reasoning and analyzing complex problems.",
      beneficios: [
        "Code analysis and explanation",
        "Structured answers for complex tasks",
        "Support with architecture and refactoring",
      ],
    },
    Codex: {
      descripcion:
        "OpenAI's coding agent, available in the terminal and in the cloud, that implements changes and reviews code.",
      beneficios: [
        "End-to-end implementation of changes",
        "Code review with suggested improvements",
        "Parallel work on several tasks",
      ],
    },
    "GitHub Copilot": {
      descripcion:
        "Coding assistant built into the editor, with real-time code suggestions.",
      beneficios: [
        "Context-aware code completion",
        "Integration with the most popular editors",
        "Chat and agent mode inside the editor",
      ],
    },
    ChatGPT: {
      descripcion:
        "OpenAI's AI assistant for generating code, solving problems and explaining concepts.",
      beneficios: [
        "Detailed, contextual answers",
        "Support for many programming languages",
        "Help with debugging and learning",
      ],
    },
    Gemini: {
      descripcion:
        "Google's multimodal model that understands and generates text, code and images.",
      beneficios: [
        "Multimodal capabilities",
        "Integration with the Google ecosystem",
        "Large context window",
      ],
    },
  }),
  studyAreas: translate(es.ai.studyAreas, "nombre", {
    "Agentes de IA": {
      nombre: "AI agents",
      descripcion: "Agents that plan, edit code and run multi-step tasks",
    },
    "Context Engineering": {
      descripcion:
        "Rules, memory and skills: the right context for the AI at every step",
    },
    MCP: {
      descripcion:
        "Model Context Protocol: connecting AI models to tools and data",
    },
    "Evals y verificación": {
      nombre: "Evals and verification",
      descripcion: "Tests and evaluations that prove the generated code works",
    },
  }),
};

export const en: Content = {
  profile,
  projects,
  caseStudies,
  about,
  experience,
  technologyCategories,
  ai,
};
