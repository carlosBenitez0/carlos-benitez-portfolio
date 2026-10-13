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

// Devuelve el primer error en el orden en que aparecen los campos, o null.
export const validateContact = (data: ContactData): ContactError | null => {
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  if (name === "") return { name: "name", error: "Escribe tu nombre" };
  if (name.length < 3)
    return {
      name: "name",
      error: "El nombre debe tener al menos 3 caracteres",
    };

  if (email === "") return { name: "email", error: "Escribe tu email" };
  if (!isValidEmail(email))
    return { name: "email", error: "Introduce un email válido" };

  if (subject === "") return { name: "subject", error: "Escribe el asunto" };
  if (subject.length < 3)
    return {
      name: "subject",
      error: "El asunto debe tener al menos 3 caracteres",
    };

  if (message === "") return { name: "message", error: "Escribe tu mensaje" };
  if (message.length < 10)
    return {
      name: "message",
      error: "El mensaje debe tener al menos 10 caracteres",
    };

  return validateLengths(data) ?? validateLinks(message);
};

// --- Anti-abuso -------------------------------------------------------------

export const MAX_LENGTHS: Record<ContactField, number> = {
  name: 80,
  email: 254,
  subject: 120,
  message: 2000,
};

const FIELD_LABELS: Record<ContactField, string> = {
  name: "El nombre",
  email: "El email",
  subject: "El asunto",
  message: "El mensaje",
};

const validateLengths = (data: ContactData): ContactError | null => {
  for (const field of Object.keys(MAX_LENGTHS) as ContactField[]) {
    if (data[field].trim().length > MAX_LENGTHS[field]) {
      return {
        name: field,
        error: `${FIELD_LABELS[field]} no puede superar ${MAX_LENGTHS[field]} caracteres`,
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

const validateLinks = (message: string): ContactError | null =>
  countLinks(message) > MAX_LINKS
    ? {
        name: "message",
        error: `El mensaje no puede tener más de ${MAX_LINKS} enlaces`,
      }
    : null;

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
