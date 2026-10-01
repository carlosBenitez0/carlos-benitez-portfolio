import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "../../../utils/sendContact";
import { ContactContainer } from "./ContactContainer";

vi.mock("../../../utils/sendContact", () => ({
  sendContactMessage: vi.fn(),
}));
const send = vi.mocked(sendContactMessage);

const fill = () => {
  fireEvent.change(screen.getByPlaceholderText("Nombre"), {
    target: { value: "Carlos" },
  });
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "carlos+trabajo@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Asunto"), {
    target: { value: "Propuesta" },
  });
  fireEvent.change(screen.getByPlaceholderText("Mensaje"), {
    target: { value: "Hola, me interesa tu trabajo." },
  });
};

const submit = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
  });
};

beforeEach(() => {
  send.mockReset();
});

describe("ContactContainer", () => {
  it("con éxito muestra un único resultado y vacía el formulario", async () => {
    send.mockResolvedValue(undefined);
    render(<ContactContainer />);
    fill();
    await submit();

    expect(send).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/te dejé un mensaje/)).toBeInTheDocument();
    expect(screen.queryByText("No se pudo enviar el mensaje")).toBeNull();
    expect(screen.getByPlaceholderText("Mensaje")).toHaveValue("");
  });

  it("si falla solo muestra el error y conserva lo escrito", async () => {
    send.mockRejectedValue(new Error("network"));
    render(<ContactContainer />);
    fill();
    await submit();

    expect(
      screen.getByText("No se pudo enviar el mensaje"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/te dejé un mensaje/)).toBeNull();
    expect(screen.getByPlaceholderText("Mensaje")).toHaveValue(
      "Hola, me interesa tu trabajo.",
    );
  });

  it("no envía si la validación falla", async () => {
    render(<ContactContainer />);
    fill();
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "no-es-email" },
    });
    await submit();

    expect(send).not.toHaveBeenCalled();
    expect(screen.getByText("El email es invalido")).toBeInTheDocument();
  });

  it("deshabilita el botón mientras envía (sin doble envío)", async () => {
    let resolve!: () => void;
    send.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    render(<ContactContainer />);
    fill();
    await submit();

    const button = screen.getByRole("button", { name: /enviando/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(send).toHaveBeenCalledTimes(1);

    await act(async () => resolve());
  });
});

describe("ContactContainer anti-abuso", () => {
  it("con el honeypot lleno muestra éxito pero no envía nada", async () => {
    const { container } = render(<ContactContainer />);
    fill();
    fireEvent.change(container.querySelector('input[name="company"]')!, {
      target: { value: "ACME" },
    });
    await submit();

    expect(send).not.toHaveBeenCalled();
    expect(screen.getByText(/te dejé un mensaje/)).toBeInTheDocument();
  });

  it("el honeypot queda fuera del orden de tabulación y de los lectores", () => {
    const { container } = render(<ContactContainer />);
    const trap = container.querySelector('input[name="company"]')!;
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("bloquea un segundo envío durante el cooldown, también tras recargar", async () => {
    send.mockResolvedValue(undefined);
    const first = render(<ContactContainer />);
    fill();
    await submit();
    expect(send).toHaveBeenCalledTimes(1);

    // Simula recargar la página: nuevo montaje, mismo localStorage
    first.unmount();
    render(<ContactContainer />);
    fill();
    await submit();

    expect(send).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/Espera \d+ s para enviar otro mensaje/),
    ).toBeInTheDocument();
  });

  it("limita la longitud de cada campo en el propio input", () => {
    render(<ContactContainer />);
    expect(screen.getByPlaceholderText("Nombre")).toHaveAttribute(
      "maxlength",
      "80",
    );
    expect(screen.getByPlaceholderText("Mensaje")).toHaveAttribute(
      "maxlength",
      "2000",
    );
  });
});

describe("ContactContainer accesibilidad", () => {
  it("cada campo tiene una etiqueta accesible", () => {
    render(<ContactContainer />);
    for (const label of ["Nombre", "Email", "Asunto", "Mensaje"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("anuncia el error y lo asocia al campo inválido", async () => {
    render(<ContactContainer />);
    fill();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "no-es-email" },
    });
    await submit();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("El email es invalido");
    const email = screen.getByLabelText("Email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", alert.id);
    expect(screen.getByLabelText("Nombre")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("anuncia el éxito como estado", async () => {
    send.mockResolvedValue(undefined);
    render(<ContactContainer />);
    fill();
    await submit();
    expect(screen.getByRole("status")).toHaveTextContent(/te dejé un mensaje/);
  });
});
