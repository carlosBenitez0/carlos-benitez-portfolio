import {
  isHoneypotFilled,
  sanitizeContact,
  validateContact,
  type ContactData,
} from "../src/utils/contactRules.js";
import { checkToken, issueToken } from "./formToken.js";
import type { Limiter } from "./rateLimit.js";

// Endpoint del formulario de contacto. Todas las defensas viven aquí: lo que
// corre en el navegador (validación, cooldown, honeypot) es solo UX y un
// script puede saltárselo. Los pasos van de lo más barato a lo más caro.
//   GET  /api/contact → token de formulario firmado (ver formToken.ts)
//   POST /api/contact → envía el mensaje

export const MAX_BODY_BYTES = 8 * 1024;
const BODY_KEYS = ["name", "email", "subject", "message", "company", "token"];
const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

export interface ContactConfig {
  allowedOrigins: string[];
  signingSecret: string;
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
    privateKey: string;
  };
}

export interface ContactDeps {
  config: ContactConfig | null;
  /** Por IP, para pedir tokens */
  tokenLimiter: Limiter;
  /** Por IP, para enviar */
  ipLimiters: Limiter[];
  /** Por email remitente */
  emailLimiter: Limiter;
  /** Tope total de la instancia */
  globalLimiter: Limiter;
  fetch: typeof fetch;
  log: (entry: Record<string, unknown>) => void;
  now: () => number;
}

const json = (status: number, body: unknown, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });

const reject = (
  deps: ContactDeps,
  status: number,
  reason: string,
  headers?: HeadersInit,
) => {
  deps.log({ outcome: "rejected", status, reason });
  return json(status, { error: reason }, headers);
};

const rateLimited = (deps: ContactDeps, reason: string, reset: number) => {
  const seconds = Math.max(1, Math.ceil((reset - deps.now()) / 1000));
  deps.log({ outcome: "rejected", status: 429, reason });
  return json(
    429,
    { error: "rate_limited", retryAfter: seconds },
    { "Retry-After": String(seconds) },
  );
};

// Vercel pone la IP real del cliente en x-real-ip / x-vercel-forwarded-for
export const clientIp = (request: Request) =>
  request.headers.get("x-real-ip") ??
  request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ??
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
  "unknown";

type Body = ContactData & { company: string; token: string };

const parseBody = (raw: string): Body | null => {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return null;
  }
  const keys = Object.keys(data);
  const exact =
    keys.length === BODY_KEYS.length &&
    BODY_KEYS.every(
      (key) => typeof (data as Record<string, unknown>)[key] === "string",
    );
  return exact ? (data as Body) : null;
};

const sendEmail = async (
  deps: ContactDeps,
  config: ContactConfig,
  data: ContactData,
) => {
  const response = await deps.fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.emailjs.serviceId,
      template_id: config.emailjs.templateId,
      user_id: config.emailjs.publicKey,
      accessToken: config.emailjs.privateKey,
      template_params: data,
    }),
  });
  return response.ok;
};

const handleTokenRequest = (
  request: Request,
  deps: ContactDeps,
  config: ContactConfig,
) => {
  const ip = clientIp(request);
  const limit = deps.tokenLimiter(ip);
  if (!limit.success) return rateLimited(deps, "token_limit", limit.reset);
  return json(200, { token: issueToken(config.signingSecret, ip, deps.now()) });
};

export const handleContact = async (
  request: Request,
  deps: ContactDeps,
): Promise<Response> => {
  if (request.method !== "POST" && request.method !== "GET") {
    return reject(deps, 405, "method_not_allowed", { Allow: "GET, POST" });
  }

  const { config } = deps;
  if (!config) {
    deps.log({ outcome: "error", reason: "not_configured" });
    return json(503, { error: "unavailable" });
  }

  if (request.method === "GET")
    return handleTokenRequest(request, deps, config);

  const origin = request.headers.get("origin") ?? "";
  if (!config.allowedOrigins.includes(origin)) {
    return reject(deps, 403, "origin");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return reject(deps, 415, "content_type");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return reject(deps, 413, "too_large");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return reject(deps, 413, "too_large");
  }

  const body = parseBody(raw);
  if (!body) return reject(deps, 400, "malformed");

  // Al bot se le responde éxito sin enviar nada, para no darle pistas
  if (isHoneypotFilled(body.company)) {
    deps.log({ outcome: "honeypot" });
    return json(200, { ok: true });
  }

  const ip = clientIp(request);
  const token = checkToken(config.signingSecret, body.token, ip, deps.now());
  if (token !== "ok") return reject(deps, 403, `token_${token}`);

  const data = sanitizeContact(body);
  const invalid = validateContact(data);
  if (invalid) {
    deps.log({ outcome: "rejected", status: 400, reason: "invalid" });
    return json(400, {
      error: "invalid",
      field: invalid.name,
      message: invalid.error,
    });
  }

  // Los cupos se consumen solo con un token válido y datos correctos
  for (const limiter of deps.ipLimiters) {
    const limit = limiter(ip);
    if (!limit.success) return rateLimited(deps, "ip_limit", limit.reset);
  }
  const emailLimit = deps.emailLimiter(data.email.toLowerCase());
  if (!emailLimit.success) {
    return rateLimited(deps, "email_limit", emailLimit.reset);
  }
  const globalLimit = deps.globalLimiter("all");
  if (!globalLimit.success) {
    return rateLimited(deps, "global_limit", globalLimit.reset);
  }

  try {
    if (!(await sendEmail(deps, config, data))) {
      deps.log({ outcome: "error", reason: "emailjs" });
      return json(502, { error: "send_failed" });
    }
  } catch {
    deps.log({ outcome: "error", reason: "emailjs_network" });
    return json(502, { error: "send_failed" });
  }

  deps.log({ outcome: "sent" });
  return json(200, { ok: true });
};
