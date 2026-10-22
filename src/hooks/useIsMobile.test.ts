import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setViewportWidth } from "../test/browserMocks";
import { useIsMobile } from "./useIsMobile";

describe("useIsMobile", () => {
  it("devuelve false en escritorio", () => {
    setViewportWidth(1280);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(false);
  });

  it("en un teléfono es true desde el primer render (sin flash de escritorio)", () => {
    setViewportWidth(375);
    const renders: boolean[] = [];
    renderHook(() => {
      const { isMobile } = useIsMobile();
      renders.push(isMobile);
      return isMobile;
    });
    expect(renders[0]).toBe(true);
    expect(renders).not.toContain(false);
  });

  it("767px es móvil y 768px es escritorio", () => {
    setViewportWidth(767);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current.isMobile).toBe(true);

    act(() => setViewportWidth(768));
    expect(result.current.isMobile).toBe(false);
  });

  it("solo re-renderiza al cruzar el breakpoint, no en cada resize", () => {
    setViewportWidth(1280);
    let renders = 0;
    renderHook(() => {
      renders++;
      return useIsMobile();
    });
    const initialRenders = renders;

    act(() => setViewportWidth(1100));
    act(() => setViewportWidth(900));
    expect(renders).toBe(initialRenders);

    act(() => setViewportWidth(500));
    expect(renders).toBe(initialRenders + 1);
  });
});
