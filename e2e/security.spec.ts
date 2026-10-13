import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  collectPageErrors,
  mockContactApi,
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
      // El formulario envía a /api/contact: ningún origen externo
      "connect-src 'self';",
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
    await mockContactApi(page);
    await page.goto("/");
    await visitAllSections(page);

    // Tooltip de tecnologías (framer-motion) y envío del formulario (/api/contact)
    await page.getByRole("button", { name: "Mostrar información" }).click();
    await scrollToSection(page, "contact");
    await page.getByLabel("Nombre", { exact: true }).fill("Carlos");
    await page.getByLabel("Email", { exact: true }).fill("carlos@gmail.com");
    await page.getByLabel("Asunto", { exact: true }).fill("Propuesta");
    await page
      .getByLabel("Mensaje", { exact: true })
      .fill("Hola, me interesa tu trabajo.");
    await page.getByRole("button", { name: /enviar/i }).click();
    // El spinner de "Enviando" también es role=status: esperar el texto de éxito
    await expect(page.getByRole("status")).toContainText("te dejé un mensaje", {
      timeout: 10_000,
    });

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
    await expect(
      page.getByRole("link", { name: "Proyectos", exact: true }),
    ).toBeVisible({
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

test.describe("página 404", () => {
  test("se ve con su estilo, cumple la CSP y vuelve al inicio", async ({
    page,
  }) => {
    const getViolations = await recordCspViolations(page);
    const errors = collectPageErrors(page);
    const response = await page.goto("/404.html");
    expect(response?.headers()["content-security-policy"]).toBeTruthy();

    await expect(page).toHaveTitle(/no encontrada/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Esta página no existe",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
    // La hoja de estilos externa se aplicó (fondo oscuro del sitio)
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(5, 0, 16)",
    );

    await page.getByRole("link", { name: "Volver al portafolio" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hola");

    expect(await getViolations()).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("no tiene problemas graves de accesibilidad", async ({ page }) => {
    await page.goto("/404.html");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => v.id),
    ).toEqual([]);
  });
});
