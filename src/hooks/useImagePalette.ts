import { useState, type SyntheticEvent } from "react";
import {
  FALLBACK_PALETTE,
  pickPalette,
  type Palette,
} from "../utils/imagePalette";

const SAMPLE_SIZE = 24;

// Una paleta por imagen: al volver a montar la tarjeta no se recalcula
const cache = new Map<string, Palette>();

const readPalette = (img: HTMLImageElement): Palette => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SAMPLE_SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return FALLBACK_PALETTE;
    ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    return pickPalette(ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data);
  } catch {
    // Imagen de otro dominio sin CORS o canvas no disponible
    return FALLBACK_PALETTE;
  }
};

/**
 * Colores de una imagen para su marco. Se leen del propio `<img>` cuando
 * termina de cargar (`onLoad`), así no se descarga dos veces ni se adelanta
 * la carga diferida. Hasta entonces, la paleta de la marca.
 */
export const useImagePalette = (src: string) => {
  const [read, setRead] = useState<{ src: string; palette: Palette } | null>(
    null,
  );

  const palette =
    cache.get(src) ?? (read?.src === src ? read.palette : FALLBACK_PALETTE);

  const onLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (cache.has(src)) return;
    const result = readPalette(event.currentTarget);
    cache.set(src, result);
    setRead({ src, palette: result });
  };

  return { palette, onLoad };
};
