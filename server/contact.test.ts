// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleContact, MAX_BODY_BYTES, type ContactDeps } from "./contact";
import { issueToken, TOKEN_MIN_AGE_MS } from "./formToken";
import type { LimitResult } from "./rateLimit";

const ORIGIN = "https://carlosbenitez.dev";
const IP = "203.0.113.7";
const SECRET = "s".repeat(32);
const ISSUED = 1_700_000_000_000;
// Envío normal: el token se pidió hace 10 s
const NOW = ISSUED + 10_000;

const valid = {
  name: "Carlos",
  email: "carlos@gmail.com",
  subject: "Propuesta",
  message: "Hola, me interesa tu trabajo.",
  company: "",
  token: issueToken(SECRET, IP, ISSUED),
};

const allow = (): LimitResult => ({ success: true, reset: NOW });
const deny = (): LimitResult => ({ success: false, reset: NOW + 90_000 });

let deps: ContactDeps;
let fetchMock: ReturnType<typeof vi.fn>;
let emailjsStatus: number;

beforeEach(() => {
  emailjsStatus = 200;
  fetchMock = vi.fn(async () => new Response("OK", { status: emailjsStatus }));
  deps = {
    config: {
      allowedOrigins: [ORIGIN],
      signingSecret: SECRET,
      emailjs: {
        serviceId: "service",
        templateId: "template",
        publicKey: "public",
        privateKey: "private",
      },
    },
    tokenLimiter: vi.fn(allow),
    ipLimiters: [vi.fn(allow), vi.fn(allow)],
    emailLimiter: vi.fn(allow),
    globalLimiter: vi.fn(allow),
    fetch: fetchMock as unknown as typeof fetch,
    log: vi.fn(),
    now: () => NOW,
  };
});

const request = (
  body: unknown = valid,
  {
    method = "POST",
    origin = ORIGIN,
    contentType = "application/json",
    ip = IP,
  } = {},
) =>
  new Request("https://carlosbenitez.dev/api/contact", {
    method,
    headers: { origin, "content-type": contentType, "x-real-ip": ip },
    body:
      method === "GET"
        ? undefined
        : typeof body === "string"
          ? body
          : JSON.stringify(body),
  });

const sentParams = () => {
  const [[, init]] = fetchMock.mock.calls;
  return JSON.parse(String(init.body));
};

describe("handleContact: la petición", () => {
  it.each(["PUT", "DELETE"])("rechaza %s", async (method) => {
    const response = await handleContact(request(valid, { method }), deps);
    expect(response.status).toBe(405);
  });

  it("rechaza otros orígenes", async () => {
    const response = await handleContact(
      request(valid, { origin: "https://evil.example" }),
      deps,
    );
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rechaza lo que no es JSON", async () => {
    const response = await handleContact(
      request("name=x", { contentType: "application/x-www-form-urlencoded" }),
      deps,
    );
    expect(response.status).toBe(415);
  });

  it("rechaza cuerpos de más de 8 KB", async () => {
    const response = await handleContact(
      request({ ...valid, message: "a".repeat(MAX_BODY_BYTES) }),
      deps,
    );
    expect(response.status).toBe(413);
  });

  it.each([
    ["JSON roto", "{nope"],
    ["un array", [valid]],
    ["un campo de más", { ...valid, extra: "x" }],
    ["un campo que falta", { ...valid, token: undefined }],
    ["un campo que no es texto", { ...valid, name: 42 }],
  ])("rechaza %s", async (_, body) => {
    const response = await handleContact(request(body), deps);
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sin configuración responde 503 y no envía", async () => {
    const response = await handleContact(request(), { ...deps, config: null });
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("las respuestas no se cachean", async () => {
    const response = await handleContact(request(), deps);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("handleContact: token de formulario", () => {
  it("GET entrega un token que sirve para enviar desde esa IP", async () => {
    const issued = await handleContact(request(null, { method: "GET" }), {
      ...deps,
      now: () => ISSUED,
    });
    expect(issued.status).toBe(200);
    const { token } = await issued.json();

    const response = await handleContact(request({ ...valid, token }), deps);
    expect(response.status).toBe(200);
  });

  it("limita cuántos tokens pide una IP", async () => {
    deps.tokenLimiter = vi.fn(deny);
    const response = await handleContact(
      request(null, { method: "GET" }),
      deps,
    );
    expect(response.status).toBe(429);
  });

  it.each([
    ["vacío", { token: "" }, {}],
    ["inventado", { token: `${ISSUED}.${"x".repeat(43)}` }, {}],
    ["de otra IP", {}, { ip: "198.51.100.1" }],
    [
      "firmado con otro secreto",
      { token: issueToken("t".repeat(32), IP, ISSUED) },
      {},
    ],
  ])("con un token %s no envía", async (_, override, options) => {
    const response = await handleContact(
      request({ ...valid, ...override }, options),
      deps,
    );
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rechaza un envío más rápido que una persona", async () => {
    const response = await handleContact(request(), {
      ...deps,
      now: () => ISSUED + TOKEN_MIN_AGE_MS - 1,
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "token_too_fast" });
  });

  it("rechaza un token vencido", async () => {
    const response = await handleContact(request(), {
      ...deps,
      now: () => ISSUED + 3 * 60 * 60 * 1000,
    });
    expect(await response.json()).toEqual({ error: "token_expired" });
  });
});

describe("handleContact: contenido", () => {
  it("con el honeypot lleno responde éxito sin enviar", async () => {
    const response = await handleContact(
      request({ ...valid, company: "ACME" }),
      deps,
    );
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("valida igual que el formulario y devuelve el campo con error", async () => {
    const response = await handleContact(
      request({ ...valid, email: "no-es-email" }),
      deps,
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "invalid",
      field: "email",
      message: "Introduce un email válido",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rechaza mensajes con más de 3 enlaces", async () => {
    const response = await handleContact(
      request({
        ...valid,
        message: "a https://a.com b https://b.com c www.c.com d http://d.com",
      }),
      deps,
    );
    expect(response.status).toBe(400);
    expect((await response.json()).field).toBe("message");
  });

  it("los invisibles no cuentan para el largo mínimo", async () => {
    const response = await handleContact(
      request({ ...valid, name: "a\u200B\u200B\u200Bb" }),
      deps,
    );
    expect(response.status).toBe(400);
    expect((await response.json()).field).toBe("name");
  });

  it("envía el texto saneado: sin saltos en el asunto ni invisibles", async () => {
    await handleContact(
      request({
        ...valid,
        subject: "Hola\r\nBcc: victima@example.com",
        message: "Línea uno\r\nLínea\u200B dos\u0007",
      }),
      deps,
    );
    expect(sentParams().template_params).toEqual({
      name: "Carlos",
      email: "carlos@gmail.com",
      subject: "Hola Bcc: victima@example.com",
      message: "Línea uno\nLínea dos",
    });
  });
});

describe("handleContact: rate limit", () => {
  it("por IP: 429 con Retry-After", async () => {
    deps.ipLimiters = [vi.fn(deny)];
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("90");
    expect(await response.json()).toEqual({
      error: "rate_limited",
      retryAfter: 90,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("un token inválido no gasta ningún cupo", async () => {
    await handleContact(request({ ...valid, token: "x" }), deps);
    for (const limiter of [
      ...deps.ipLimiters,
      deps.emailLimiter,
      deps.globalLimiter,
    ]) {
      expect(limiter).not.toHaveBeenCalled();
    }
  });

  it.each(["emailLimiter", "globalLimiter"] as const)(
    "%s agotado: 429 y no envía",
    async (limiter) => {
      deps[limiter] = vi.fn(deny);
      const response = await handleContact(request(), deps);
      expect(response.status).toBe(429);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("el límite por email no distingue mayúsculas", async () => {
    await handleContact(request({ ...valid, email: "Carlos@Gmail.com" }), deps);
    expect(deps.emailLimiter).toHaveBeenCalledWith("carlos@gmail.com");
  });
});

describe("handleContact: envío", () => {
  it("con éxito llama una sola vez a EmailJS con la clave privada", async () => {
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.emailjs.com/api/v1.0/email/send",
    );
    expect(sentParams()).toMatchObject({
      service_id: "service",
      template_id: "template",
      user_id: "public",
      accessToken: "private",
    });
  });

  it("si EmailJS falla responde 502 sin detalles", async () => {
    emailjsStatus = 400;
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send_failed" });
  });

  it("los logs no incluyen los datos del visitante", async () => {
    await handleContact(request(), deps);
    const logged = JSON.stringify(vi.mocked(deps.log).mock.calls);
    expect(logged).not.toContain("carlos@gmail.com");
    expect(logged).not.toContain(IP);
  });
});
