import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { experience } from "../../../content/site";
import { ExperienceTimeline } from "./ExperienceTimeline";

describe("ExperienceTimeline", () => {
  it("muestra cada puesto con su empresa y sus logros sin los asteriscos", () => {
    render(<ExperienceTimeline />);

    const items = screen
      .getAllByRole("listitem")
      .filter((item) => item.querySelector("h3"));
    expect(items).toHaveLength(experience.length);

    experience.forEach((job, index) => {
      const item = within(items[index]);
      expect(item.getByRole("heading", { name: job.role })).toBeInTheDocument();
      expect(item.getByText(job.company)).toBeInTheDocument();
    });
    expect(document.body.textContent).not.toContain("**");
  });
});
