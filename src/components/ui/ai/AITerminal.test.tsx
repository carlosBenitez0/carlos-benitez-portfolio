import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AITerminal } from "./AITerminal";

describe("AITerminal", () => {
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

  it("cambia de ejemplo con los puntos de la barra", () => {
    render(<AITerminal />);
    fireEvent.click(screen.getByRole("button", { name: "View example 2" }));
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });
});
