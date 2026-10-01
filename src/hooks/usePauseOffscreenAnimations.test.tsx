import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setIntersecting } from "../test/browserMocks";
import { usePauseOffscreenAnimations } from "./usePauseOffscreenAnimations";

const Page = () => {
  usePauseOffscreenAnimations();
  return (
    <>
      <section data-pause-offscreen data-testid="hero" />
      <section data-pause-offscreen data-testid="contact" />
      <section data-testid="plain" />
    </>
  );
};

describe("usePauseOffscreenAnimations", () => {
  it("marca data-offscreen solo en los bloques que salen de pantalla", () => {
    render(<Page />);
    const hero = screen.getByTestId("hero");
    const contact = screen.getByTestId("contact");

    act(() => {
      setIntersecting(hero, true);
      setIntersecting(contact, false);
    });
    expect(hero).not.toHaveAttribute("data-offscreen");
    expect(contact).toHaveAttribute("data-offscreen");

    act(() => {
      setIntersecting(hero, false);
      setIntersecting(contact, true);
    });
    expect(hero).toHaveAttribute("data-offscreen");
    expect(contact).not.toHaveAttribute("data-offscreen");
  });

  it("ignora los bloques sin data-pause-offscreen", () => {
    render(<Page />);
    const plain = screen.getByTestId("plain");
    act(() => setIntersecting(plain, false));
    expect(plain).not.toHaveAttribute("data-offscreen");
  });

  it("deja de observar al desmontar", () => {
    const { unmount } = render(<Page />);
    const contact = screen.getByTestId("contact");
    unmount();
    act(() => setIntersecting(contact, false));
    expect(contact).not.toHaveAttribute("data-offscreen");
  });
});
