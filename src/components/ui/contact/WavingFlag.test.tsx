import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WavingFlag } from "./WavingFlag";

describe("WavingFlag", () => {
  it("es una imagen accesible de la bandera de El Salvador", () => {
    render(<WavingFlag />);
    expect(
      screen.getByRole("img", { name: "Bandera de El Salvador" }),
    ).toBeInTheDocument();
  });

  it("se compone de franjas con más amplitud hacia el extremo libre", () => {
    const { container } = render(<WavingFlag />);
    const strips = [...container.querySelectorAll<HTMLElement>(".flag-strip")];
    expect(strips).toHaveLength(44);

    const amp = (el: HTMLElement) => Number(el.style.getPropertyValue("--amp"));
    expect(amp(strips[0])).toBeLessThan(1);
    expect(amp(strips[strips.length - 1])).toBeGreaterThan(4.5);
    // La onda viaja hacia la derecha: cada franja va un poco detrás de la anterior
    const delays = strips.map((el) => parseFloat(el.style.animationDelay));
    expect(delays.every((d, i) => i === 0 || d > delays[i - 1])).toBe(true);
  });
});
