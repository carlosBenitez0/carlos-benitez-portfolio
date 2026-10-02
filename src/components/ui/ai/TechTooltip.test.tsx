import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechTooltip } from "./TechTooltip";

describe("TechTooltip", () => {
  it("abre el panel y, al cerrarlo, no deja ningún botón oculto", async () => {
    render(<TechTooltip />);
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar información" }),
    );
    expect(screen.getByText("¡Tecnologías Interactivas!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    await waitFor(() => {
      expect(screen.queryByText("¡Tecnologías Interactivas!")).toBeNull();
    });
    expect(screen.queryByRole("button")).toBeNull();
  });
});
