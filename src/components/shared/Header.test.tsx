import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { links } from "../../content/site";
import { setViewportWidth } from "../../test/browserMocks";
import { Header } from "./Header";

describe("Header", () => {
  it("lleva a los casos de estudio y descarga el CV", () => {
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "Ver casos de estudio" }),
    ).toHaveAttribute("href", "#cases");
    const cv = screen.getByRole("link", { name: "Descargar CV" });
    expect(cv).toHaveAttribute("href", links.cv);
    expect(cv).toHaveAttribute("download");
  });

  it("en móvil mantiene las acciones", () => {
    setViewportWidth(390);
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "Ver casos de estudio" }),
    ).toBeInTheDocument();
  });
});
