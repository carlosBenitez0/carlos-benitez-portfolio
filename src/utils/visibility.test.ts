import gsap from "gsap";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FakeIntersectionObserver,
  setIntersecting,
  setReducedMotion,
} from "../test/browserMocks";
import {
  onVisibilityChange,
  pauseTweensWhileOffscreen,
  prefersReducedMotion,
} from "./visibility";

const makeElement = () => document.body.appendChild(document.createElement("div"));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("onVisibilityChange", () => {
  it("usa un único IntersectionObserver para todos los elementos", () => {
    const before = FakeIntersectionObserver.instances.length;
    const offA = onVisibilityChange(makeElement(), () => {});
    const offB = onVisibilityChange(makeElement(), () => {});
    expect(FakeIntersectionObserver.instances.length - before).toBeLessThanOrEqual(1);
    offA();
    offB();
  });

  it("observa con margen para arrancar antes de que la sección entre", () => {
    const el = makeElement();
    const off = onVisibilityChange(el, () => {});
    const observer = FakeIntersectionObserver.instances.find((o) =>
      o.observed.has(el),
    );
    expect(observer?.options?.rootMargin).toBe("200px 0px");
    off();
  });

  it("avisa a cada listener cuando el elemento entra y sale", () => {
    const el = makeElement();
    const listener = vi.fn();
    const off = onVisibilityChange(el, listener);

    setIntersecting(el, false);
    setIntersecting(el, true);
    expect(listener.mock.calls).toEqual([[false], [true]]);
    off();
  });

  it("un listener tardío recibe enseguida el último estado conocido", () => {
    const el = makeElement();
    const offFirst = onVisibilityChange(el, () => {});
    setIntersecting(el, false);

    const late = vi.fn();
    const offLate = onVisibilityChange(el, late);
    expect(late).toHaveBeenCalledWith(false);
    offFirst();
    offLate();
  });

  it("deja de observar cuando se va el último listener", () => {
    const el = makeElement();
    const offA = onVisibilityChange(el, () => {});
    const offB = onVisibilityChange(el, () => {});
    const observer = FakeIntersectionObserver.instances.find((o) =>
      o.observed.has(el),
    );

    offA();
    expect(observer?.observed.has(el)).toBe(true);
    offB();
    expect(observer?.observed.has(el)).toBe(false);
  });
});

describe("pauseTweensWhileOffscreen", () => {
  it("pausa los tweens fuera de pantalla y los reanuda al volver", () => {
    const container = makeElement();
    const target = container.appendChild(document.createElement("span"));
    const tween = gsap.to(target, { x: 100, duration: 10, repeat: -1 });
    const off = pauseTweensWhileOffscreen(container, target);

    setIntersecting(container, false);
    expect(tween.paused()).toBe(true);

    setIntersecting(container, true);
    expect(tween.paused()).toBe(false);

    off();
    tween.kill();
  });
});

describe("prefersReducedMotion", () => {
  it("refleja la preferencia del sistema", () => {
    expect(prefersReducedMotion()).toBe(false);
    setReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
  });
});
