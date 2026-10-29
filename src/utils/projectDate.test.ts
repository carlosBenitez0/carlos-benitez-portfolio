import { describe, expect, it } from "vitest";
import { projects } from "../content/site";
import { formatProjectDate } from "./projectDate";

describe("formatProjectDate", () => {
  it("muestra un solo mes cuando no hay fin o coincide con el inicio", () => {
    expect(formatProjectDate({ start: "2024-10" })).toBe("oct 2024");
    expect(formatProjectDate({ start: "2024-10", end: "2024-10" })).toBe(
      "oct 2024",
    );
  });

  it("no repite el año en un rango dentro del mismo año", () => {
    expect(formatProjectDate({ start: "2025-06", end: "2025-08" })).toBe(
      "jun – ago 2025",
    );
    expect(formatProjectDate({ start: "2024-12", end: "2025-02" })).toBe(
      "dic 2024 – feb 2025",
    );
  });

  it("marca lo que sigue en curso", () => {
    expect(formatProjectDate({ start: "2025-06", current: true })).toBe(
      "jun 2025 – actualidad",
    );
  });

  it("indica cuándo se retomó un proyecto pausado", () => {
    expect(
      formatProjectDate({
        start: "2024-09",
        end: "2024-10",
        resumed: "2025-07",
      }),
    ).toBe("sep – oct 2024 · retomado jul 2025");
  });
});

describe("formatProjectDate en inglés", () => {
  it("usa los meses y las palabras en inglés", () => {
    expect(
      formatProjectDate(
        { start: "2024-09", end: "2024-10", resumed: "2025-07" },
        "en",
      ),
    ).toBe("Sep – Oct 2024 · resumed Jul 2025");
    expect(formatProjectDate({ start: "2025-06", current: true }, "en")).toBe(
      "Jun 2025 – present",
    );
  });
});

describe("orden de los proyectos", () => {
  it("va del más reciente al más antiguo, con los que no tienen fecha al final", () => {
    const starts = projects.map((p) => p.date?.start ?? "");
    expect(starts).toEqual([...starts].sort().reverse());
  });
});
