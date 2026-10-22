export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type ContactField = keyof ContactData;

interface ContactError {
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

  if (name === "") return { name: "name", error: "El nombre es requerido" };
  if (name.length < 3)
    return {
      name: "name",
      error: "El nombre debe tener al menos 3 caracteres",
    };

  if (email === "") return { name: "email", error: "El email es requerido" };
  if (!isValidEmail(email))
    return { name: "email", error: "El email es invalido" };

  if (subject === "")
    return { name: "subject", error: "El asunto es requerido" };
  if (subject.length < 3)
    return {
      name: "subject",
      error: "El asunto debe tener al menos 3 caracteres",
    };

  if (message === "")
    return { name: "message", error: "El mensaje es requerido" };
  if (message.length < 10)
    return {
      name: "message",
      error: "El mensaje debe tener al menos 10 caracteres",
    };

  return validateLengths(data);
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

// Campo trampa invisible: una persona nunca lo llena, un bot sí.
export const isHoneypotFilled = (value: string) => value.trim() !== "";

// Un envío cada 60 s por navegador. Se guarda en localStorage para que una
// recarga no lo reinicie; si el storage no está disponible, no bloquea.
export const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = "contact:lastSentAt";

export const getCooldownRemaining = (now = Date.now()) => {
  try {
    const lastSent = Number(localStorage.getItem(LAST_SENT_KEY));
    if (!lastSent) return 0;
    return Math.max(0, lastSent + COOLDOWN_MS - now);
  } catch {
    return 0;
  }
};

export const markContactSent = (now = Date.now()) => {
  try {
    localStorage.setItem(LAST_SENT_KEY, String(now));
  } catch {
    // Sin storage (modo privado estricto): el cooldown no persiste.
  }
};
