import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { seoContent } from "./vite-plugins/seoContent";

// Las cabeceras viven en vercel.json (producción). `vite preview` aplica las
// mismas reglas, en el mismo orden, para que los E2E prueben la CSP real y
// las cabeceras de /llms.txt e /index.md.
type VercelConfig = {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const vercelConfig: VercelConfig = JSON.parse(
  readFileSync(new URL("./vercel.json", import.meta.url), "utf-8"),
);
const headerRules = vercelConfig.headers.map((rule) => ({
  matches: new RegExp(`^${rule.source}$`),
  headers: rule.headers,
}));

const vercelHeaders = (): Plugin => ({
  name: "vercel-headers",
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = (req.url ?? "/").split("?")[0];
      for (const rule of headerRules) {
        if (!rule.matches.test(path)) continue;
        for (const { key, value } of rule.headers) res.setHeader(key, value);
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoContent(), vercelHeaders()],
  // Sin `server.host`: el dev server escucha solo en localhost. Para probar
  // desde el celular en la misma red: `npm run dev:lan`.
});
