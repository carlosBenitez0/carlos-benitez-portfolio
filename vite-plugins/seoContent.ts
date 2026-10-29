import type { Plugin } from "vite";
import {
  SITE_URL,
  about,
  ai,
  links,
  profile,
  projects,
  technologies,
  technologyCategories,
} from "../src/content/site";
import { formatProjectDate } from "../src/utils/projectDate";

// Genera en el build, a partir de src/content/site.ts:
// - HTML semántico dentro de #root, para buscadores y agentes que no ejecutan
//   JavaScript (React lo reemplaza al montar).
// - JSON-LD (Person + WebSite) para resultados enriquecidos.
// - /llms.txt (https://llmstxt.org, v2) e /index.md: la página en Markdown.
// - /sitemap.xml con la fecha del build.

const absolute = (path: string) => new URL(path, SITE_URL).href;

const cvUrl = absolute(links.cv);

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const technologyGroups = () =>
  Object.entries(technologies).map(([key, items]) => ({
    title: technologyCategories[key] ?? key,
    items,
  }));

const projectNotes = (project: (typeof projects)[number]) =>
  [
    project.description,
    project.date && `Fecha: ${formatProjectDate(project.date)}.`,
    `Estado: ${project.state}.`,
    `Tecnologías: ${project.technologies.join(", ")}.`,
    project.gitHub && `Código: ${project.gitHub}`,
  ]
    .filter(Boolean)
    .join(" ");

export const buildLlmsTxt = () =>
  [
    `# ${profile.name}`,
    "",
    `> ${profile.summary}`,
    "",
    `Portafolio personal (en español) de ${profile.fullName}, ${profile.headline}, en ${profile.location}. Para contactarlo: formulario en ${SITE_URL}#contact o LinkedIn.`,
    "",
    "## Perfil",
    "",
    `- [Portafolio completo en Markdown](${absolute("/index.md")}): sobre mí, logros, proyectos, tecnologías, uso de IA y contacto`,
    `- [Currículum (PDF)](${cvUrl}): experiencia, formación y habilidades`,
    `- [LinkedIn](${links.linkedin}): perfil profesional`,
    `- [GitHub](${links.github}): código de sus proyectos`,
    "",
    "## Proyectos",
    "",
    ...projects.map((p) => `- [${p.name}](${p.url}): ${projectNotes(p)}`),
    "",
    "## Optional",
    "",
    `- [Código de este portafolio](${links.repo}): React 19, TypeScript, Vite, Tailwind CSS v4 y GSAP, con tests de Vitest y Playwright`,
    "",
  ].join("\n");

export const buildIndexMd = () =>
  [
    `# ${profile.name} | ${profile.jobTitle}`,
    "",
    `> ${profile.summary}`,
    "",
    `**${profile.headline}** · ${profile.location}`,
    "",
    profile.intro,
    "",
    "## Sobre mí",
    "",
    ...about.paragraphs.flatMap((p) => [p, ""]),
    "### Logros destacados",
    "",
    ...about.achievements.map((a) => `- ${a}`),
    "",
    "## Proyectos",
    "",
    ...projects.flatMap((p) => [
      `### [${p.name}](${p.url})`,
      "",
      p.description,
      "",
      ...(p.date ? [`- Fecha: ${formatProjectDate(p.date)}`] : []),
      `- Estado: ${p.state}`,
      `- Tecnologías: ${p.technologies.join(", ")}`,
      ...(p.gitHub ? [`- Código: ${p.gitHub}`] : []),
      "",
    ]),
    "## Tecnologías",
    "",
    ...technologyGroups().flatMap((group) => [
      `### ${group.title}`,
      "",
      group.items.map((t) => t.name).join(", "),
      "",
    ]),
    "## Inteligencia artificial",
    "",
    ai.intro,
    "",
    ...ai.tools.flatMap((tool) => [
      `### ${tool.nombre}`,
      "",
      tool.descripcion,
      "",
      ...tool.beneficios.map((b) => `- ${b}`),
      "",
    ]),
    "### Áreas de estudio actuales",
    "",
    ...ai.studyAreas.map((area) => `- **${area.nombre}:** ${area.descripcion}`),
    "",
    "## Contacto",
    "",
    `- Formulario: ${SITE_URL}#contact`,
    `- LinkedIn: ${links.linkedin}`,
    `- GitHub: ${links.github}`,
    `- Currículum (PDF): ${cvUrl}`,
    "",
  ].join("\n");

export const buildSitemap = (lastmod: string) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[SITE_URL, cvUrl].map(
      (loc) =>
        `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");

export const buildJsonLd = () => {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}#person`,
    name: profile.name,
    alternateName: profile.fullName,
    jobTitle: profile.jobTitle,
    description: profile.summary,
    url: SITE_URL,
    image: absolute(profile.photo),
    address: { "@type": "PostalAddress", addressCountry: "SV" },
    knowsLanguage: "es",
    sameAs: [links.linkedin, links.github],
    knowsAbout: [
      ...new Set([
        ...technologies.frontend.map((t) => t.name),
        ...technologies.backend.map((t) => t.name),
        ...ai.studyAreas.map((a) => a.nombre),
        "Desarrollo agéntico",
      ]),
    ],
  };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}#profile`,
        url: SITE_URL,
        name: `${profile.name} | ${profile.jobTitle}`,
        inLanguage: "es",
        mainEntity: { "@id": `${SITE_URL}#person` },
      },
      person,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: profile.name,
        inLanguage: "es",
        publisher: { "@id": `${SITE_URL}#person` },
      },
    ],
  };
  // "<" escapado: el JSON nunca puede cerrar la etiqueta <script>
  return JSON.stringify(graph).replace(/</g, "\\u003c");
};

const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;

export const buildStaticHtml = () =>
  [
    '<div class="static-content">',
    "<header>",
    `<h1>${escapeHtml(profile.name)}</h1>`,
    `<p>${escapeHtml(profile.headline)} · ${escapeHtml(profile.location)}</p>`,
    `<p>${escapeHtml(profile.intro)}</p>`,
    "</header>",
    "<main>",
    '<section id="projects"><h2>Proyectos</h2><ul>',
    ...projects.map(
      (p) => `<li>${link(p.url, p.name)}: ${escapeHtml(projectNotes(p))}</li>`,
    ),
    "</ul></section>",
    '<section id="about"><h2>Sobre mí</h2>',
    ...about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`),
    "<h3>Logros destacados</h3><ul>",
    ...about.achievements.map((a) => `<li>${escapeHtml(a)}</li>`),
    "</ul></section>",
    '<section id="technologies"><h2>Tecnologías</h2>',
    ...technologyGroups().map(
      (g) =>
        `<h3>${escapeHtml(g.title)}</h3><p>${escapeHtml(g.items.map((t) => t.name).join(", "))}</p>`,
    ),
    "</section>",
    '<section id="ai"><h2>Inteligencia artificial</h2>',
    `<p>${escapeHtml(ai.intro)}</p><ul>`,
    ...ai.tools.map(
      (t) =>
        `<li><strong>${escapeHtml(t.nombre)}:</strong> ${escapeHtml(t.descripcion)}</li>`,
    ),
    "</ul></section>",
    '<section id="contact"><h2>Contacto</h2><ul>',
    `<li>${link(links.linkedin, "LinkedIn")}</li>`,
    `<li>${link(links.github, "GitHub")}</li>`,
    `<li>${link(links.cv, "Currículum (PDF)")}</li>`,
    "</ul></section>",
    "</main>",
    "</div>",
  ].join("");

const generatedFiles = (lastmod: string) => ({
  "llms.txt": { type: "text/plain; charset=utf-8", body: buildLlmsTxt() },
  "index.md": { type: "text/markdown; charset=utf-8", body: buildIndexMd() },
  "sitemap.xml": {
    type: "application/xml; charset=utf-8",
    body: buildSitemap(lastmod),
  },
});

const today = () => new Date().toISOString().slice(0, 10);

export const seoContent = (): Plugin => ({
  name: "seo-content",

  transformIndexHtml: {
    order: "pre",
    handler: (html) => ({
      html: html.replace(
        '<div id="root"></div>',
        `<div id="root">${buildStaticHtml()}</div>`,
      ),
      tags: [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: buildJsonLd(),
          injectTo: "head",
        },
        {
          tag: "link",
          attrs: { rel: "alternate", type: "text/markdown", href: "/index.md" },
          injectTo: "head",
        },
        {
          tag: "link",
          attrs: { rel: "describedby", href: "/llms.txt" },
          injectTo: "head",
        },
      ],
    }),
  },

  // En `npm run dev` los archivos se sirven desde memoria
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const files = generatedFiles(today());
      const file = files[req.url?.slice(1) as keyof typeof files];
      if (!file) return next();
      res.setHeader("Content-Type", file.type);
      res.end(file.body);
    });
  },

  generateBundle() {
    for (const [fileName, { body }] of Object.entries(
      generatedFiles(today()),
    )) {
      this.emitFile({ type: "asset", fileName, source: body });
    }
  },
});
