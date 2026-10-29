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

  it("muestra cuándo se hizo el proyecto, solo si tiene fecha", () => {
    const props = {
      name: "TechZone",
      image: "/projects/techzone.webp",
      description: "Tienda en línea",
      technologies: ["React"],
      state: "En desarrollo",
      url: "https://techzone.example.com",
      gitHub: "https://github.com/carlosBenitez0/techzone",
    };
    const { container, rerender } = render(
      <ProyectCard {...props} date={{ start: "2025-06", end: "2025-08" }} />,
    );

    expect(screen.getByText("jun – ago 2025")).toHaveAttribute(
      "dateTime",
      "2025-06",
    );

    rerender(<ProyectCard {...props} />);
    expect(container.querySelector("time")).toBeNull();
  });

  it("no muestra el botón de GitHub si el proyecto no tiene repo", () => {
    render(
      <ProyectCard
        name="Portafolio Académico"
        image="/projects/portafolio-academico.webp"
        description="Proyecto académico"
        technologies={["HTML"]}
        state="Terminado"
        url="https://academico.example.com"
        gitHub=""
      />,
    );

    expect(
      screen.queryByRole("link", { name: /en GitHub/ }),
    ).not.toBeInTheDocument();
  });

  it("distingue un proyecto en pausa con su propio color", () => {
    const { container } = render(
      <ProyectCard
        name="Pokédex"
        image="/projects/pokedex.webp"
        description="Aplicación de Pokédex"
        technologies={["React"]}
        state="En pausa"
        url="https://pok-dex.example.com"
        gitHub="https://github.com/carlosBenitez0/pokedex"
      />,
    );

    expect(screen.getByText("En pausa")).toBeInTheDocument();
    const dot = container.querySelector<HTMLElement>(".project-state > span");
    expect(dot?.style.backgroundColor).toBe("var(--state-paused)");
  });
});
