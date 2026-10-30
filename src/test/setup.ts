import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import {
  installDialog,
  installIntersectionObserver,
  installMatchMedia,
  resetBrowserMocks,
} from "./browserMocks";

// Los tests del servidor (server/) corren en entorno node, sin DOM
if (typeof window !== "undefined") {
  installMatchMedia();
  installIntersectionObserver();
  installDialog();

  afterEach(() => {
    cleanup();
    localStorage.clear();
    resetBrowserMocks();
  });
}
