import type { Page, Request, Route } from "@playwright/test";

export const SECTIONS = ["projects", "about", "technologies", "ai", "contact"];

// Errores de recursos externos (Cloudinary, Google Fonts) no dependen del
// código: solo cuentan los errores de la propia página.
export const collectPageErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().startsWith("Failed to load resource")
    ) {
      errors.push(message.text());
    }
  });
  return errors;
};

export const scrollToSection = (page: Page, id: string) =>
  page.evaluate((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, id);

// Recorre todas las secciones para que cargue y se anime todo el contenido.
export const visitAllSections = async (page: Page) => {
  for (const id of SECTIONS) {
    await scrollToSection(page, id);
    await page.waitForTimeout(300);
  }
};

// Registra las violaciones de CSP desde antes de que cargue la página.
export const recordCspViolations = async (page: Page) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __cspViolations: string[] };
    w.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      w.__cspViolations.push(
        `${event.effectiveDirective} -> ${event.blockedURI}`,
      );
    });
  });
  return () =>
    page.evaluate(
      () =>
        (window as unknown as { __cspViolations: string[] }).__cspViolations,
    );
};

// --- EmailJS simulado ---------------------------------------------------------

export const NOTIFY_TEMPLATE = "template_vx2h6qt";
export const AUTO_REPLY_TEMPLATE = "template_32ukwf4";

export interface EmailJsCall {
  template_id: string;
  service_id: string;
  template_params: Record<string, string>;
}

// Intercepta la API de EmailJS: nunca se envía un correo real. `failTemplates`
// responde 400 para esas plantillas.
export const mockEmailJs = async (
  page: Page,
  { failTemplates = [] as string[] } = {},
) => {
  const calls: EmailJsCall[] = [];
  await page.route("https://api.emailjs.com/**", async (route: Route) => {
    const request: Request = route.request();
    const body = request.postDataJSON() as EmailJsCall;
    calls.push(body);
    const fail = failTemplates.includes(body.template_id);
    await route.fulfill({
      status: fail ? 400 : 200,
      contentType: "text/plain",
      body: fail ? "Bad request" : "OK",
    });
  });
  return calls;
};
