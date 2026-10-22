import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import {
  installIntersectionObserver,
  installMatchMedia,
  resetBrowserMocks,
} from "./browserMocks";

installMatchMedia();
installIntersectionObserver();

afterEach(() => {
  cleanup();
  resetBrowserMocks();
});
