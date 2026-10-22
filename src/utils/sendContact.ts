import {
  FORM_TOKEN_MIN_AGE_MS,
  type ContactData,
  type ContactField,
} from "./contactForm";

// El navegador ya no habla con EmailJS: todo pasa por /api/contact, que
// valida, limita y envía con la clave privada (ver server/contact.ts).

const ENDPOINT = "/api/contact";
// El token vence a las 2 h en el servidor: se renueva antes por las dudas
const TOKEN_REFRESH_MS = 90 * 60 * 1000;
// Margen sobre el tiempo mínimo del servidor
const MIN_AGE_MARGIN_MS = 300;

export type ContactFailure =
  | { kind: "invalid"; field: ContactField; message: string }
  | { kind: "rate_limited"; retryAfter: number }
  | { kind: "failed" };

export class ContactRequestError extends Error {
  readonly detail: ContactFailure;
  constructor(detail: ContactFailure) {
    super(detail.kind);
    this.detail = detail;
  }
}

interface FormToken {
  token: string;
  fetchedAt: number;
}

let pending: Promise<FormToken> | null = null;

const fetchToken = async (): Promise<FormToken> => {
  const response = await fetch(ENDPOINT, {
    headers: { Accept: "application/json" },
  });
  if (response.status === 429) throw await toError(response);
  if (!response.ok) throw new ContactRequestError({ kind: "failed" });
  const { token } = (await response.json()) as { token: string };
  return { token, fetchedAt: Date.now() };
};

const getToken = async (fresh = false) => {
  if (pending && !fresh) {
    const current = await pending.catch(() => null);
    if (current && Date.now() - current.fetchedAt < TOKEN_REFRESH_MS) {
      return current;
    }
  }
  const request = fetchToken();
  pending = request;
  // Si falla, el próximo intento vuelve a pedirlo (salvo que ya haya otro)
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
};

// Se pide el token cuando el visitante empieza a usar el formulario: al
// enviar ya pasó el tiempo mínimo y no hay espera.
export const prepareContact = () => {
  if (!pending) void getToken().catch(() => {});
};

const waitMinAge = (fetchedAt: number) => {
  const remaining =
    fetchedAt + FORM_TOKEN_MIN_AGE_MS + MIN_AGE_MARGIN_MS - Date.now();
  return remaining > 0
    ? new Promise((resolve) => setTimeout(resolve, remaining))
    : Promise.resolve();
};

async function toError(response: Response): Promise<ContactRequestError> {
  const body = (await response.json().catch(() => ({}))) as {
    field?: ContactField;
    message?: string;
    retryAfter?: number;
  };
  if (response.status === 400 && body.field && body.message) {
    return new ContactRequestError({
      kind: "invalid",
      field: body.field,
      message: body.message,
    });
  }
  if (response.status === 429) {
    const retryAfter =
      body.retryAfter ?? Number(response.headers.get("Retry-After") ?? 60);
    return new ContactRequestError({ kind: "rate_limited", retryAfter });
  }
  return new ContactRequestError({ kind: "failed" });
}

const post = async (data: ContactData, company: string, token: string) =>
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      company,
      token,
    }),
  });

// Resuelve cuando el mensaje se envió; si no, rechaza con un ContactRequestError.
export const sendContactMessage = async (data: ContactData, company = "") => {
  let current = await getToken().catch((error) => {
    throw error instanceof ContactRequestError
      ? error
      : new ContactRequestError({ kind: "failed" });
  });
  await waitMinAge(current.fetchedAt);

  let response = await post(data, company, current.token).catch(() => null);
  // Token vencido o de otra IP (cambio de red): se pide otro y se reintenta
  if (response?.status === 403) {
    current = await getToken(true).catch(() => {
      throw new ContactRequestError({ kind: "failed" });
    });
    await waitMinAge(current.fetchedAt);
    response = await post(data, company, current.token).catch(() => null);
  }

  if (!response) throw new ContactRequestError({ kind: "failed" });
  if (!response.ok) throw await toError(response);
};

/** Solo para tests: olvida el token guardado */
export const resetContactToken = () => {
  pending = null;
};
