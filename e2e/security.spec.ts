import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  collectPageErrors,
  mockEmailJs,
  recordCspViolations,
  scrollToSection,
  visitAllSections,
} from "./helpers";

test.describe("cabeceras de seguridad", () => {
  test("el sitio responde con todas las cabeceras", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    const csp = headers["content-security-policy"];
    for (const directive of [
      "default-src 'self'",
      "script-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]) {
      expect(csp).toContain(directive);
    }
    expect(csp).not.toContain("unsafe-inline");
    expect(csp).not.toContain("unsafe-eval");

    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  });

  test("los archivos estáticos también llevan las cabeceras", async ({
    request,
  }) => {
    const response = await request.get("/favicon.ico");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["content-security-policy"]).toBeTruthy();
  });
});

test.describe("CSP en uso real", () => {
  test("recorrer todo el sitio y enviar el formulario no viola la CSP", async ({
    page,
  }) => {
    const getViolations = await recordCspViolations(page);
    const errors = collectPageErrors(page);
    await mockEmailJs(page);
    await page.goto("/");
    await visitAllSections(page);

    // Tooltip de tecnologías (framer-motion) y envío del formulario (EmailJS)
    await page.getByRole("button", { name: "Mostrar información" }).click();
    await scrollToSection(page, "contact");
    await page.getByLabel("Nombre", { exact: true }).fill("Carlos");
    await page.getByLabel("Email", { exact: true }).fill("carlos@gmail.com");
    await page.getByLabel("Asunto", { exact: true }).fill("Propuesta");
    await page
      .getByLabel("Mensaje", { exact: true })
      .fill("Hola, me interesa tu trabajo.");
    await page.getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByRole("status")).toBeVisible();

    expect(await getViolations()).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("las fuentes y todas las imágenes cargan con la CSP activa", async ({
    page,
  }) => {
    await page.goto("/");
    await visitAllSections(page);
    await page.evaluate(() => document.fonts.ready);

    const loadedFonts = await page.evaluate(
      () => [...document.fonts].filter((f) => f.status === "loaded").length,
    );
    expect(loadedFonts).toBeGreaterThan(0);

    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
    expect(broken).toEqual([]);
  });
});

test.describe("enlaces y embebido", () => {
  test("todo enlace a otra pestaña lleva noopener y noreferrer", async ({
    page,
  }) => {
    await page.goto("/");
    const unsafe = await page.evaluate(() =>
      [...document.querySelectorAll('a[target="_blank"]')]
        .filter((a) => {
          const rel = (a.getAttribute("rel") ?? "").split(/\s+/);
          return !rel.includes("noopener") || !rel.includes("noreferrer");
        })
        .map((a) => a.getAttribute("href")),
    );
    expect(unsafe).toEqual([]);
  });

  test("el sitio no se puede cargar dentro de un iframe", async ({
    page,
    baseURL,
  }) => {
    await page.setContent(
      `<iframe src="${baseURL}/" width="800" height="600"></iframe>`,
    );
    await page.waitForTimeout(2_000);

    const frame = page.frames().find((f) => f !== page.mainFrame());
    const headingCount = frame
      ? await frame
          .locator("h1")
          .count()
          .catch(() => 0)
      : 0;
    expect(headingCount).toBe(0);
  });
});

test.describe("accesibilidad", () => {
  test("sin violaciones graves de WCAG 2.1 AA", async ({ page }) => {
    await page.goto("/");
    // Esperar la intro del navbar (los links aparecen tras ~7 s)
    await expect(page.getByRole("link", { name: "Proyectos" })).toBeVisible({
      timeout: 15_000,
    });
    await visitAllSections(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);

    expect(serious).toEqual([]);
  });
});
