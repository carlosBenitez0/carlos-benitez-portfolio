import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("por defecto se revela con desenfoque al hacer scroll", () => {
    render(<SectionTitle title="Proyectos" />);
    expect(
      screen.getByRole("heading", { name: "Proyectos" }).parentElement,
    ).toHaveClass("anim-about-text");
  });

  it("sin revelado cuando la sección anima su contenido por su cuenta", () => {
    render(<SectionTitle title="Inteligencia artificial" reveal="none" />);
    expect(
      screen.getByRole("heading", { name: "Inteligencia artificial" })
        .parentElement,
    ).not.toHaveClass("anim-about-text");
  });

  it("puede subir sin desenfoque, al ritmo de las tarjetas", () => {
    render(<SectionTitle title="Proyectos" reveal="rise" />);
    const wrapper = screen.getByRole("heading", {
      name: "Proyectos",
    }).parentElement;
    expect(wrapper).toHaveClass("anim-rise");
    expect(wrapper).not.toHaveClass("anim-about-text");
  });
});
