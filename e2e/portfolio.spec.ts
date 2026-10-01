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
    await expect(wave).toHaveCSS("animation-play-state", "running");
    const [before, after] = await transformsOver(page, ".contact-wave-a", 400);
    expect(after).not.toBe(before);
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
