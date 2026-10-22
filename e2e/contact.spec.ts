import { expect, test, type Page } from "@playwright/test";
import {
  AUTO_REPLY_TEMPLATE,
  mockEmailJs,
  NOTIFY_TEMPLATE,
  scrollToSection,
} from "./helpers";

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
  test("con éxito: un único mensaje y el formulario se vacía", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page);
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("status")).toContainText("te dejé un mensaje");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByLabel("Mensaje", { exact: true })).toHaveValue("");
    await expect.poll(() => calls.length).toBe(2);
    expect(calls.map((c) => c.template_id)).toEqual([
      NOTIFY_TEMPLATE,
      AUTO_REPLY_TEMPLATE,
    ]);
  });

  test("solo envía los cuatro campos, nunca el honeypot", async ({ page }) => {
    const calls = await mockEmailJs(page);
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect.poll(() => calls.length).toBeGreaterThan(0);
    expect(calls[0].template_params).toEqual({
      name: VALID.Nombre,
      email: VALID.Email,
      subject: VALID.Asunto,
      message: VALID.Mensaje,
    });
  });

  test("si falla el envío principal: solo el error y se conserva el texto", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page, { failTemplates: [NOTIFY_TEMPLATE] });
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("alert")).toHaveText(
      "No se pudo enviar el mensaje",
    );
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByLabel("Mensaje", { exact: true })).toHaveValue(
      VALID.Mensaje,
    );
    // Sin mensaje principal no se manda la respuesta automática
    expect(calls.map((c) => c.template_id)).toEqual([NOTIFY_TEMPLATE]);
  });

  test("si solo falla la respuesta automática, el visitante ve éxito", async ({
    page,
  }) => {
    await mockEmailJs(page, { failTemplates: [AUTO_REPLY_TEMPLATE] });
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("status")).toContainText("te dejé un mensaje");
    await expect(page.getByRole("alert")).toHaveCount(0);
  });

  test("con el honeypot lleno no se hace ninguna petición", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page);
    await page.goto("/", READY);
    await fillForm(page);
    await page.locator('input[name="company"]').fill("ACME", { force: true });
    await submit(page);

    await expect(page.getByRole("status")).toContainText("te dejé un mensaje");
    await page.waitForTimeout(500);
    expect(calls).toHaveLength(0);
  });

  test("el cooldown bloquea un segundo envío, también tras recargar", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page);
    await page.goto("/", READY);
    await fillForm(page);
    await submit(page);
    await expect(page.getByRole("status")).toBeVisible();

    await page.reload(READY);
    await fillForm(page);
    await submit(page);

    await expect(page.getByRole("alert")).toContainText(
      /Espera \d+ s para enviar otro mensaje/,
    );
    expect(calls.filter((c) => c.template_id === NOTIFY_TEMPLATE)).toHaveLength(
      1,
    );
  });

  test("valida el email y marca el campo inválido", async ({ page }) => {
    const calls = await mockEmailJs(page);
    await page.goto("/", READY);
    await fillForm(page, { Email: "no-es-email" });
    await submit(page);

    await expect(page.getByRole("alert")).toHaveText("El email es invalido");
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(calls).toHaveLength(0);
  });

  test("los campos tienen longitud máxima", async ({ page }) => {
    await page.goto("/", READY);
    await scrollToSection(page, "contact");
    const message = page.getByLabel("Mensaje", { exact: true });
    await message.fill("a".repeat(2500));
    await expect(message).toHaveValue("a".repeat(2000));
  });
});
