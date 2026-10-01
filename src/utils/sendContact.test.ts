import emailjs from "@emailjs/browser";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "./sendContact";

vi.mock("@emailjs/browser", () => ({ default: { send: vi.fn() } }));
const send = vi.mocked(emailjs.send);

const data = {
  name: "  Carlos ",
  email: "carlos@gmail.com ",
  subject: "Propuesta",
  message: "Hola, me interesa tu trabajo.",
};

beforeEach(() => {
  send.mockReset();
});

describe("sendContactMessage", () => {
  it("envía solo los cuatro campos, recortados, a ambas plantillas", async () => {
    send.mockResolvedValue({ status: 200, text: "OK" });
    await sendContactMessage({ ...data, company: "bot" } as typeof data);

    expect(send).toHaveBeenCalledTimes(2);
    for (const [, , params] of send.mock.calls) {
      expect(params).toEqual({
        name: "Carlos",
        email: "carlos@gmail.com",
        subject: "Propuesta",
        message: "Hola, me interesa tu trabajo.",
      });
    }
  });

  it("primero el mensaje principal y después la respuesta automática", async () => {
    send.mockResolvedValue({ status: 200, text: "OK" });
    await sendContactMessage(data);

    expect(send.mock.calls[0][1]).toBe("template_vx2h6qt");
    expect(send.mock.calls[1][1]).toBe("template_32ukwf4");
  });

  it("rechaza y no manda la respuesta automática si falla el principal", async () => {
    send.mockRejectedValueOnce(new Error("network"));

    await expect(sendContactMessage(data)).rejects.toThrow("network");
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("resuelve aunque falle la respuesta automática", async () => {
    send
      .mockResolvedValueOnce({ status: 200, text: "OK" })
      .mockRejectedValueOnce(new Error("auto-reply"));

    await expect(sendContactMessage(data)).resolves.toBeUndefined();
  });
});
