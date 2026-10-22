import { describe, expect, it } from "vitest";
import { FALLBACK_PALETTE, pickPalette } from "./imagePalette";

// Píxeles RGBA de una miniatura con `count` píxeles de cada color
const pixels = (...colors: [number, number, number, number][]) =>
  colors.flatMap(([r, g, b, count]) =>
    Array.from({ length: count }, () => [r, g, b, 255]).flat(),
  );

const hueOf = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (max === r) return ((((g - b) / d) % 6) * 60 + 360) % 360;
  if (max === g) return ((b - r) / d + 2) * 60;
  return ((r - g) / d + 4) * 60;
};

const near = (hue: number, target: number) => {
  const d = Math.abs(hue - target) % 360;
  return Math.min(d, 360 - d) <= 20;
};

describe("pickPalette", () => {
  it("toma los tonos dominantes de la imagen, del más presente al menos", () => {
    const palette = pickPalette(
      pixels([230, 30, 30, 300], [30, 60, 230, 150], [30, 200, 60, 50]),
    );
    expect(near(hueOf(palette[0]), 0)).toBe(true); // rojo
    expect(near(hueOf(palette[1]), 230)).toBe(true); // azul
    expect(near(hueOf(palette[2]), 130)).toBe(true); // verde
  });

  it("ignora negros, blancos, grises y píxeles transparentes", () => {
    const palette = pickPalette([
      ...pixels([5, 5, 5, 400], [250, 250, 250, 400], [128, 128, 128, 400]),
      ...[0, 255, 0, 0], // verde transparente
      ...pixels([200, 40, 200, 10]), // un poco de magenta
    ]);
    expect(near(hueOf(palette[0]), 300)).toBe(true);
  });

  it("con un solo tono, completa con tonos vecinos (no repite el mismo)", () => {
    const palette = pickPalette(pixels([30, 120, 230, 100]));
    expect(new Set(palette).size).toBe(3);
    expect(near(hueOf(palette[0]), 214)).toBe(true);
    // Los vecinos quedan a ~40° del tono base
    expect(near(hueOf(palette[1]), 254)).toBe(true);
    expect(near(hueOf(palette[2]), 174)).toBe(true);
  });

  it("sin color aprovechable devuelve la paleta de la marca", () => {
    expect(pickPalette(pixels([10, 10, 10, 50], [240, 240, 240, 50]))).toEqual(
      FALLBACK_PALETTE,
    );
    expect(pickPalette([])).toEqual(FALLBACK_PALETTE);
  });
});
