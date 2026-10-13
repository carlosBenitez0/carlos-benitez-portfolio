import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteAnalytics } from "./SiteAnalytics";

const analyticsScripts = () =>
  [...document.querySelectorAll("script")].filter((s) =>
    /_vercel\/(speed-)?insights|vercel-scripts/.test(s.src),
  );

afterEach(() => {
  analyticsScripts().forEach((s) => s.remove());
});

describe("SiteAnalytics", () => {
  it("fuera de Vercel no carga ningún script", () => {
    render(<SiteAnalytics vercelEnv={undefined} />);
    expect(analyticsScripts()).toHaveLength(0);
  });

  it("en un deploy de Vercel carga Web Analytics y Speed Insights", () => {
    render(<SiteAnalytics vercelEnv="production" />);
    // En tests carga las versiones de depuración (CDN); en producción las
    // mismas rutas cuelgan de /_vercel/ en el propio dominio
    const sources = analyticsScripts().map((s) => s.src);
    expect(sources).toHaveLength(2);
    expect(
      sources.filter((src) => src.includes("speed-insights")),
    ).toHaveLength(1);
  });
});
