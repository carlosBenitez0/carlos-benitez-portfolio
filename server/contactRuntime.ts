import type { ContactConfig, ContactDeps } from "./contact.js";
import { createLimiter } from "./rateLimit.js";

// Conecta handleContact con el entorno real (variables de Vercel). Si falta
// alguna, el endpoint responde 503 (falla cerrado): nunca envía sin firma.

type Env = Record<string, string | undefined>;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const allowedOrigins = (env: Env) => {
  const origins = (env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
  // URLs que Vercel asigna a este deployment (previews incluidas)
  for (const host of [
    env.VERCEL_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (host) origins.push(`https://${host}`);
  }
  if (env.VERCEL_ENV !== "production") {
    origins.push("http://localhost:3000", "http://localhost:5173");
  }
  return [...new Set(origins)];
};

export const readConfig = (env: Env): ContactConfig | null => {
  const {
    CONTACT_SIGNING_SECRET,
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY,
  } = env;
  if (
    !CONTACT_SIGNING_SECRET ||
    // Un secreto corto se podría adivinar y falsificar tokens
    CONTACT_SIGNING_SECRET.length < 32 ||
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY ||
    !EMAILJS_PRIVATE_KEY
  ) {
    return null;
  }
  return {
    allowedOrigins: allowedOrigins(env),
    signingSecret: CONTACT_SIGNING_SECRET,
    emailjs: {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY,
      privateKey: EMAILJS_PRIVATE_KEY,
    },
  };
};

export const createContactDeps = (env: Env): ContactDeps => ({
  config: readConfig(env),
  tokenLimiter: createLimiter(20, 10 * MINUTE),
  ipLimiters: [createLimiter(3, 10 * MINUTE), createLimiter(10, DAY)],
  emailLimiter: createLimiter(5, DAY),
  globalLimiter: createLimiter(50, DAY),
  fetch: (...args) => fetch(...args),
  log: (entry) => console.log(JSON.stringify({ scope: "contact", ...entry })),
  now: Date.now,
});
