import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: [
        "src/**/*.test.{ts,tsx}",
        "server/**/*.test.ts",
        "vite-plugins/**/*.test.ts",
      ],
      setupFiles: ["src/test/setup.ts"],
      restoreMocks: true,
    },
  }),
);
