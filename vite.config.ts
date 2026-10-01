import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Las cabeceras de seguridad viven en vercel.json (producción). `vite preview`
// sirve las mismas para que los E2E prueben la CSP real.
type VercelConfig = {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const vercelConfig: VercelConfig = JSON.parse(
  readFileSync(new URL("./vercel.json", import.meta.url), "utf-8"),
);
const securityHeaders = Object.fromEntries(
  vercelConfig.headers
    .filter((rule) => rule.source === "/(.*)")
    .flatMap((rule) => rule.headers.map(({ key, value }) => [key, value])),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Sin `server.host`: el dev server escucha solo en localhost. Para probar
  // desde el celular en la misma red: `npm run dev:lan`.
  preview: {
    headers: securityHeaders,
  },
});
