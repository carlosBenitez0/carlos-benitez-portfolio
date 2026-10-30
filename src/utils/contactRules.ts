// Reglas puras del formulario de contacto: sin DOM ni storage, así las usan
// igual el navegador (contactForm.ts) y el endpoint del servidor.

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactData;

export interface ContactError {
  name: ContactField;
  error: string;
}

// Basado en la validación de <input type="email"> del estándar HTML, pero
// exigiendo un dominio con punto y un TLD de al menos 2 letras. Acepta
// puntos múltiples y "+" en la parte local, y TLDs largos (.design, .online).
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,63}$/;

export const isValidEmail = (email: string) => {
  const value = email.trim();
  return (
    value.length <= 254 &&
    EMAIL_PATTERN.test(value) &&
    !value.split("@")[0].startsWith(".") &&
    !value.split("@")[0].endsWith(".") &&
    !value.includes("..")
  );
};

// Mensajes de error en cada idioma. El servidor valida en español; el
// navegador, en el idioma de la página.
type Lang = "es" | "en";

const MESSAGES = {
  es: {
    nameEmpty: "Escribe tu nombre",
    nameShort: "El nombre debe tener al menos 3 caracteres",
    emailEmpty: "Escribe tu email",
    emailInvalid: "Introduce un email válido",
    subjectEmpty: "Escribe el asunto",
    subjectShort: "El asunto debe tener al menos 3 caracteres",
    messageEmpty: "Escribe tu mensaje",
    messageShort: "El mensaje debe tener al menos 10 caracteres",
    labels: {
      name: "El nombre",
      email: "El email",
      subject: "El asunto",
      message: "El mensaje",
    },
    tooLong: (label: string, max: number) =>
      `${label} no puede superar ${max} caracteres`,
    tooManyLinks: (max: number) =>
      `El mensaje no puede tener más de ${max} enlaces`,
  },
  en: {
    nameEmpty: "Enter your name",
    nameShort: "The name must be at least 3 characters long",
    emailEmpty: "Enter your email",
    emailInvalid: "Enter a valid email",
    subjectEmpty: "Enter the subject",
    subjectShort: "The subject must be at least 3 characters long",
    messageEmpty: "Enter your message",
    messageShort: "The message must be at least 10 characters long",
    labels: {
      name: "The name",
      email: "The email",
      subject: "The subject",
      message: "The message",
    },
    tooLong: (label: string, max: number) =>
      `${label} can't be longer than ${max} characters`,
    tooManyLinks: (max: number) =>
      `The message can't have more than ${max} links`,
  },
} satisfies Record<Lang, unknown>;

// Devuelve el primer error en el orden en que aparecen los campos, o null.
export const validateContact = (
  data: ContactData,
  lang: Lang = "es",
): ContactError | null => {
  const m = MESSAGES[lang];
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  if (name === "") return { name: "name", error: m.nameEmpty };
  if (name.length < 3) return { name: "name", error: m.nameShort };

  if (email === "") return { name: "email", error: m.emailEmpty };
  if (!isValidEmail(email)) return { name: "email", error: m.emailInvalid };

  if (subject === "") return { name: "subject", error: m.subjectEmpty };
  if (subject.length < 3) return { name: "subject", error: m.subjectShort };

  if (message === "") return { name: "message", error: m.messageEmpty };
  if (message.length < 10) return { name: "message", error: m.messageShort };

  return validateLengths(data, lang) ?? validateLinks(message, lang);
};

// --- Anti-abuso -------------------------------------------------------------

export const MAX_LENGTHS: Record<ContactField, number> = {
  name: 80,
  email: 254,
  subject: 120,
  message: 2000,
};

const validateLengths = (
  data: ContactData,
  lang: Lang,
): ContactError | null => {
  const m = MESSAGES[lang];
  for (const field of Object.keys(MAX_LENGTHS) as ContactField[]) {
    if (data[field].trim().length > MAX_LENGTHS[field]) {
      return {
        name: field,
        error: m.tooLong(m.labels[field], MAX_LENGTHS[field]),
      };
    }
  }
  return null;
};

// Muchos enlaces en un mensaje es la firma típica del spam.
export const MAX_LINKS = 3;
const LINK_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;

export const countLinks = (text: string) =>
  text.match(LINK_PATTERN)?.length ?? 0;

const validateLinks = (message: string, lang: Lang): ContactError | null =>
  countLinks(message) > MAX_LINKS
    ? { name: "message", error: MESSAGES[lang].tooManyLinks(MAX_LINKS) }
    : null;

// Tiempo mínimo entre pedir el token del formulario y enviar: una persona
// tarda más en llenarlo, un script no. El servidor rechaza envíos más rápidos.
export const FORM_TOKEN_MIN_AGE_MS = 3_000;

// Campo trampa invisible: una persona nunca lo llena, un bot sí.
export const isHoneypotFilled = (value: string) => value.trim() !== "";

// --- Saneado (el servidor lo aplica antes de validar y enviar) ---------------

// Caracteres de control, salvo el tabulador y el salto de línea
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
// Invisibles que sirven para esquivar filtros o falsear el texto que se ve:
// zero-width, marcas y overrides de dirección, BOM
const INVISIBLE_CHARS = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

const sanitizeText = (value: string, multiline: boolean) => {
  const clean = value
    .normalize("NFC")
    .replace(INVISIBLE_CHARS, "")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "");
  // En una sola línea, un salto (CRLF) podría colarse como cabecera del correo
  return (multiline ? clean : clean.replace(/\s+/g, " ")).trim();
};

export const sanitizeContact = (data: ContactData): ContactData => ({
  name: sanitizeText(data.name, false),
  email: sanitizeText(data.email, false),
  subject: sanitizeText(data.subject, false),
  message: sanitizeText(data.message, true),
});
