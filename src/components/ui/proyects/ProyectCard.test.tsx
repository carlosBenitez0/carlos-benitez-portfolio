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
});
