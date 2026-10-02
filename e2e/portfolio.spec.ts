import { expect, test, type Page } from "@playwright/test";
import { collectPageErrors, scrollToSection, SECTIONS } from "./helpers";

// Valor de `transform` de un elemento en dos momentos separados por `ms`.
const transformsOver = (page: Page, selector: string, ms: number) =>
  page.evaluate(
    async ({ selector, ms }) => {
      const el = document.querySelector(selector)!;
      const before = getComputedStyle(el).transform;
      await new Promise((resolve) => setTimeout(resolve, ms));
      return [before, getComputedStyle(el).transform];
    },
    { selector, ms },
  );

test.describe("carga", () => {
  test("renderiza todas las secciones sin errores de JavaScript", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hola");
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await scrollToSection(page, "contact");
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });

  test("solo pide los pesos de Poppins que se usan", async ({ page }) => {
    const fontCss: string[] = [];
    page.on("request", (request) => {
      if (request.url().startsWith("https://fonts.googleapis.com/css2")) {
        fontCss.push(decodeURIComponent(request.url()));
      }
    });
    await page.goto("/");

    expect(fontCss).toHaveLength(1);
    expect(fontCss[0]).toContain(
      "Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400",
    );
  });
});

test.describe("navbar", () => {
  test("termina la intro con la píldora a su tamaño final", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    const projectsLink = page.getByRole("link", { name: "Proyectos" });
    await expect(projectsLink).toBeVisible({ timeout: 15_000 });

    const pill = page.locator("nav ul.fade-in-menu");
    await expect(pill).toHaveCSS("height", isMobile ? "40px" : "50px");
    // La intro ya no deja clip-path ni transform residuales
    await expect(pill).toHaveCSS("clip-path", "none");
  });

  test("los links llevan a cada sección", async ({ page }) => {
    await page.goto("/");
    for (const [name, id] of [
      ["Proyectos", "projects"],
      ["Tecnologías", "technologies"],
      ["Contáctame", "contact"],
    ]) {
      const link = page.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible({ timeout: 15_000 });
      await link.click();
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5_000 });
    }
  });
});

test.describe("responsive", () => {
  test("en móvil se pinta el layout móvil desde el primer render", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "solo aplica a móvil");

    // Registra si el texto de escritorio del link llegó a aparecer alguna vez
    await page.addInitScript(() => {
      const w = window as unknown as { __desktopTextSeen: boolean };
      w.__desktopTextSeen = false;
      new MutationObserver(() => {
        const link = document.querySelector('a[aria-label="Proyectos"]');
        if (link?.textContent?.includes("Proyectos"))
          w.__desktopTextSeen = true;
      }).observe(document, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    });
    await page.goto("/");
    // Durante la intro el link existe pero aún está oculto (autoAlpha 0)
    await expect(page.locator('a[aria-label="Proyectos"]')).toBeAttached();
    await page.waitForTimeout(500);

    const seen = await page.evaluate(
      () =>
        (window as unknown as { __desktopTextSeen: boolean }).__desktopTextSeen,
    );
    expect(seen).toBe(false);
  });
});

test.describe("animaciones fuera de pantalla", () => {
  test("las secciones se marcan y desmarcan como fuera de pantalla", async ({
    page,
  }) => {
    await page.goto("/");
    const header = page.locator("header");
    const contact = page.locator("#contact");

    await expect(header).not.toHaveAttribute("data-offscreen");
    await expect(contact).toHaveAttribute("data-offscreen", "");

    await scrollToSection(page, "contact");
    await expect(contact).not.toHaveAttribute("data-offscreen");
    await expect(header).toHaveAttribute("data-offscreen", "");
  });

  test("el brillo del texto se pausa fuera de pantalla y vuelve al regresar", async ({
    page,
  }) => {
    await page.goto("/");
    const headerShine = page.locator("header .shiny-text").first();
    await expect(headerShine).toHaveCSS("animation-play-state", "running");

    await scrollToSection(page, "contact");
    await expect(headerShine).toHaveCSS("animation-play-state", "paused");

    await scrollToSection(page, "start");
    await expect(headerShine).toHaveCSS("animation-play-state", "running");
  });

  test("las olas de contacto solo corren mientras se ven", async ({ page }) => {
    await page.goto("/");
    const wave = page.locator(".contact-wave-a");
    await expect(wave).toHaveCSS("animation-play-state", "paused");

    await scrollToSection(page, "contact");
    await expect(wave).toHaveCSS("animation-play-state", "running", {
      timeout: 10_000,
    });
    // Con la máquina cargada los frames se espacian: esperar a que se mueva
    const start = await wave.evaluate((el) => getComputedStyle(el).transform);
    await expect
      .poll(() => wave.evaluate((el) => getComputedStyle(el).transform), {
        timeout: 10_000,
      })
      .not.toBe(start);
  });

  test("las manchas del hero se congelan cuando el hero no se ve", async ({
    page,
  }) => {
    await page.goto("/");
    // Esperar a que termine la intro y empiece la deriva
    await page.waitForTimeout(9_000);
    const [moving1, moving2] = await transformsOver(page, "header .dot", 500);
    expect(moving2).not.toBe(moving1);

    await scrollToSection(page, "contact");
    await page.waitForTimeout(300);
    const [frozen1, frozen2] = await transformsOver(page, "header .dot", 800);
    expect(frozen2).toBe(frozen1);
  });
});

test.describe("reducir movimiento", () => {
  test.use({ reducedMotion: "reduce" });

  test("desactiva bucles decorativos y el scroll suave", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".shiny-text").first()).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".contact-wave-a")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".contact-canoe")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".canoe-paddle")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".contact-bird").first()).toBeHidden();
    // La bandera queda quieta: su trazo no cambia
    const outline = page.locator('.waving-flag path[data-shape="outline"]');
    const before = await outline.getAttribute("d");
    await page.waitForTimeout(400);
    expect(await outline.getAttribute("d")).toBe(before);
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  });

  test("los revelados al hacer scroll usan solo opacidad", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".proyect-card-anim").first()).toHaveCSS(
      "animation-name",
      "fade-only",
    );
  });

  test("el contenido del hero queda visible sin la intro larga", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
      "opacity",
      "1",
      { timeout: 3_000 },
    );
  });
});

test.describe("esquema de color del sistema", () => {
  // El sitio es siempre oscuro: el modo claro del sistema no debe cambiar
  // ningún color de texto.
  test("el modo claro del sistema no altera los textos", async ({
    browser,
  }) => {
    const colorsIn = async (colorScheme: "light" | "dark") => {
      const page = await browser.newPage({ colorScheme });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const colors = await page.evaluate(() =>
        [...document.querySelectorAll("p, span, h1, h2, h3, h4, a, li")].map(
          (el) => getComputedStyle(el).color,
        ),
      );
      await page.close();
      return colors;
    };
    expect(await colorsIn("light")).toEqual(await colorsIn("dark"));
  });
});

test.describe("textos", () => {
  test("sin erratas conocidas ni descripciones incorrectas", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Mostrar información" }).click();
    const text = await page.locator("body").innerText();

    for (const wrong of [
      "FORMANDOME",
      "technologías",
      "clickea",
      "Comportamiento Predictivo",
    ]) {
      expect(text).not.toContain(wrong);
    }
    expect(text).toContain("FORMÁNDOME");
    expect(text).toContain("Model Context Protocol");
  });
});

test.describe("SEO", () => {
  const SITE = "https://carlos-benitez-portfolio.vercel.app/";

  test("tiene metadatos para buscadores y redes sociales", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const meta = (selector: string) =>
      page.locator(selector).getAttribute("content");

    await expect(page).toHaveTitle("Carlos Benítez | Desarrollador Web");
    expect(await meta('meta[name="description"]')).toBeTruthy();
    expect(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
    ).toBe(SITE);
    expect(await meta('meta[property="og:url"]')).toBe(SITE);
    expect(await meta('meta[property="og:image"]')).toMatch(
      /^https:\/\/res\.cloudinary\.com\/.+w_1200,h_630/,
    );
    expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(await page.locator("html").getAttribute("lang")).toBe("es");
  });

  test("sirve robots.txt y sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain(`Sitemap: ${SITE}sitemap.xml`);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain(`<loc>${SITE}</loc>`);
  });
});

test.describe("sección de IA", () => {
  test("muestra los agentes de programación y las áreas de estudio actuales", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const ai = page.locator("#ai");

    for (const tool of ["Claude Code", "Codex", "OpenCode"]) {
      await expect(
        ai.getByRole("heading", { level: 4, name: tool, exact: true }),
      ).toBeAttached();
    }
    for (const area of [
      "Agentes de IA",
      "Context Engineering",
      "MCP",
      "Evals y verificación",
    ]) {
      await expect(
        ai.getByRole("heading", { level: 4, name: area, exact: true }),
      ).toBeAttached();
    }
    // Orden por importancia: primero los agentes de programación de Claude
    // Las tarjetas de herramientas van antes que las áreas de estudio
    const tools = await ai.locator("h4").allTextContents();
    expect(tools.slice(0, 4)).toEqual([
      "Claude Code",
      "ClaudeAI",
      "Codex",
      "OpenCode",
    ]);

    // Áreas reemplazadas
    await expect(ai.getByText("Vibecoding")).toHaveCount(0);
    await expect(ai.getByText("Prompt Engineering")).toHaveCount(0);
    await expect(ai.getByText("Editores de Código")).toHaveCount(0);
  });
});

test.describe("canoa del formulario de contacto", () => {
  test("navega sincronizada con la ola y se pausa fuera de pantalla", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "en móvil la canoa no se muestra");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const canoe = page.locator(".contact-canoe");
    await expect(canoe).toHaveCSS("animation-name", "contact-canoe");
    // Misma duración que la ola delantera que acompaña
    await expect(canoe).toHaveCSS("animation-duration", "6s");
    await expect(page.locator(".contact-wave-c")).toHaveCSS(
      "animation-duration",
      "6s",
    );
    await expect(canoe).toHaveCSS("animation-play-state", "paused");

    await scrollToSection(page, "contact");
    await expect(canoe).toHaveCSS("animation-play-state", "running", {
      timeout: 10_000,
    });
  });

  test("el remero rema y los pájaros aletean mientras se ve la sección", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "en móvil la canoa no se muestra");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const paddle = page.locator(".canoe-paddle");
    const wing = page.locator(".bird-wing-inner").first();
    await expect(page.locator(".contact-bird")).toHaveCount(3);
    await expect(paddle).toHaveCSS("animation-name", "canoe-stroke");
    await expect(wing).toHaveCSS("animation-name", "bird-wing-inner");
    await expect(paddle).toHaveCSS("animation-play-state", "paused");
    await expect(wing).toHaveCSS("animation-play-state", "paused");

    await scrollToSection(page, "contact");
    await expect(paddle).toHaveCSS("animation-play-state", "running", {
      timeout: 10_000,
    });
    await expect(wing).toHaveCSS("animation-play-state", "running");
  });

  test("la bandera ondea solo mientras se ve la sección", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const flag = page.getByRole("img", { name: "Bandera de El Salvador" });
    await expect(flag).toBeAttached();
    const outline = page.locator('.waving-flag path[data-shape="outline"]');
    const d = () => outline.getAttribute("d");

    // Fuera de pantalla: quieta
    const offA = await d();
    await page.waitForTimeout(400);
    expect(await d()).toBe(offA);

    // En pantalla: el trazo cambia cuadro a cuadro
    await scrollToSection(page, "contact");
    const onA = await d();
    await expect.poll(d, { timeout: 10_000 }).not.toBe(onA);
  });

  test("en móvil no tapa el formulario", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo aplica a móvil");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".contact-canoe")).toBeHidden();
  });
});
