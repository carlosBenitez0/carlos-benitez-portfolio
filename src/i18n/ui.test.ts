import { describe, expect, it } from "vitest";
import { content } from "../content/site";
import { localeFromPath } from "./locale";
import { ui } from "./ui";

// Claves de un objeto, en profundidad ("a.b.c"); los arrays cuentan como
// hoja con su longitud, para detectar listas con distinto número de elementos.
const shape = (value: unknown, prefix = ""): string[] => {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      shape(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
};

describe("i18n", () => {
  it("la ruta decide el idioma", () => {
    expect(localeFromPath("/")).toBe("es");
    expect(localeFromPath("/en/")).toBe("en");
    expect(localeFromPath("/en")).toBe("en");
    expect(localeFromPath("/english")).toBe("es");
  });

  it("los textos de la interfaz tienen las mismas claves en los dos idiomas", () => {
    expect(shape(ui.en)).toEqual(shape(ui.es));
  });

  it("el contenido en inglés tiene la misma forma que el español", () => {
    expect(shape(content.en)).toEqual(shape(content.es));
  });

  it("el contenido en inglés no comparte textos visibles con el español", () => {
    expect(content.en.profile.intro).not.toBe(content.es.profile.intro);
    content.en.caseStudies.forEach((caseStudy, index) => {
      expect(caseStudy.title).not.toBe(content.es.caseStudies[index].title);
      expect(caseStudy.slug).toBe(content.es.caseStudies[index].slug);
    });
    content.en.projects.forEach((project, index) => {
      expect(project.description).not.toBe(
        content.es.projects[index].description,
      );
    });
  });
});
