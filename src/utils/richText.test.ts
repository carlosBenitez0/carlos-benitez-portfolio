import { describe, expect, it } from "vitest";
import { plainText, splitRichText } from "./richText";

describe("richText", () => {
  it("separa los resaltados en las posiciones impares", () => {
    expect(splitRichText("Hola **mundo** y **más**")).toEqual([
      "Hola ",
      "mundo",
      " y ",
      "más",
      "",
    ]);
  });

  it("quita las marcas para el texto plano", () => {
    expect(plainText("**AWS S3** para acelerar")).toBe("AWS S3 para acelerar");
  });
});
