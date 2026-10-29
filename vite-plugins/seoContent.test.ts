import { describe, expect, it } from "vitest";
import {
  SITE_URL,
  about,
  caseStudies,
  experience,
  links,
  projects,
} from "../src/content/site";
import { content } from "../src/content/site";
import { plainText } from "../src/utils/richText";
import {
  toEnglishHtml,
  buildIndexMd,
  buildJsonLd,
  buildLlmsTxt,
  buildSitemap,
  buildStaticHtml,
} from "./seoContent";

describe("llms.txt (spec v2 de llmstxt.org)", () => {
  const llms = buildLlmsTxt();
  const lines = llms.split("\n");

  it("empieza con el H1 y sigue con el resumen en blockquote", () => {
    expect(lines[0]).toBe("# Carlos Benítez");
    expect(lines.find((l) => l.trim() !== "" && l !== lines[0])).toMatch(/^> /);
  });

  it("solo usa H2 para las listas de archivos, sin otros encabezados", () => {
    const headings = lines.filter((l) => l.startsWith("#"));
    expect(headings.slice(1).every((h) => h.startsWith("## "))).toBe(true);
    expect(headings).toContain("## Optional");
  });

  it("cada entrada de las listas es [nombre](url absoluta) con nota opcional", () => {
    const sections = llms.split(/^## /m).slice(1);
    for (const section of sections) {
      const items = section.split("\n").filter((l) => l.startsWith("- "));
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(item).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .+)?$/);
      }
    }
  });

  it("enlaza la versión Markdown, el CV y todos los proyectos", () => {
    expect(llms).toContain(`(${SITE_URL}index.md)`);
    expect(llms).toContain("Quintanilla%20-%20CV.pdf)");
    for (const project of projects) {
      expect(llms).toContain(`[${project.name}](${project.url})`);
    }
  });
});

describe("index.md", () => {
  const md = buildIndexMd();

  it("incluye todo el contenido de la página", () => {
    for (const text of about.paragraphs) {
      expect(md).toContain(plainText(text));
    }
    expect(md).not.toMatch(/\[\[/);
    for (const project of projects) {
      expect(md).toContain(`### [${project.name}](${project.url})`);
    }
    expect(md).toContain("- Fecha: sep – oct 2024 · retomado jul 2025");
    for (const caseStudy of caseStudies) {
      expect(md).toContain(caseStudy.problem);
      expect(md).toContain(`#caso-${caseStudy.slug})`);
    }
    for (const job of experience) {
      expect(md).toContain(`### ${job.role} · ${job.company}`);
    }
    // Los resaltados (**...**) llegan sin asteriscos
    expect(md).not.toContain("**créditos");
    expect(md).toContain("## Tecnologías");
    expect(md).toContain("## Inteligencia artificial");
    expect(md).toContain(links.linkedin);
  });
});

describe("HTML estático de #root", () => {
  const html = buildStaticHtml();

  it("tiene un solo h1 y una sección por bloque del sitio", () => {
    expect(html.match(/<h1>/g)).toHaveLength(1);
    for (const id of [
      "projects",
      "experience",
      "about",
      "technologies",
      "ai",
      "contact",
    ]) {
      expect(html).toContain(`<section id="${id}">`);
    }
  });

  it("escapa el texto", () => {
    expect(html).not.toMatch(
      /<(?!\/?(div|header|h[1-3]|p|main|section|ul|li|a|strong)[\s>])/,
    );
  });
});

describe("JSON-LD", () => {
  it("describe a la persona con sus perfiles", () => {
    const data = JSON.parse(buildJsonLd());
    const person = data["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "Person",
    );
    expect(person.name).toBe("Carlos Benítez");
    expect(person.url).toBe(SITE_URL);
    expect(person.sameAs).toEqual([links.linkedin, links.github]);
  });

  it("no puede cerrar la etiqueta <script>", () => {
    expect(buildJsonLd()).not.toContain("<");
  });
});

describe("sitemap.xml", () => {
  it("lista las dos versiones (enlazadas por hreflang) y el CV", () => {
    const xml = buildSitemap("2026-01-02");
    expect(xml).toContain(`<loc>${SITE_URL}</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}en/</loc>`);
    expect(xml).toContain(`hreflang="en" href="${SITE_URL}en/"`);
    expect(xml).toContain("CV.pdf</loc>");
    expect(xml.match(/<lastmod>2026-01-02<\/lastmod>/g)).toHaveLength(3);
  });
});

describe("versión en inglés", () => {
  it("llms.txt e index.md usan el contenido y las URLs en inglés", () => {
    const llms = buildLlmsTxt("en");
    const md = buildIndexMd("en");
    expect(llms).toContain(`(${SITE_URL}en/index.md)`);
    expect(llms).toContain("## Case studies");
    for (const caseStudy of content.en.caseStudies) {
      expect(llms).toContain(`(${SITE_URL}en/#caso-${caseStudy.slug})`);
    }
    expect(md).toContain("## About me");
    expect(md).toContain("Sep – Oct 2024 · resumed Jul 2025");
    expect(md).toContain("- Status: On hold");
    expect(md).not.toContain("Estado:");
  });

  it("el HTML estático y el JSON-LD están en inglés", () => {
    const html = buildStaticHtml("en");
    expect(html).toContain("<h2>Experience</h2>");
    expect(html).not.toContain("Sobre mí");
    expect(JSON.parse(buildJsonLd("en"))["@graph"][0].inLanguage).toBe("en");
  });

  it("toEnglishHtml cambia idioma, metadatos y contenido de index.html", () => {
    const esHtml = [
      '<html lang="es"><head>',
      "<title>\n  Viejo\n</title>",
      '<meta name="description" content="es" />',
      ...[
        "og:title",
        "og:description",
        "og:url",
        "og:locale",
        "og:image:alt",
      ].map((key) => `<meta\n  property="${key}"\n  content="es"\n/>`),
      ...["twitter:title", "twitter:description", "twitter:image:alt"].map(
        (key) => `<meta name="${key}" content="es" />`,
      ),
      `<link rel="canonical" href="${SITE_URL}" />`,
      `<script type="application/ld+json">${buildJsonLd("es")}</script>`,
      '<link rel="alternate" type="text/markdown" href="/index.md">',
      '<link rel="describedby" href="/llms.txt">',
      `</head><body><div id="root">${buildStaticHtml("es")}</div></body></html>`,
    ].join("\n");

    const html = toEnglishHtml(esHtml);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}en/" />`);
    expect(html).toContain('href="/en/index.md"');
    expect(html).toContain(buildStaticHtml("en"));
    expect(html).toMatch(/property="og:locale"\s+content="en_US"/);
    expect(html).not.toMatch(/content="es"/);
  });
});
