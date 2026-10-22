import { act, renderHook } from "@testing-library/react";
import type { SyntheticEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_PALETTE } from "../utils/imagePalette";
import { useImagePalette } from "./useImagePalette";

const loadEvent = () =>
  ({
    currentTarget: document.createElement("img"),
  }) as unknown as SyntheticEvent<HTMLImageElement>;

// jsdom no implementa canvas: se simula un contexto que "lee" píxeles rojos
const fakeRedCanvas = () =>
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: () => {},
    getImageData: () => ({
      data: Uint8ClampedArray.from(
        Array.from({ length: 24 * 24 }, () => [220, 20, 20, 255]).flat(),
      ),
    }),
  } as unknown as CanvasRenderingContext2D);

describe("useImagePalette", () => {
  afterEach(() => vi.restoreAllMocks());

  it("antes de que cargue la imagen usa la paleta de la marca", () => {
    const { result } = renderHook(() => useImagePalette("/a.webp"));
    expect(result.current.palette).toEqual(FALLBACK_PALETTE);
  });

  it("al cargar la imagen toma sus colores", () => {
    fakeRedCanvas();
    const { result } = renderHook(() => useImagePalette("/roja.webp"));
    act(() => result.current.onLoad(loadEvent()));
    expect(result.current.palette).not.toEqual(FALLBACK_PALETTE);
    expect(result.current.palette[0]).toMatch(/^#[e-f][0-9a-f]/); // rojo
  });

  it("si no puede leer la imagen se queda con la paleta de la marca", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const { result } = renderHook(() => useImagePalette("/sin-canvas.webp"));
    act(() => result.current.onLoad(loadEvent()));
    expect(result.current.palette).toEqual(FALLBACK_PALETTE);
  });

  it("recuerda la paleta: otra tarjeta con la misma imagen no la recalcula", () => {
    const getContext = fakeRedCanvas();
    const first = renderHook(() => useImagePalette("/repetida.webp"));
    act(() => first.result.current.onLoad(loadEvent()));

    const second = renderHook(() => useImagePalette("/repetida.webp"));
    expect(second.result.current.palette).toEqual(first.result.current.palette);
    act(() => second.result.current.onLoad(loadEvent()));
    expect(getContext).toHaveBeenCalledTimes(1);
  });
});
