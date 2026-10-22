import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as icons from "./brandIcons";

describe("brandIcons", () => {
  it.each(Object.entries(icons))(
    "%s es un SVG decorativo que toma el color del tema",
    (_, Icon) => {
      const { container } = render(<Icon className="text-2xl" />);
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("fill", "currentColor");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveClass("text-2xl");
      expect(svg.querySelector("path")?.getAttribute("d")).toBeTruthy();
    },
  );
});
