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
  "creditos-automotrices": {
    title: "Auto credit engine",
    summary:
      "Calculation and validation of auto loans, with AI-assisted risk analysis.",
    context: "Built at a software development company for vehicle financing.",
    role: "Full Stack Developer",
    problem:
      "Every credit application had to be calculated and validated consistently, and the risk assessment needed support to make better-informed decisions.",
    contributions: [
      "Auto loan **calculation** engine",
      "**Validation** of applications before they are assessed",
      "**AI-assisted risk analysis** as part of the assessment",
    ],
    flow: [
      "Application",
      "Validation",
      "Calculation",
      "Risk analysis (AI)",
      "Result",
    ],
  },
  "subastas-tiempo-real": {
    title: "E-commerce with real-time auctions",
    summary:
      "Online store with auctions: concurrent bids, automatic closing and geolocated checkout.",
    context: "Built at a software development company.",
    role: "Full Stack Developer",
    problem:
      "Many people can bid on the same item at once: every bid must be recorded in order, the auction must close by itself when it expires, and the winner must be able to pay and receive the purchase.",
    contributions: [
      "Handling **concurrent bids** in real time",
      "**Automatic closing** of auctions",
      "**Geolocated checkout** for delivery",
    ],
    flow: [
      "Real-time bids",
      "Automatic closing",
      "Winner",
      "Geolocated checkout",
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

const experience = translate(es.experience, "role", {
  "Desarrollador Full Stack": {
    role: "Full Stack Developer",
    company: "Software development company",
    summary:
      "End-to-end web application development: interfaces, APIs, integrations and process automation.",
    highlights: [
      "Calculation and validation engine for **auto loans,** with AI-assisted risk analysis",
      "**E-commerce with real-time auctions:** concurrent bids, automatic closing and geolocated checkout",
      "**Automation** of invoices and settlements with Python, removing manual work",
      "Automatic image conversion to WebP and upload to **AWS S3** to speed up page loads",
    ],
  },
  "Tutor de desarrollo web": {
    role: "Web development tutor",
    summary:
      "Supporting students through their first steps in programming and web development.",
    highlights: ["Tutoring in **JavaScript, C#, HTML/CSS and MySQL**"],
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
