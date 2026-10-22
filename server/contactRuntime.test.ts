// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readConfig } from "./contactRuntime";

const env = {
  CONTACT_SIGNING_SECRET: "s".repeat(32),
  EMAILJS_SERVICE_ID: "service",
  EMAILJS_TEMPLATE_ID: "template",
  EMAILJS_PUBLIC_KEY: "public",
  EMAILJS_PRIVATE_KEY: "private",
  CONTACT_ALLOWED_ORIGINS:
    "https://carlosbenitez.dev/, https://www.carlosbenitez.dev",
};

describe("readConfig", () => {
  it("sin alguna clave no hay configuración (el endpoint falla cerrado)", () => {
    expect(readConfig({ ...env, EMAILJS_PRIVATE_KEY: undefined })).toBeNull();
    expect(readConfig({ ...env, CONTACT_SIGNING_SECRET: "" })).toBeNull();
  });

  it("no acepta un secreto de firma corto", () => {
    expect(readConfig({ ...env, CONTACT_SIGNING_SECRET: "corto" })).toBeNull();
  });

  it("en producción no permite localhost", () => {
    const config = readConfig({
      ...env,
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "carlos.vercel.app",
    })!;
    expect(config.allowedOrigins).toEqual([
      "https://carlosbenitez.dev",
      "https://www.carlosbenitez.dev",
      "https://carlos.vercel.app",
    ]);
  });

  it("fuera de producción permite localhost", () => {
    const config = readConfig({ ...env, VERCEL_ENV: "preview" })!;
    expect(config.allowedOrigins).toContain("http://localhost:3000");
  });
});
