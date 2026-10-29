import type { Page, Request, Route } from "@playwright/test";

export const SECTIONS = [
  "projects",
  "experience",
  "about",
  "technologies",
  "ai",
  "contact",
];

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

// --- API de contacto simulada -------------------------------------------------

// `vite preview` no ejecuta las funciones de Vercel: se simula /api/contact.
// GET entrega un token y cada POST responde con `replies` en orden (por
// defecto 200). Devuelve los cuerpos de los POST recibidos.
export interface ContactReply {
  status: number;
  body?: unknown;
}

export const mockContactApi = async (
  page: Page,
  { replies = [] as ContactReply[] } = {},
) => {
  const posts: Record<string, string>[] = [];
  await page.route("**/api/contact", async (route: Route) => {
    const request: Request = route.request();
    if (request.method() === "GET") {
      await route.fulfill({ json: { token: "e2e-token" } });
      return;
    }
    posts.push(request.postDataJSON() as Record<string, string>);
    const reply = replies.shift() ?? { status: 200, body: { ok: true } };
    await route.fulfill({ status: reply.status, json: reply.body ?? {} });
  });
  return posts;
};
