import { describe, expect, it } from "vitest";
import { isValidEmail, validateContact, type ContactData } from "./contactForm";

const valid: ContactData = {
  name: "Carlos",
  email: "carlos@gmail.com",
  subject: "Propuesta",
  message: "Hola, me interesa tu trabajo.",
};

describe("isValidEmail", () => {
  it.each([
    "carlos@gmail.com",
    "carlos.benitez@gmail.com",
    "carlos.f.benitez@gmail.com",
    "carlos+trabajo@gmail.com",
    "ana@empresa.com.sv",
    "juan_p@uca.edu.sv",
    "dev@studio.design",
    "x@mail.online",
    "o'brien@mail.ie",
    "  carlos@gmail.com  ",
  ])("acepta %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    "",
    "carlos",
    "carlos@",
    "@gmail.com",
    "carlos@gmail",
    "carlos@gmail.c",
    "carlos@@gmail.com",
    "carlos gmail@x.com",
    ".carlos@gmail.com",
    "carlos.@gmail.com",
    "carlos..b@gmail.com",
    "carlos@-gmail.com",
    "carlos@gmail..com",
    `${"a".repeat(250)}@x.com`,
  ])("rechaza %j", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("validateContact", () => {
  it("acepta un formulario completo", () => {
    expect(validateContact(valid)).toBeNull();
  });

  it.each<[Partial<ContactData>, string, string]>([
    [{ name: "" }, "name", "El nombre es requerido"],
    [{ name: "   " }, "name", "El nombre es requerido"],
    [{ name: "Al" }, "name", "El nombre debe tener al menos 3 caracteres"],
    [{ email: "" }, "email", "El email es requerido"],
    [{ email: "no-es-email" }, "email", "El email es invalido"],
    [{ subject: "" }, "subject", "El asunto es requerido"],
    [
      { subject: "Hi" },
      "subject",
      "El asunto debe tener al menos 3 caracteres",
    ],
    [{ message: "" }, "message", "El mensaje es requerido"],
    [
      { message: "Corto" },
      "message",
      "El mensaje debe tener al menos 10 caracteres",
    ],
  ])("con %j devuelve el error de %s", (override, field, error) => {
    expect(validateContact({ ...valid, ...override })).toEqual({
      name: field,
      error,
    });
  });

  it("reporta primero el campo que aparece antes en el formulario", () => {
    expect(validateContact({ ...valid, name: "", message: "" })?.name).toBe(
      "name",
    );
  });

  it("no cuenta los espacios para la longitud mínima", () => {
    expect(validateContact({ ...valid, message: "  corto     " })?.name).toBe(
      "message",
    );
  });
});
