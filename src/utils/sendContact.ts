import type { ContactData } from "./contactForm";

// La publicKey de EmailJS es pública por diseño (viaja al navegador); la
// protección real se configura en el panel: dominios permitidos y rate limit.
const SERVICE_ID = "service_3wblnba";
const NOTIFY_TEMPLATE_ID = "template_vx2h6qt"; // mensaje que me llega a mí
const AUTO_REPLY_TEMPLATE_ID = "template_32ukwf4"; // respuesta al visitante
const PUBLIC_KEY = "p1-mlOCmCgRp2jNnJ";

// Se envían solo estos cuatro campos, con los mismos nombres que usan las
// plantillas. Nunca el contenido completo del <form> (p. ej. el honeypot).
const toTemplateParams = (data: ContactData) => ({
  name: data.name.trim(),
  email: data.email.trim(),
  subject: data.subject.trim(),
  message: data.message.trim(),
});

// EmailJS no está en el bundle inicial. Se empieza a descargar cuando el
// visitante enfoca el formulario, así al enviar ya está listo.
const loadEmailJs = () => import("@emailjs/browser");
export const preloadEmailJs = () => void loadEmailJs();

// Resuelve cuando el mensaje principal se envió; rechaza si falló. La
// respuesta automática es secundaria: se manda solo si el principal salió y
// su fallo no afecta lo que ve el visitante.
export const sendContactMessage = async (data: ContactData) => {
  const { default: emailjs } = await loadEmailJs();
  const params = toTemplateParams(data);
  const options = { publicKey: PUBLIC_KEY };

  await emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE_ID, params, options);

  emailjs
    .send(SERVICE_ID, AUTO_REPLY_TEMPLATE_ID, params, options)
    .catch(() => {});
};
