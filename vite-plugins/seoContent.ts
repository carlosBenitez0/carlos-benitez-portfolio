import type { Plugin } from "vite";
import { SITE_URL, content, links, technologies } from "../src/content/site";
import type { Locale } from "../src/i18n/locale";
import { LOCALES, localePath } from "../src/i18n/locale";
import { ui } from "../src/i18n/ui";
import { formatProjectDate } from "../src/utils/projectDate";
import { plainText } from "../src/utils/richText";

// Genera en el build, a partir de src/content, para cada idioma (es en "/",
// en en "/en/"):
// - HTML semántico dentro de #root, para buscadores y agentes que no ejecutan
//   JavaScript (React lo reemplaza al montar).
// - JSON-LD (Person + WebSite) para resultados enriquecidos.
// - llms.txt (https://llmstxt.org, v2) e index.md: la página en Markdown.
// - en/index.html: la página en inglés, con sus metadatos.
// - /sitemap.xml con las dos versiones enlazadas por hreflang.

const absolute = (path: string) => new URL(path, SITE_URL).href;

const pageUrl = (lang: Locale) => absolute(localePath[lang]);

const cvUrl = absolute(links.cv);

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Textos propios de estos archivos (el resto viene de src/content y src/i18n)
const LABELS = {
  es: {
    pageNote: (name: string, headline: string, location: string, url: string) =>
      `Portafolio personal (en español, también en inglés en ${absolute("/en/")}) de ${name}, ${headline}, en ${location}. Para contactarlo: formulario en ${url}#contact o LinkedIn.`,
    profile: "Perfil",
    markdown: "Portafolio completo en Markdown",
    markdownNote:
      "sobre mí, experiencia, casos de estudio, proyectos, tecnologías, uso de IA y contacto",
    cvNote: "experiencia, formación y habilidades",
    linkedinNote: "perfil profesional",
    githubNote: "código de sus proyectos",
    repo: "Código de este portafolio",
    repoNote:
      "React 19, TypeScript, Vite, Tailwind CSS v4 y GSAP, con tests de Vitest y Playwright",
    date: "Fecha",
    state: "Estado",
    stack: "Tecnologías",
    code: "Código",
    role: "Rol",
    contact: "Contacto",
    form: "Formulario",
    agentic: "Desarrollo agéntico",
  },
  en: {
    pageNote: (name: string, headline: string, location: string, url: string) =>
      `Personal portfolio (in English; the original is in Spanish at ${SITE_URL}) of ${name}, ${headline}, based in ${location}. To get in touch: form at ${url}#contact or LinkedIn.`,
    profile: "Profile",
    markdown: "Full portfolio in Markdown",
    markdownNote:
      "about, experience, case studies, projects, technologies, AI usage and contact",
    cvNote: "experience, education and skills (in Spanish)",
    linkedinNote: "professional profile",
    githubNote: "source code of his projects",
    repo: "Source code of this portfolio",
    repoNote:
      "React 19, TypeScript, Vite, Tailwind CSS v4 and GSAP, tested with Vitest and Playwright",
    date: "Date",
    state: "Status",
    stack: "Technologies",
    code: "Code",
    role: "Role",
    contact: "Contact",
    form: "Form",
    agentic: "Agentic development",
  },
} satisfies Record<Locale, unknown>;

// Metadatos del <head> de cada idioma. Los de español son los de index.html;
// en/index.html se genera reemplazándolos.
const META = {
  es: {
    title: "Carlos Benítez | Desarrollador Web y Desarrollo Agéntico con IA",
    description:
      "Portafolio de Carlos Benítez, desarrollador web en El Salvador: aplicaciones web modernas y desarrollo agéntico con IA (Claude Code, Codex, MCP).",
    socialDescription:
      "Desarrollador web: aplicaciones modernas y desarrollo agéntico con IA (Claude Code, Codex, MCP).",
    imageAlt: "Carlos Benítez, desarrollador web y desarrollo agéntico con IA",
    ogLocale: "es_SV",
  },
  en: {
    title: "Carlos Benítez | Web Developer and Agentic Development with AI",
    description:
      "Portfolio of Carlos Benítez, web developer in El Salvador: modern web applications and agentic development with AI (Claude Code, Codex, MCP).",
    socialDescription:
      "Web developer: modern applications and agentic development with AI (Claude Code, Codex, MCP).",
    imageAlt: "Carlos Benítez, web developer and agentic development with AI",
    ogLocale: "en_US",
  },
} satisfies Record<Locale, unknown>;

const text = (lang: Locale) => {
  const c = content[lang];
  const u = ui[lang];
  const l = LABELS[lang];
  const url = pageUrl(lang);

  const technologyGroups = () =>
    Object.entries(technologies).map(([key, items]) => ({
      title: c.technologyCategories[key] ?? key,
      items,
    }));

  type Job = (typeof c.experience)[number];
  const jobTitle = (job: Job) =>
    [
      `${job.role} · ${job.company}`,
      job.date && formatProjectDate(job.date, lang),
    ]
      .filter(Boolean)
      .join(" · ");

  type Case = (typeof c.caseStudies)[number];
  const caseUrl = (cs: Case) => `${url}#caso-${cs.slug}`;

  // Apartados con contenido, en texto plano (sin las marcas)
  const caseSections = (cs: Case) =>
    (
      [
        [u.cases.contributions, cs.contributions],
        [u.cases.decisions, cs.decisions],
        [u.cases.results, cs.results],
      ] as const
    )
      .filter(([, items]) => items.length > 0)
      .map(([title, items]) => ({ title, items: items.map(plainText) }));

  type Project = (typeof c.projects)[number];
  const projectNotes = (project: Project) =>
    [
      project.description,
      project.date && `${l.date}: ${formatProjectDate(project.date, lang)}.`,
      `${l.state}: ${u.projects.state[project.state]}.`,
      `${l.stack}: ${project.technologies.join(", ")}.`,
      project.gitHub && `${l.code}: ${project.gitHub}`,
    ]
      .filter(Boolean)
      .join(" ");

  return {
    c,
    u,
    l,
    url,
    technologyGroups,
    jobTitle,
    caseUrl,
    caseSections,
    projectNotes,
  };
};

const filePath = (lang: Locale, name: string) =>
  `${localePath[lang]}${name}`.slice(1);

export const buildLlmsTxt = (lang: Locale = "es") => {
  const { c, u, l, url, caseUrl, projectNotes } = text(lang);
  return [
    `# ${c.profile.name}`,
    "",
    `> ${c.profile.summary}`,
    "",
    l.pageNote(c.profile.fullName, c.profile.headline, c.profile.location, url),
    "",
    `## ${l.profile}`,
    "",
    `- [${l.markdown}](${absolute(`/${filePath(lang, "index.md")}`)}): ${l.markdownNote}`,
    `- [${u.nav.cv}](${cvUrl}): ${l.cvNote}`,
    `- [LinkedIn](${links.linkedin}): ${l.linkedinNote}`,
    `- [GitHub](${links.github}): ${l.githubNote}`,
    `- [${u.sections.experience}](${url}#experience): ${c.experience.map((job) => `${job.role} (${job.company})`).join("; ")}`,
    "",
    `## ${u.sections.cases}`,
    "",
    ...c.caseStudies.map(
      (cs) => `- [${cs.title}](${caseUrl(cs)}): ${cs.summary}`,
    ),
    "",
    `## ${u.sections.projects}`,
    "",
    ...c.projects.map((p) => `- [${p.name}](${p.url}): ${projectNotes(p)}`),
    "",
    "## Optional",
    "",
    `- [${l.repo}](${links.repo}): ${l.repoNote}`,
    "",
  ].join("\n");
};

export const buildIndexMd = (lang: Locale = "es") => {
  const { c, u, l, url, technologyGroups, jobTitle, caseUrl, caseSections } =
    text(lang);
  return [
    `# ${c.profile.name} | ${c.profile.jobTitle}`,
    "",
    `> ${c.profile.summary}`,
    "",
    `**${c.profile.headline}** · ${c.profile.location}`,
    "",
    plainText(c.profile.intro),
    "",
    `## ${u.sections.about}`,
    "",
    ...c.about.paragraphs.flatMap((p) => [plainText(p), ""]),
    `## ${u.sections.cases}`,
    "",
    ...c.caseStudies.flatMap((cs) => [
      `### [${cs.title}](${caseUrl(cs)})`,
      "",
      `${cs.context} ${l.role}: ${cs.role}.`,
      "",
      `**${u.cases.problem}:** ${cs.problem}`,
      "",
      `**${u.cases.flow}:** ${cs.flow.join(" → ")}`,
      "",
      ...caseSections(cs).flatMap((section) => [
        `**${section.title}:**`,
        "",
        ...section.items.map((item) => `- ${item}`),
        "",
      ]),
      ...(cs.link ? [`${cs.link.label}: ${cs.link.url}`, ""] : []),
    ]),
    `## ${u.sections.projects}`,
    "",
    ...c.projects.flatMap((p) => [
      `### [${p.name}](${p.url})`,
      "",
      p.description,
      "",
      ...(p.date ? [`- ${l.date}: ${formatProjectDate(p.date, lang)}`] : []),
      `- ${l.state}: ${u.projects.state[p.state]}`,
      `- ${l.stack}: ${p.technologies.join(", ")}`,
      ...(p.gitHub ? [`- ${l.code}: ${p.gitHub}`] : []),
      "",
    ]),
    `## ${u.sections.experience}`,
    "",
    ...c.experience.flatMap((job) => [
      `### ${jobTitle(job)}`,
      "",
      job.summary,
      "",
      ...job.highlights.map((h) => `- ${plainText(h)}`),
      `- ${l.stack}: ${job.technologies.join(", ")}`,
      "",
    ]),
    `## ${u.sections.technologies}`,
    "",
    ...technologyGroups().flatMap((group) => [
      `### ${group.title}`,
      "",
      group.items.map((t) => t.name).join(", "),
      "",
    ]),
    `## ${u.sections.ai}`,
    "",
    c.ai.intro,
    "",
    ...c.ai.tools.flatMap((tool) => [
      `### ${tool.nombre}`,
      "",
      tool.descripcion,
      "",
      ...tool.beneficios.map((b) => `- ${b}`),
      "",
    ]),
    `### ${u.ai.studyAreas}`,
    "",
    ...c.ai.studyAreas.map(
      (area) => `- **${area.nombre}:** ${area.descripcion}`,
    ),
    "",
    `## ${l.contact}`,
    "",
    `- ${l.form}: ${url}#contact`,
    `- LinkedIn: ${links.linkedin}`,
    `- GitHub: ${links.github}`,
    `- ${u.nav.cv}: ${cvUrl}`,
    "",
  ].join("\n");
};

export const buildSitemap = (lastmod: string) => {
  const alternates = LOCALES.map(
    (lang) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeHtml(pageUrl(lang))}"/>`,
  ).join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...LOCALES.map(
      (lang) =>
        `  <url>\n    <loc>${escapeHtml(pageUrl(lang))}</loc>\n${alternates}\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    ),
    `  <url>\n    <loc>${escapeHtml(cvUrl)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    "</urlset>",
    "",
  ].join("\n");
};

export const buildJsonLd = (lang: Locale = "es") => {
  const { c, l, url } = text(lang);
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}#person`,
    name: c.profile.name,
    alternateName: c.profile.fullName,
    jobTitle: c.profile.jobTitle,
    description: c.profile.summary,
    url: SITE_URL,
    image: absolute(c.profile.photo),
    address: { "@type": "PostalAddress", addressCountry: "SV" },
    knowsLanguage: "es",
    sameAs: [links.linkedin, links.github],
    knowsAbout: [
      ...new Set([
        ...technologies.frontend.map((t) => t.name),
        ...technologies.backend.map((t) => t.name),
        ...c.ai.studyAreas.map((a) => a.nombre),
        l.agentic,
      ]),
    ],
  };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: `${c.profile.name} | ${c.profile.jobTitle}`,
        inLanguage: lang,
        mainEntity: { "@id": `${SITE_URL}#person` },
      },
      person,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: c.profile.name,
        inLanguage: ["es", "en"],
        publisher: { "@id": `${SITE_URL}#person` },
      },
    ],
  };
  // "<" escapado: el JSON nunca puede cerrar la etiqueta <script>
  return JSON.stringify(graph).replace(/</g, "\\u003c");
};

const link = (href: string, label: string) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

export const buildStaticHtml = (lang: Locale = "es") => {
  const { c, u, l, technologyGroups, jobTitle, caseSections, projectNotes } =
    text(lang);
  return [
    '<div class="static-content">',
    "<header>",
    `<h1>${escapeHtml(c.profile.name)}</h1>`,
    `<p>${escapeHtml(c.profile.headline)} · ${escapeHtml(c.profile.location)}</p>`,
    `<p>${escapeHtml(c.profile.availability)}</p>`,
    `<p>${escapeHtml(plainText(c.profile.intro))}</p>`,
    "</header>",
    "<main>",
    `<section id="projects"><h2>${escapeHtml(u.sections.projects)}</h2>`,
    `<h3>${escapeHtml(u.sections.cases)}</h3>`,
    ...c.caseStudies.map((cs) =>
      [
        `<h3>${escapeHtml(cs.title)}</h3>`,
        `<p>${escapeHtml(`${cs.context} ${l.role}: ${cs.role}.`)}</p>`,
        `<p>${escapeHtml(cs.problem)}</p>`,
        ...caseSections(cs).map(
          (section) =>
            `<p><strong>${escapeHtml(section.title)}</strong></p><ul>${section.items
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>`,
        ),
      ].join(""),
    ),
    `<h3>${escapeHtml(u.sections.otherProjects)}</h3><ul>`,
    ...c.projects.map(
      (p) => `<li>${link(p.url, p.name)}: ${escapeHtml(projectNotes(p))}</li>`,
    ),
    "</ul></section>",
    `<section id="experience"><h2>${escapeHtml(u.sections.experience)}</h2>`,
    ...c.experience.map(
      (job) =>
        `<h3>${escapeHtml(jobTitle(job))}</h3><p>${escapeHtml(job.summary)}</p><ul>${job.highlights
          .map((h) => `<li>${escapeHtml(plainText(h))}</li>`)
          .join("")}</ul>`,
    ),
    "</section>",
    `<section id="about"><h2>${escapeHtml(u.sections.about)}</h2>`,
    ...c.about.paragraphs.map((p) => `<p>${escapeHtml(plainText(p))}</p>`),
    "</section>",
    `<section id="technologies"><h2>${escapeHtml(u.sections.technologies)}</h2>`,
    ...technologyGroups().map(
      (g) =>
        `<h3>${escapeHtml(g.title)}</h3><p>${escapeHtml(g.items.map((t) => t.name).join(", "))}</p>`,
    ),
    "</section>",
    `<section id="ai"><h2>${escapeHtml(u.sections.ai)}</h2>`,
    `<p>${escapeHtml(c.ai.intro)}</p><ul>`,
    ...c.ai.tools.map(
      (t) =>
        `<li><strong>${escapeHtml(t.nombre)}:</strong> ${escapeHtml(t.descripcion)}</li>`,
    ),
    "</ul></section>",
    `<section id="contact"><h2>${escapeHtml(l.contact)}</h2><ul>`,
    `<li>${link(links.linkedin, "LinkedIn")}</li>`,
    `<li>${link(links.github, "GitHub")}</li>`,
    `<li>${link(links.cv, u.nav.cv)}</li>`,
    "</ul></section>",
    "</main>",
    "</div>",
  ].join("");
};

// Etiquetas del <head> que dependen del idioma
const headTags = (lang: Locale) => [
  {
    tag: "script",
    attrs: { type: "application/ld+json" },
    children: buildJsonLd(lang),
    injectTo: "head" as const,
  },
  {
    tag: "link",
    attrs: {
      rel: "alternate",
      type: "text/markdown",
      href: `/${filePath(lang, "index.md")}`,
    },
    injectTo: "head" as const,
  },
  {
    tag: "link",
    attrs: { rel: "describedby", href: `/${filePath(lang, "llms.txt")}` },
    injectTo: "head" as const,
  },
  ...[...LOCALES, "x-default" as const].map((hreflang) => ({
    tag: "link",
    attrs: {
      rel: "alternate",
      hreflang,
      href: pageUrl(hreflang === "x-default" ? "es" : hreflang),
    },
    injectTo: "head" as const,
  })),
];

const setMeta = (html: string, key: string, value: string) => {
  const pattern = new RegExp(
    `(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`,
  );
  if (!pattern.test(html)) throw new Error(`index.html sin <meta ${key}>`);
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
};

// en/index.html a partir del index.html ya construido (con los assets de
// Vite): mismo documento, con el idioma, los metadatos y el contenido en
// inglés.
export const toEnglishHtml = (html: string) => {
  const es = META.es;
  const en = META.en;
  const swap = (from: string, to: string) => {
    if (!html.includes(from))
      throw new Error(`index.html sin: ${from.slice(0, 60)}`);
    html = html.split(from).join(to);
  };

  swap('<html lang="es">', '<html lang="en">');
  swap(buildStaticHtml("es"), buildStaticHtml("en"));
  swap(buildJsonLd("es"), buildJsonLd("en"));
  swap('href="/index.md"', `href="/${filePath("en", "index.md")}"`);
  swap('href="/llms.txt"', `href="/${filePath("en", "llms.txt")}"`);
  swap(
    `<link rel="canonical" href="${SITE_URL}" />`,
    `<link rel="canonical" href="${pageUrl("en")}" />`,
  );
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(en.title)}</title>`,
  );
  html = setMeta(html, "description", en.description);
  for (const key of ["og:title", "twitter:title"]) {
    html = setMeta(html, key, en.title);
  }
  for (const key of ["og:description", "twitter:description"]) {
    html = setMeta(html, key, en.socialDescription);
  }
  for (const key of ["og:image:alt", "twitter:image:alt"]) {
    html = setMeta(html, key, en.imageAlt);
  }
  html = setMeta(html, "og:url", pageUrl("en"));
  html = setMeta(html, "og:locale", en.ogLocale);
  html = html.replace(
    `<meta property="og:locale" content="${en.ogLocale}" />`,
    `<meta property="og:locale" content="${en.ogLocale}" />\n    <meta property="og:locale:alternate" content="${es.ogLocale}" />`,
  );
  return html;
};

const generatedFiles = (lastmod: string) =>
  ({
    ...Object.fromEntries(
      LOCALES.flatMap((lang) => [
        [
          filePath(lang, "llms.txt"),
          { type: "text/plain; charset=utf-8", body: buildLlmsTxt(lang) },
        ],
        [
          filePath(lang, "index.md"),
          { type: "text/markdown; charset=utf-8", body: buildIndexMd(lang) },
        ],
      ]),
    ),
    "sitemap.xml": {
      type: "application/xml; charset=utf-8",
      body: buildSitemap(lastmod),
    },
  }) as Record<string, { type: string; body: string }>;

const today = () => new Date().toISOString().slice(0, 10);

export const seoContent = (): Plugin => ({
  name: "seo-content",

  transformIndexHtml: {
    order: "pre",
    handler: (html) => ({
      html: html.replace(
        '<div id="root"></div>',
        `<div id="root">${buildStaticHtml("es")}</div>`,
      ),
      tags: headTags("es"),
    }),
  },

  // En `npm run dev` los archivos se sirven desde memoria (y /en/ cae en el
  // index.html en español, pero la app se pinta en inglés según la ruta)
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const file = generatedFiles(today())[req.url?.slice(1) ?? ""];
      if (!file) return next();
      res.setHeader("Content-Type", file.type);
      res.end(file.body);
    });
  },

  // "post": index.html ya está en el bundle (lo emite el plugin de HTML de Vite)
  generateBundle: {
    order: "post",
    handler(_options, bundle) {
      for (const [fileName, { body }] of Object.entries(
        generatedFiles(today()),
      )) {
        this.emitFile({ type: "asset", fileName, source: body });
      }
      const index = bundle["index.html"];
      if (index?.type === "asset") {
        this.emitFile({
          type: "asset",
          fileName: "en/index.html",
          source: toEnglishHtml(String(index.source)),
        });
      }
    },
  },
});
