import { describe, expect, it } from "vitest";
import { SITE_URL, about, links, projects } from "../src/content/site";
import {
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
    for (const text of [...about.paragraphs, ...about.achievements]) {
      expect(md).toContain(text);
    }
    for (const project of projects) {
      expect(md).toContain(`### [${project.name}](${project.url})`);
    }
    expect(md).toContain("## Tecnologías");
    expect(md).toContain("## Inteligencia artificial");
    expect(md).toContain(links.linkedin);
  });
});

describe("HTML estático de #root", () => {
  const html = buildStaticHtml();

  it("tiene un solo h1 y una sección por bloque del sitio", () => {
    expect(html.match(/<h1>/g)).toHaveLength(1);
    for (const id of ["projects", "about", "technologies", "ai", "contact"]) {
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
  it("lista la página y el CV con la fecha del build", () => {
    const xml = buildSitemap("2026-01-02");
    expect(xml).toContain(`<loc>${SITE_URL}</loc>`);
    expect(xml).toContain("CV.pdf</loc>");
    expect(xml.match(/<lastmod>2026-01-02<\/lastmod>/g)).toHaveLength(2);
  });
});
