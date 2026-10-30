import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { caseStudies } from "../../../content/site";
import { CaseStudies } from "./CaseStudies";

const [first] = caseStudies;

afterEach(() => history.replaceState(null, "", "/"));

describe("CaseStudies", () => {
  it("muestra una tarjeta por caso con su botón", () => {
    render(<CaseStudies />);

    for (const caseStudy of caseStudies) {
      expect(
        screen.getByRole("heading", { name: caseStudy.title }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole("button", { name: /Ver detalles/ }),
    ).toHaveLength(caseStudies.length);
  });

  it("abre el caso en un diálogo con nombre y lo refleja en la URL", () => {
    render(<CaseStudies />);
    fireEvent.click(
      screen.getByRole("button", { name: `Ver detalles: ${first.title}` }),
    );

    const dialog = screen.getByRole("dialog", { name: first.title });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveTextContent(first.problem);
    expect(dialog.textContent).not.toContain("**");
    expect(window.location.hash).toBe(`#caso-${first.slug}`);
  });

  it("al cerrar quita el caso de la URL", () => {
    render(<CaseStudies />);
    fireEvent.click(
      screen.getByRole("button", { name: `Ver detalles: ${first.title}` }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });

  it("abre directamente el caso enlazado con #caso-<slug>", () => {
    history.replaceState(null, "", `/#caso-${first.slug}`);
    render(<CaseStudies />);

    expect(screen.getByRole("dialog", { name: first.title })).toHaveAttribute(
      "open",
    );
  });

  it("no muestra apartados vacíos", () => {
    const empty = caseStudies.find((c) => c.results.length === 0);
    if (!empty) return;
    history.replaceState(null, "", `/#caso-${empty.slug}`);
    render(<CaseStudies />);

    expect(
      screen.queryByRole("heading", { name: "Resultados" }),
    ).not.toBeInTheDocument();
  });
});
