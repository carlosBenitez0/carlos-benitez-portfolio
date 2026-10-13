import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setIntersecting, setReducedMotion } from "../../../test/browserMocks";
import { AITerminal } from "./AITerminal";

describe("AITerminal", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("se abre y cierra con un botón accesible", () => {
    const { container } = render(<AITerminal />);
    const toggle = screen.getByRole("button", { name: "Ocultar terminal" });
    const body = container.querySelector("#ai-terminal-body")!;

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-controls", "ai-terminal-body");
    expect(body).not.toHaveAttribute("inert");

    fireEvent.click(toggle);
    const closed = screen.getByRole("button", { name: "Mostrar terminal" });
    expect(closed).toHaveAttribute("aria-expanded", "false");
    // Cerrada, su contenido queda fuera del foco y de los lectores
    expect(body).toHaveAttribute("inert");
  });

  it("cambia de sesión con las pestañas", () => {
    render(<AITerminal />);
    const tab = screen.getByRole("tab", { name: "Subagentes en paralelo" });
    fireEvent.click(tab);
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tab", { name: "Feature con TDD" }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("reproduce la sesión cuando la terminal entra en pantalla", () => {
    vi.useFakeTimers();
    const { container } = render(<AITerminal />);
    expect(
      screen.queryByText("48 passed: los 3 nuevos y toda la suite existente"),
    ).toBeNull();

    act(() => setIntersecting(container.firstElementChild!, true));
    // Avanzar poco a poco: al terminar, la terminal rota a la siguiente sesión
    for (let i = 0; i < 1000 && !screen.queryByText("Completado"); i++) {
      act(() => vi.advanceTimersByTime(250));
    }

    expect(
      screen.getByText("48 passed: los 3 nuevos y toda la suite existente"),
    ).toBeInTheDocument();
    expect(screen.getByText("Completado")).toBeInTheDocument();
  });

  it("con movimiento reducido muestra la sesión completa sin animar", () => {
    setReducedMotion(true);
    render(<AITerminal />);
    expect(
      screen.getByText("48 passed: los 3 nuevos y toda la suite existente"),
    ).toBeInTheDocument();
    expect(screen.getByText("Completado")).toBeInTheDocument();
  });
});
