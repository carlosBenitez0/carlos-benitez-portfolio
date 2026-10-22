import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setIntersecting } from "../../../test/browserMocks";
import { AIToolCard } from "./AIToolCard";

describe("AIToolCard", () => {
  it("aparece al entrar en pantalla y se queda visible", () => {
    const { container } = render(
      <AIToolCard
        nombre="ClaudeAI"
        icono={<span />}
        descripcion="Asistente de IA"
        beneficios={["Análisis de código"]}
        delay={200}
      />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass("opacity-0");

    act(() => setIntersecting(wrapper, true));
    expect(wrapper).toHaveClass("opacity-100");
    expect(wrapper.style.transitionDelay).toBe("200ms");

    // Una vez revelada no vuelve a ocultarse al salir de pantalla
    act(() => setIntersecting(wrapper, false));
    expect(wrapper).toHaveClass("opacity-100");
    expect(screen.getByText("ClaudeAI")).toBeInTheDocument();
  });
});
