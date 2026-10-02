import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// Los E2E corren contra el build de producción (vite preview), igual que lo
// verá un visitante.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Un reintento: un test que pasa al reintentar se reporta como "flaky"
  // (visible en la salida), no se oculta.
  retries: 1,
  // Las animaciones dependen de tiempo real: con todos los núcleos ocupados la
  // máquina se satura y los tiempos se disparan.
  workers: process.env.CI ? 2 : "50%",
  // Varios tests recorren el sitio completo, esperan la intro (~7 s) o
  // analizan el DOM con axe; con la máquina cargada superan los 30 s por
  // defecto. Las esperas son por eventos, así que un fallo real no tarda más.
  timeout: 60_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Grabar traza en cada test con muchos workers corrompía el zip en
    // Windows; se graba solo en el reintento, que es cuando hace falta.
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
