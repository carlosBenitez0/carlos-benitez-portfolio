import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteAnalytics } from "./SiteAnalytics";

const analyticsScripts = () =>
  [...document.querySelectorAll("script")].filter((s) =>
    /_vercel\/insights|vercel-scripts/.test(s.src),
  );

afterEach(() => {
  analyticsScripts().forEach((s) => s.remove());
});

describe("SiteAnalytics", () => {
  it("fuera de Vercel no carga ningún script", () => {
    render(<SiteAnalytics vercelEnv={undefined} />);
    expect(analyticsScripts()).toHaveLength(0);
  });

  it("en un deploy de Vercel carga el script de analítica", () => {
    render(<SiteAnalytics vercelEnv="production" />);
    expect(analyticsScripts()).toHaveLength(1);
  });
});
