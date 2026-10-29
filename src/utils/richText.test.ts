import { describe, expect, it } from "vitest";
import { parseRichText, plainText } from "./richText";

describe("richText", () => {
  it("separa texto, resaltados y tecnologías en orden", () => {
    expect(parseRichText("Hola **mundo** con [[React]].")).toEqual([
      { type: "text", value: "Hola " },
      { type: "highlight", value: "mundo" },
      { type: "text", value: " con " },
      { type: "technology", value: "React" },
      { type: "text", value: "." },
    ]);
  });

  it("quita las marcas para el texto plano", () => {
    expect(plainText("**AWS S3** con [[Python]] / [[FastAPI]]")).toBe(
      "AWS S3 con Python / FastAPI",
    );
  });
});
