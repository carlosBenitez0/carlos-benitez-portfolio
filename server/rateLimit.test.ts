// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createLimiter } from "./rateLimit";

describe("createLimiter", () => {
  it("permite hasta el máximo dentro de la ventana", () => {
    const limit = createLimiter(3, 1000, () => 0);
    expect([1, 2, 3].map(() => limit("ip").success)).toEqual([
      true,
      true,
      true,
    ]);
    const blocked = limit("ip");
    expect(blocked.success).toBe(false);
    expect(blocked.reset).toBe(1000);
  });

  it("cada clave tiene su propio cupo", () => {
    const limit = createLimiter(1, 1000, () => 0);
    expect(limit("a").success).toBe(true);
    expect(limit("b").success).toBe(true);
    expect(limit("a").success).toBe(false);
  });

  it("la ventana se desliza: libera los envíos viejos", () => {
    let now = 0;
    const limit = createLimiter(2, 1000, () => now);
    limit("ip");
    now = 600;
    limit("ip");
    expect(limit("ip").success).toBe(false);
    now = 1001;
    expect(limit("ip").success).toBe(true);
    expect(limit("ip").success).toBe(false);
  });

  it("los intentos bloqueados no alargan el castigo", () => {
    let now = 0;
    const limit = createLimiter(1, 1000, () => now);
    limit("ip");
    now = 500;
    limit("ip");
    now = 1001;
    expect(limit("ip").success).toBe(true);
  });
});
