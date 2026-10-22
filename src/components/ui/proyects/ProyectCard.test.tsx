import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProyectCard } from "./ProyectCard";

describe("ProyectCard", () => {
  it("sus enlaces de solo icono o imagen tienen nombre accesible", () => {
    render(
      <ProyectCard
        name="Pokédex"
        image="https://res.cloudinary.com/x.png"
        description="Aplicación de Pokédex"
        technologies={["React"]}
        state="Terminado"
        url="https://pok-dex.example.com"
        gitHub="https://github.com/carlosBenitez0/pokedex"
      />,
    );

    expect(
      screen.getByRole("link", { name: "Código de Pokédex en GitHub" }),
    ).toHaveAttribute("href", "https://github.com/carlosBenitez0/pokedex");
    expect(
      screen.getByRole("link", { name: "Ver el proyecto Pokédex (Terminado)" }),
    ).toHaveAttribute("href", "https://pok-dex.example.com");
  });

  it("muestra la captura en el marco y el estado como texto", () => {
    const { container } = render(
      <ProyectCard
        name="Pokédex"
        image="/projects/pokedex.webp"
        description="Aplicación de Pokédex"
        technologies={["React"]}
        state="En desarrollo"
        url="https://pok-dex.example.com"
        gitHub="https://github.com/carlosBenitez0/pokedex"
      />,
    );

    const frame = container.querySelector(".project-frame");
    // Captura decorativa (el enlace ya la nombra) y con carga diferida
    const image = frame?.querySelector("img");
    expect(image).toHaveAttribute("src", "/projects/pokedex.webp");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("loading", "lazy");
    // Antes de leer la captura, el borde usa los colores de la marca
    expect((frame as HTMLElement).style.getPropertyValue("--frame-c1")).toBe(
      "#9d4edd",
    );
    expect(screen.getByText("En desarrollo")).toBeInTheDocument();
  });
});
