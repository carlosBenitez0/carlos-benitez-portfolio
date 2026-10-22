import { describe, expect, it } from "vitest";
import {
  countLinks,
  MAX_LINKS,
  sanitizeContact,
  validateContact,
  type ContactData,
} from "./contactRules";

const valid: ContactData = {
  name: "Carlos",
  email: "carlos@gmail.com",
  subject: "Propuesta",
  message: "Hola, me interesa tu trabajo.",
};

describe("enlaces en el mensaje", () => {
  it("cuenta URLs con y sin protocolo", () => {
    expect(countLinks("ver https://a.com y www.b.com o http://c.org/x")).toBe(
      3,
    );
    expect(countLinks("sin enlaces, solo un email: a@b.com")).toBe(0);
  });

  it(`acepta hasta ${MAX_LINKS} enlaces y rechaza más`, () => {
    const links = (n: number) =>
      Array.from({ length: n }, (_, i) => `https://site${i}.com`).join(" ");
    expect(validateContact({ ...valid, message: links(MAX_LINKS) })).toBeNull();
    expect(
      validateContact({ ...valid, message: links(MAX_LINKS + 1) }),
    ).toEqual({
      name: "message",
      error: `El mensaje no puede tener más de ${MAX_LINKS} enlaces`,
    });
  });
});

describe("sanitizeContact", () => {
  it("deja intacto un mensaje normal", () => {
    expect(sanitizeContact(valid)).toEqual(valid);
  });

  it("en los campos de una línea convierte los saltos en espacios", () => {
    const clean = sanitizeContact({
      ...valid,
      name: "Carlos\r\nBcc: x@y.com",
      subject: "Hola\n\n\tmundo",
    });
    expect(clean.name).toBe("Carlos Bcc: x@y.com");
    expect(clean.subject).toBe("Hola mundo");
  });

  it("en el mensaje conserva los saltos y normaliza CRLF", () => {
    expect(
      sanitizeContact({ ...valid, message: "uno\r\ndos\rtres" }).message,
    ).toBe("uno\ndos\ntres");
  });

  it("quita caracteres de control e invisibles", () => {
    const clean = sanitizeContact({
      ...valid,
      name: "Car\u200Blos\u202E",
      message: "Hola\u0000 mundo\u0007\uFEFF",
    });
    expect(clean.name).toBe("Carlos");
    expect(clean.message).toBe("Hola mundo");
  });

  it("normaliza a NFC", () => {
    const decomposed = "Beni\u0301tez";
    expect(sanitizeContact({ ...valid, name: decomposed }).name).toBe(
      "Benítez",
    );
  });
});
