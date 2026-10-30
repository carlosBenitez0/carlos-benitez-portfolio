import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// El idioma se decide al cargar los módulos: se recargan con la ruta /en/
beforeEach(() => {
  history.replaceState(null, "", "/en/");
  vi.resetModules();
});

afterEach(() => {
  history.replaceState(null, "", "/");
  vi.resetModules();
});

// Cada test vuelve a importar el árbol de módulos (GSAP, Three...): con la
// máquina cargada, el primero supera los 5 s por defecto.
describe("página en inglés (/en/)", { timeout: 20_000 }, () => {
  it("el hero y el contenido salen en inglés", async () => {
    const { Header } = await import("../components/shared/Header");
    render(<Header />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Hi, I'm Carlos",
    );
    expect(
      screen.getByRole("link", { name: "See case studies" }),
    ).toHaveAttribute("href", "#cases");
  });

  it("las tarjetas usan la etiqueta de estado y las fechas en inglés", async () => {
    const { ProyectCard } = await import(
      "../components/ui/proyects/ProyectCard"
    );
    render(
      <ProyectCard
        name="Pokédex"
        image="/projects/pokedex.webp"
        description="Web Pokédex"
        technologies={["React"]}
        state="paused"
        url="https://pok-dex.example.com"
        gitHub="https://github.com/carlosBenitez0/pok-dex"
        date={{ start: "2024-09", end: "2024-10", resumed: "2025-07" }}
      />,
    );

    expect(screen.getByText("On hold")).toBeInTheDocument();
    expect(
      screen.getByText("Sep – Oct 2024 · resumed Jul 2025"),
    ).toBeInTheDocument();
  });

  it("el selector lleva a la versión en español conservando la sección", async () => {
    const { LanguageSwitch } = await import(
      "../components/shared/Navbar/LanguageSwitch"
    );
    render(<LanguageSwitch />);
    const link = screen.getByRole("link", {
      name: "Ver esta página en español",
    });
    expect(link).toHaveAttribute("href", "/");

    history.replaceState(null, "", "/en/#experience");
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    expect(link).toHaveAttribute("href", "/#experience");
  });

  it("el formulario valida en inglés", async () => {
    const { validateContact } = await import("../utils/contactRules");
    expect(
      validateContact({ name: "", email: "", subject: "", message: "" }, "en")
        ?.error,
    ).toBe("Enter your name");
  });
});
