import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { about } from "../../content/site";
import { AboutText } from "./AboutText";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

// El texto plano de site.ts alimenta el HTML estático, /llms.txt e
// /index.md: si alguien edita solo uno de los dos, este test lo detecta.
describe("AboutText", () => {
  it("dice lo mismo que about en src/content/site.ts", () => {
    const { container } = render(<AboutText />);
    const rendered = normalize(container.textContent ?? "");

    for (const text of [...about.paragraphs, ...about.achievements]) {
      expect(rendered).toContain(normalize(text));
    }
  });
});
