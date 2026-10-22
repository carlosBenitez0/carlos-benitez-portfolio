import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { setSystemColorScheme } from "../test/browserMocks";
import { THEME_STORAGE_KEY, useTheme } from "./useTheme";

const root = document.documentElement;

describe("useTheme", () => {
  beforeEach(() => {
    delete root.dataset.theme;
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.remove());
  });

  it("sin preferencia guardada sigue al tema del sistema", () => {
    setSystemColorScheme("light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("respeta el tema que ya fijó el script inicial", () => {
    root.dataset.theme = "light";
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("toggleTheme cambia data-theme y guarda la elección", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
    expect(root.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("un cambio del sistema no pisa la preferencia guardada", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));

    act(() => setSystemColorScheme("light"));
    expect(result.current.theme).toBe("dark");
  });

  it("sin preferencia guardada, un cambio del sistema se aplica en vivo", () => {
    const { result } = renderHook(() => useTheme());
    act(() => setSystemColorScheme("light"));
    expect(result.current.theme).toBe("light");
    expect(root.dataset.theme).toBe("light");
  });

  it("actualiza el color de la barra del navegador", () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.media = "(prefers-color-scheme: dark)";
    meta.content = "#050010";
    document.head.append(meta);

    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(meta.content).toBe("#f4effc");
    expect(meta.hasAttribute("media")).toBe(false);
  });
});
