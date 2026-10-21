// Saca de una imagen los colores para el borde animado de su marco: los
// tonos vivos más presentes, distintos entre sí y llevados a una luminosidad
// que brille tanto sobre fondo claro como oscuro.

export type Palette = [string, string, string];

// Violetas de la marca: mientras la imagen carga o si no se puede leer
export const FALLBACK_PALETTE: Palette = ["#9d4edd", "#e0aaff", "#5a189a"];

const HUE_BUCKETS = 24; // 15° cada uno
const MIN_HUE_DISTANCE = 40;

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return { h, s, l };
};

const hslToHex = (h: number, s: number, l: number) => {
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
};

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

// Color de borde: el tono de la imagen, saturado y con luz media
const vivid = (h: number, s: number) => hslToHex(h, Math.max(s, 0.7), 0.6);

/** Recibe los píxeles RGBA de una miniatura (p. ej. 24×24). */
export const pickPalette = (pixels: ArrayLike<number>): Palette => {
  const buckets = Array.from({ length: HUE_BUCKETS }, () => ({
    weight: 0,
    hueX: 0,
    hueY: 0,
    sat: 0,
  }));

  for (let i = 0; i + 3 < pixels.length; i += 4) {
    if (pixels[i + 3] < 200) continue; // transparente
    const { h, s, l } = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
    // Casi negro, casi blanco o gris: no aporta color al borde
    if (l < 0.12 || l > 0.92 || s < 0.25) continue;
    const bucket = buckets[Math.floor(h / (360 / HUE_BUCKETS)) % HUE_BUCKETS];
    // Los píxeles más saturados pesan más: son los que se perciben como "el
    // color" de la imagen. El tono se promedia como ángulo (seno y coseno).
    bucket.weight += s;
    bucket.hueX += Math.cos((h * Math.PI) / 180) * s;
    bucket.hueY += Math.sin((h * Math.PI) / 180) * s;
    bucket.sat += s * s;
  }

  const candidates = buckets
    .filter((bucket) => bucket.weight > 0)
    .map((bucket) => ({
      weight: bucket.weight,
      hue: ((Math.atan2(bucket.hueY, bucket.hueX) * 180) / Math.PI + 360) % 360,
      sat: bucket.sat / bucket.weight,
    }))
    .sort((a, b) => b.weight - a.weight);

  const chosen: { hue: number; sat: number }[] = [];
  for (const candidate of candidates) {
    if (
      chosen.every((c) => hueDistance(c.hue, candidate.hue) >= MIN_HUE_DISTANCE)
    ) {
      chosen.push(candidate);
    }
    if (chosen.length === 3) break;
  }

  if (chosen.length === 0) return FALLBACK_PALETTE;
  // Con uno o dos tonos, se completan con vecinos para que el giro del borde
  // tenga variación sin salirse de la gama de la imagen
  while (chosen.length < 3) {
    const base = chosen[0];
    const offset = chosen.length === 1 ? 40 : -40;
    chosen.push({ hue: (base.hue + offset + 360) % 360, sat: base.sat });
  }

  return chosen.map((c) => vivid(c.hue, c.sat)) as Palette;
};
