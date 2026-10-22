// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  checkToken,
  issueToken,
  TOKEN_MAX_AGE_MS,
  TOKEN_MIN_AGE_MS,
} from "./formToken";

const SECRET = "s".repeat(32);
const IP = "203.0.113.7";
const T = 1_700_000_000_000;

describe("formToken", () => {
  const token = issueToken(SECRET, IP, T);

  it("es válido desde el tiempo mínimo hasta que vence", () => {
    expect(checkToken(SECRET, token, IP, T + TOKEN_MIN_AGE_MS)).toBe("ok");
    expect(checkToken(SECRET, token, IP, T + TOKEN_MAX_AGE_MS)).toBe("ok");
  });

  it("antes del tiempo mínimo es demasiado rápido", () => {
    expect(checkToken(SECRET, token, IP, T + TOKEN_MIN_AGE_MS - 1)).toBe(
      "too_fast",
    );
  });

  it("después del máximo está vencido", () => {
    expect(checkToken(SECRET, token, IP, T + TOKEN_MAX_AGE_MS + 1)).toBe(
      "expired",
    );
  });

  it("no sirve desde otra IP ni con otro secreto", () => {
    const now = T + 10_000;
    expect(checkToken(SECRET, token, "198.51.100.1", now)).toBe("invalid");
    expect(checkToken("t".repeat(32), token, IP, now)).toBe("invalid");
  });

  it("no se puede adelantar la fecha sin romper la firma", () => {
    const [, signature] = token.split(".");
    const forged = `${T - 60_000}.${signature}`;
    expect(checkToken(SECRET, forged, IP, T + 10_000)).toBe("invalid");
  });

  it.each(["", "abc", `${T}`, `${T}.`, `${T}.${"x".repeat(200)}`])(
    "rechaza un token mal formado: %s",
    (bad) => {
      expect(checkToken(SECRET, bad, IP, T + 10_000)).toBe("invalid");
    },
  );
});
