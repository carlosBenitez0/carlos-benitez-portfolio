import { createHmac, timingSafeEqual } from "node:crypto";
import { FORM_TOKEN_MIN_AGE_MS } from "../src/utils/contactRules.js";

// Token de formulario firmado por el servidor (sin CAPTCHA ni servicios
// externos). El navegador lo pide al empezar a usar el formulario y lo manda
// al enviar. Obliga a un bot a:
// - pedir un token antes de cada tanda (no basta con un POST a ciegas),
// - esperar un tiempo mínimo, como una persona que llena el formulario,
// - usarlo desde la misma IP a la que se emitió,
// - y usarlo antes de que venza.

export const TOKEN_MIN_AGE_MS = FORM_TOKEN_MIN_AGE_MS;
export const TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

const sign = (secret: string, issuedAt: number, ip: string) =>
  createHmac("sha256", secret)
    .update(`contact:${issuedAt}:${ip}`)
    .digest("base64url");

export const issueToken = (secret: string, ip: string, now: number) =>
  `${now}.${sign(secret, now, ip)}`;

export type TokenCheck = "ok" | "invalid" | "too_fast" | "expired";

export const checkToken = (
  secret: string,
  token: string,
  ip: string,
  now: number,
): TokenCheck => {
  const match = /^(\d{13})\.([\w-]{43})$/.exec(token);
  if (!match) return "invalid";
  const issuedAt = Number(match[1]);
  const expected = Buffer.from(sign(secret, issuedAt, ip));
  const received = Buffer.from(match[2]);
  if (!timingSafeEqual(expected, received)) return "invalid";

  const age = now - issuedAt;
  if (age < TOKEN_MIN_AGE_MS) return "too_fast";
  if (age > TOKEN_MAX_AGE_MS) return "expired";
  return "ok";
};
