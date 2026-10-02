import { describe, expect, it } from "vitest";
import {
  FLAG_SHAPES,
  WAVE,
  shapePathData,
  toPathData,
  windDisplace,
} from "./flagGeometry";

describe("windDisplace", () => {
  it("el lado del asta no se mueve", () => {
    for (const phase of [0, 0.3, 0.7]) {
      const [x, y] = windDisplace([6, 60], phase);
      expect(x).toBeCloseTo(6, 5);
      expect(y).toBeCloseTo(60, 5);
    }
  });

  it("el extremo libre se mueve hasta la amplitud del viento", () => {
    const ys = Array.from(
      { length: 40 },
      (_, i) => windDisplace([194, 60], i / 40)[1] - 60,
    );
    expect(Math.max(...ys)).toBeCloseTo(WAVE.amplitude, 0);
    expect(Math.min(...ys)).toBeCloseTo(-WAVE.amplitude, 0);
  });

  it("el ciclo es continuo (la fase 1 vuelve a la 0)", () => {
    const a = windDisplace([150, 30], 0);
    const b = windDisplace([150, 30], 1);
    expect(a[0]).toBeCloseTo(b[0], 6);
    expect(a[1]).toBeCloseTo(b[1], 6);
  });
});

describe("trazos", () => {
  it("cada línea es un único trazo continuo, sin cortes", () => {
    for (const shape of FLAG_SHAPES) {
      for (const line of shape.lines) {
        const d = toPathData(line.points, line.closed, 0.4);
        expect(d.match(/M/g)).toHaveLength(1);
      }
    }
  });

  it("los puntos vecinos quedan cerca en cualquier fase (sin saltos)", () => {
    for (const phase of [0, 0.25, 0.5, 0.75]) {
      for (const shape of FLAG_SHAPES) {
        for (const { points } of shape.lines) {
          for (let i = 1; i < points.length; i++) {
            const [ax, ay] = windDisplace(points[i - 1], phase);
            const [bx, by] = windDisplace(points[i], phase);
            expect(Math.hypot(bx - ax, by - ay)).toBeLessThan(6);
          }
        }
      }
    }
  });

  it("la forma cambia con el tiempo", () => {
    const outline = FLAG_SHAPES[0];
    expect(shapePathData(outline, 0.1)).not.toBe(shapePathData(outline, 0.6));
  });
});
