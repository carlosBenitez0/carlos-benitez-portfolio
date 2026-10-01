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

  return null;
};
