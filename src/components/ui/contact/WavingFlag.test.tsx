import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setReducedMotion } from "../../../test/browserMocks";
import { WavingFlag } from "./WavingFlag";

describe("WavingFlag", () => {
  it("es una imagen accesible de la bandera de El Salvador", () => {
    render(<WavingFlag />);
    expect(
      screen.getByRole("img", { name: "Bandera de El Salvador" }),
    ).toBeInTheDocument();
  });

  it("dibuja de inmediato todas las figuras como trazos vectoriales", () => {
    const { container } = render(<WavingFlag />);
    const paths = [...container.querySelectorAll("path[data-shape]")];
    expect(paths.map((p) => p.getAttribute("data-shape"))).toEqual([
      "outline",
      "stripes",
      "circle",
      "triangle",
      "details",
    ]);
    for (const p of paths) expect(p.getAttribute("d")).toMatch(/^M/);
  });

  it("con 'reducir movimiento' queda dibujada en reposo", () => {
    setReducedMotion(true);
    const { container } = render(<WavingFlag />);
    expect(
      container.querySelector('path[data-shape="outline"]')?.getAttribute("d"),
    ).toMatch(/^M.*Z$/);
  });
});
