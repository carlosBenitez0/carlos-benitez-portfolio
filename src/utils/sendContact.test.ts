import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FORM_TOKEN_MIN_AGE_MS } from "./contactForm";
import {
  ContactRequestError,
  prepareContact,
  resetContactToken,
  sendContactMessage,
} from "./sendContact";

const data = {
  name: "  Carlos ",
  email: "carlos@gmail.com ",
  subject: "Propuesta",
  message: "Hola, me interesa tu trabajo.",
};

type Reply = { status: number; body?: unknown; headers?: HeadersInit };
let posts: Reply[];
let tokens: string[];
const fetchMock = vi.fn();

const respond = ({ status, body = {}, headers }: Reply) =>
  new Response(JSON.stringify(body), { status, headers });

beforeEach(() => {
  vi.useFakeTimers();
  resetContactToken();
  posts = [{ status: 200, body: { ok: true } }];
  tokens = ["token-1", "token-2"];
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (_url: string, init?: RequestInit) => {
    if (!init?.method)
      return respond({ status: 200, body: { token: tokens.shift() } });
    return respond(posts.shift() ?? { status: 200, body: { ok: true } });
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const postBodies = () =>
  fetchMock.mock.calls
    .filter(([, init]) => init?.method === "POST")
    .map(([, init]) => JSON.parse(init.body));

// Envía y avanza el reloj lo necesario para el tiempo mínimo de llenado
const send = async (company = "") => {
  const result = sendContactMessage(data, company);
  result.catch(() => {});
  // Alcanza también para el reintento, que vuelve a esperar
  await vi.advanceTimersByTimeAsync(3 * FORM_TOKEN_MIN_AGE_MS);
  return result;
};

describe("sendContactMessage", () => {
  it("pide un token y envía solo los campos esperados, recortados", async () => {
    await send();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/contact");
    expect(postBodies()).toEqual([
      {
        name: "Carlos",
        email: "carlos@gmail.com",
        subject: "Propuesta",
        message: "Hola, me interesa tu trabajo.",
        company: "",
        token: "token-1",
      },
    ]);
  });

  it("nunca llama a EmailJS desde el navegador", async () => {
    await send();
    for (const [url] of fetchMock.mock.calls) {
      expect(String(url)).not.toContain("emailjs");
    }
  });

  it("espera el tiempo mínimo antes de enviar", async () => {
    const result = sendContactMessage(data);
    await vi.advanceTimersByTimeAsync(FORM_TOKEN_MIN_AGE_MS - 100);
    expect(postBodies()).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1000);
    await result;
    expect(postBodies()).toHaveLength(1);
  });

  it("si el token se pidió al enfocar, no espera de más al enviar", async () => {
    prepareContact();
    await vi.advanceTimersByTimeAsync(10_000);
    await sendContactMessage(data);
    expect(postBodies()).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("con un token rechazado pide otro y reintenta una sola vez", async () => {
    posts = [{ status: 403, body: { error: "token_invalid" } }];
    await send();
    expect(postBodies().map((b) => b.token)).toEqual(["token-1", "token-2"]);
  });

  it("si el reintento también se rechaza, falla", async () => {
    posts = [{ status: 403 }, { status: 403 }];
    await expect(send()).rejects.toMatchObject({
      detail: { kind: "failed" },
    });
    expect(postBodies()).toHaveLength(2);
  });

  it("un error de validación del servidor indica el campo", async () => {
    posts = [
      {
        status: 400,
        body: {
          error: "invalid",
          field: "email",
          message: "Introduce un email válido",
        },
      },
    ];
    const error = await send().catch((e) => e);
    expect(error).toBeInstanceOf(ContactRequestError);
    expect(error.detail).toEqual({
      kind: "invalid",
      field: "email",
      message: "Introduce un email válido",
    });
  });

  it("el rate limit trae los segundos de espera", async () => {
    posts = [{ status: 429, body: { error: "rate_limited", retryAfter: 120 } }];
    await expect(send()).rejects.toMatchObject({
      detail: { kind: "rate_limited", retryAfter: 120 },
    });
  });

  it("un error del servidor o de red es un fallo genérico", async () => {
    posts = [{ status: 502, body: { error: "send_failed" } }];
    await expect(send()).rejects.toMatchObject({ detail: { kind: "failed" } });
  });

  it("si no se puede pedir el token, falla sin enviar", async () => {
    fetchMock.mockImplementationOnce(async () => {
      throw new TypeError("offline");
    });
    await expect(send()).rejects.toMatchObject({ detail: { kind: "failed" } });
    expect(postBodies()).toHaveLength(0);
  });
});

describe("prepareContact", () => {
  it("pide un solo token aunque se llame varias veces", async () => {
    prepareContact();
    prepareContact();
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(postBodies()).toHaveLength(0);
  });
});
