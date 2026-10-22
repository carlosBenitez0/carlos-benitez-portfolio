import { expect, test, type Page } from "@playwright/test";
import { mockContactApi, scrollToSection } from "./helpers";

// El formulario no depende de imágenes ni fuentes externas: esperar al evento
// "load" (Cloudinary, Google Fonts) solo añade latencia de terceros. Con
// domcontentloaded los módulos ya se ejecutaron y React ya renderizó.
const READY = { waitUntil: "domcontentloaded" } as const;

const VALID = {
  Nombre: "Carlos",
  Email: "carlos.f.benitez+trabajo@gmail.com",
  Asunto: "Propuesta",
  Mensaje: "Hola, me interesa tu trabajo.",
};

const fillForm = async (page: Page, overrides: Partial<typeof VALID> = {}) => {
  await scrollToSection(page, "contact");
  for (const [label, value] of Object.entries({ ...VALID, ...overrides })) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
};

const submit = (page: Page) =>
  page.getByRole("button", { name: /enviar/i }).click();

test.describe("formulario de contacto", () => {
  test("con éxito: un único envío y el formulario se vacía", async ({
    page,
  }) => {
    const posts = await mockContactApi(page);
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("status")).toContainText("te dejé un mensaje", {
      timeout: 10_000,
    });
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByLabel("Mensaje", { exact: true })).toHaveValue("");
    expect(posts).toHaveLength(1);
  });

  test("envía al servidor propio los campos, el honeypot y el token", async ({
    page,
  }) => {
    const posts = await mockContactApi(page);
    const external: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("emailjs")) external.push(request.url());
    });
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("status")).toContainText("te dejé un mensaje", {
      timeout: 10_000,
    });
    expect(posts[0]).toEqual({
      name: VALID.Nombre,
      email: VALID.Email,
      subject: VALID.Asunto,
      message: VALID.Mensaje,
      company: "",
      token: "e2e-token",
    });
    // El navegador nunca habla directo con EmailJS
    expect(external).toEqual([]);
  });

  test("si falla el envío: solo el error y se conserva el texto", async ({
    page,
  }) => {
    await mockContactApi(page, {
      replies: [{ status: 502, body: { error: "send_failed" } }],
    });
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("alert")).toHaveText(
      "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.",
      { timeout: 10_000 },
    );
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByLabel("Mensaje", { exact: true })).toHaveValue(
      VALID.Mensaje,
    );
  });

  test("con rate limit del servidor dice cuánto esperar", async ({ page }) => {
    await mockContactApi(page, {
      replies: [
        { status: 429, body: { error: "rate_limited", retryAfter: 120 } },
      ],
    });
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("alert")).toHaveText(
      "Demasiados envíos seguidos. Inténtalo de nuevo en 2 min",
      { timeout: 10_000 },
    );
  });

  test("con el honeypot lleno no se envía nada", async ({ page }) => {
    const posts = await mockContactApi(page);
    await page.goto("/", READY);
    await fillForm(page);
    await page.locator('input[name="company"]').fill("ACME", { force: true });
    await submit(page);

    await expect(page.getByRole("status")).toContainText("te dejé un mensaje", {
      timeout: 10_000,
    });
    await page.waitForTimeout(500);
    expect(posts).toHaveLength(0);
  });

  test("el cooldown bloquea un segundo envío, también tras recargar", async ({
    page,
  }) => {
    // Dos cargas completas de la página en un mismo test: con la máquina
    // cargada supera los 30 s por defecto.
    test.slow();
    const posts = await mockContactApi(page);
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);
    // El spinner de "Enviando" también es role=status: esperar el texto de éxito
    await expect(page.getByRole("status")).toContainText("te dejé un mensaje", {
      timeout: 10_000,
    });

    await page.reload(READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("alert")).toContainText(
      /Espera \d+ s antes de enviar otro mensaje/,
      { timeout: 10_000 },
    );
    expect(posts).toHaveLength(1);
  });

  test("valida el email y marca el campo inválido", async ({ page }) => {
    const posts = await mockContactApi(page);
    await page.goto("/", READY);
    await fillForm(page, { Email: "no-es-email" });
    await submit(page);

    await expect(page.getByRole("alert")).toHaveText(
      "Introduce un email válido",
      {
        timeout: 10_000,
      },
    );
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(posts).toHaveLength(0);
  });

  test("los campos tienen longitud máxima", async ({ page }) => {
    await page.goto("/", READY);
    await scrollToSection(page, "contact");
    const message = page.getByLabel("Mensaje", { exact: true });
    await message.fill("a".repeat(2500));
    await expect(message).toHaveValue("a".repeat(2000));
  });
});
