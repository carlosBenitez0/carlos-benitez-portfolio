import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "../../../hooks/useTheme";
import { ThemeToggle } from "./ThemeToggle";

const root = document.documentElement;

describe("ThemeToggle", () => {
  beforeEach(() => {
    root.dataset.theme = "dark";
  });

  it("en oscuro ofrece cambiar a modo claro", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Cambiar a modo claro" }),
    ).toBeInTheDocument();
  });

  it("al pulsarlo cambia el tema, guarda la elección y actualiza su nombre", () => {
    render(<ThemeToggle />);
    fireEvent.click(
      screen.getByRole("button", { name: "Cambiar a modo claro" }),
    );

    expect(root.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(
      screen.getByRole("button", { name: "Cambiar a modo oscuro" }),
    ).toBeInTheDocument();
  });
});
