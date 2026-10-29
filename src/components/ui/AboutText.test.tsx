import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { about } from "../../content/site";
import { plainText } from "../../utils/richText";
import { AboutText } from "./AboutText";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

describe("AboutText", () => {
  it("muestra los párrafos de src/content sin las marcas", () => {
    const { container } = render(<AboutText />);
    const rendered = normalize(container.textContent ?? "");

    for (const text of about.paragraphs) {
      expect(rendered).toContain(normalize(plainText(text)));
    }
    expect(rendered).not.toMatch(/\*\*|\[\[/);
  });

  it("pinta las tecnologías como enlaces", () => {
    const { getByRole } = render(<AboutText />);
    expect(getByRole("link", { name: /FastAPI/ })).toBeInTheDocument();
  });
});
