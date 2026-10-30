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
      "A store for handmade amigurumi, live on its own domain: catalog, WhatsApp ordering, customer accounts, a full admin panel and its own AI assistant that recommends products.",
    context:
      "Built end to end for a craft workshop in El Salvador with Next.js 16, React 19, PostgreSQL and Prisma on Vercel. It's live and in active development.",
    role: "Design, development and deployment",
    problem:
      "A solo artisan needed to sell online with no payment gateway and no support team: show the catalog, take orders and custom requests, answer questions at any hour and run everything from one place.",
    contributions: [
      "**Its own AI assistant:** a streaming chat on **Gemini 3.5 Flash-Lite** that answers from the store's real catalog and policies, recommends products as cards and hands the conversation to WhatsApp when a person is needed",
      "**Admin panel:** products, categories, orders, custom requests, coupons, reviews, users, newsletter, CSV-exportable reports, an audit log and a review of chat conversations",
      "**Checkout without a gateway:** bag, prices and coupons computed on the server, and orders confirmed over WhatsApp with bank transfer payment",
      "**Customer accounts:** sign-up with email verification, password recovery, favorites, notifications, order tracking and customer levels",
      "**3D hero** with React Three Fiber and GSAP animations",
    ],
    decisions: [
      "**The AI only knows what's public:** the server builds the context from the catalog and the store's public data; the model has no tools and no database access",
      "**Swappable provider:** the chat uses the OpenAI-compatible API, so the model (Gemini, Groq, Claude…) changes with environment variables alone",
      "**AI with limits:** per-visitor, burst and store-wide daily limits, an origin check and a response timeout",
      "**Privacy:** visitors are told before the conversation is saved, and it deletes itself after 90 days",
      "**The server decides:** prices in cents, stock and atomically redeemed coupons, and sessions checked against the database on every request",
      "**Safe images:** validated by content and re-encoded without EXIF metadata",
    ],
    results: [
      "**Live** on its own domain: yamgurumi.com",
      "Over **260 unit tests** plus Playwright **E2E** tests in CI",
      "Help at any hour, with a handoff to a person over WhatsApp",
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
