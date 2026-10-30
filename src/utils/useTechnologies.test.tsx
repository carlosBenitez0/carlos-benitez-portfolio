import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { content } from "../content/site";
import { useTechnologies } from "./useTechnologies";

// Las tarjetas solo pintan las tecnologías que tienen etiqueta: una que falte
// aquí desaparece en silencio de la página.
describe("useTechnologies", () => {
  it("tiene etiqueta para cada tecnología que nombra el contenido", () => {
    const { result } = renderHook(() => useTechnologies());
    const labels = new Set(result.current.map((t) => t.name));
    const { projects, experience, caseStudies } = content.es;
    const used = new Set(
      [...projects, ...experience, ...caseStudies].flatMap(
        (item) => item.technologies,
      ),
    );

    expect([...used].filter((name) => !labels.has(name))).toEqual([]);
  });
});
