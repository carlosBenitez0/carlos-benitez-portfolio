import { render } from "@testing-library/react";
import gsap from "gsap";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setReducedMotion } from "../../test/browserMocks";
import { MyPicture } from "./MyPicture";

// Reloj manual: GSAP deja de usar su ticker y avanzamos el tiempo nosotros,
// junto con los setInterval de la página (la fuga original vivía en uno).
let now = 0;
const advance = (seconds: number, step = 0.1) => {
  for (let elapsed = 0; elapsed < seconds; elapsed += step) {
    now += step;
    vi.advanceTimersByTime(step * 1000);
    gsap.updateRoot(now);
  }
};

const liveTweensOf = (targets: Element[]) =>
  gsap.getTweensOf(targets).filter((tween) => !tween.paused());

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
  gsap.ticker.remove(gsap.updateRoot);
  now = gsap.globalTimeline.time();
});

afterEach(() => {
  gsap.globalTimeline.clear();
  gsap.ticker.add(gsap.updateRoot);
  vi.useRealTimers();
});

describe("MyPicture", () => {
  it("no acumula animaciones con el tiempo (regresión de la fuga)", () => {
    const { container } = render(<MyPicture />);
    const dots = Array.from(container.querySelectorAll(".dot"));
    expect(dots).toHaveLength(6);

    advance(15);
    const afterIntro = liveTweensOf(dots).length;

    advance(60);
    const oneMinuteLater = liveTweensOf(dots).length;

    // Como mucho un tween vivo por mancha, y la cifra no crece con el tiempo.
    expect(oneMinuteLater).toBeLessThanOrEqual(dots.length);
    expect(oneMinuteLater).toBe(afterIntro);
  });

  it("las manchas siguen moviéndose después de la intro", () => {
    const { container } = render(<MyPicture />);
    const dot = container.querySelector<HTMLElement>(".dot")!;

    advance(15);
    const before = gsap.getProperty(dot, "x");
    advance(2);
    expect(gsap.getProperty(dot, "x")).not.toBe(before);
  });

  it("limpia todas sus animaciones al desmontarse", () => {
    const { container, unmount } = render(<MyPicture />);
    const dots = Array.from(container.querySelectorAll(".dot"));
    advance(15);

    unmount();
    expect(gsap.getTweensOf(dots)).toHaveLength(0);
  });

  it("con 'reducir movimiento' no arranca la deriva infinita", () => {
    setReducedMotion(true);
    const { container } = render(<MyPicture />);
    const dots = Array.from(container.querySelectorAll(".dot"));

    advance(30);
    expect(liveTweensOf(dots)).toHaveLength(0);
  });
});
