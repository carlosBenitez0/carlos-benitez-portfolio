import { FaGithub, FaRegUser } from "react-icons/fa";
import { links as siteLinks } from "../../../content/site";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineSubject } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BgDotGradient } from "../BgDotGradient";
import { Spinner } from "./Spinner";
import { ErrorComponent } from "./ErrorComponent";
import { IoLocationOutline } from "react-icons/io5";
import { CiLinkedin } from "react-icons/ci";
import ShinyText from "../ShinyText";
import { SendedComponent } from "./SendedComponent";
import { Birds, Canoe } from "./WaterScene";
import { WavingFlag } from "./WavingFlag";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  pauseTweensWhileOffscreen,
  prefersReducedMotion,
} from "../../../utils/visibility";
import {
  getCooldownRemaining,
  isHoneypotFilled,
  markContactSent,
  MAX_LENGTHS,
  validateContact,
  type ContactData,
} from "../../../utils/contactForm";
import {
  ContactRequestError,
  prepareContact,
  sendContactMessage,
} from "../../../utils/sendContact";

const SEND_FAILED =
  "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.";

// Traduce la respuesta del servidor al error que ve el visitante
const describeSendError = (error: unknown) => {
  if (!(error instanceof ContactRequestError)) {
    return { name: "formError", error: SEND_FAILED };
  }
  const { detail } = error;
  if (detail.kind === "invalid") {
    return { name: detail.field, error: detail.message };
  }
  if (detail.kind === "rate_limited") {
    const minutes = Math.ceil(detail.retryAfter / 60);
    return {
      name: "formError",
      error: `Demasiados envíos seguidos. Inténtalo de nuevo en ${minutes} min`,
    };
  }
  return { name: "formError", error: SEND_FAILED };
};

export const ContactContainer = () => {
  const { isMobile } = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    error: "",
  });
  const [sended, setSended] = useState<boolean>(false);
  // Campo trampa para bots (ver isHoneypotFilled)
  const [company, setCompany] = useState("");
  const [userData, setUserData] = useState<ContactData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setSended(false);
    setError({ name: "", error: "" });

    // Validaciones
    const validationError = validateContact(userData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const cooldown = getCooldownRemaining();
    if (cooldown > 0) {
      setError({
        name: "formError",
        error: `Espera ${Math.ceil(cooldown / 1000)} s antes de enviar otro mensaje`,
      });
      return;
    }

    // Si pasa todas las validaciones
    setLoading(true);
    try {
      // A un bot se le muestra éxito sin enviar nada, para no darle pistas
      if (!isHoneypotFilled(company)) {
        await sendContactMessage(userData, company);
      }
      markContactSent();
      setSended(true);
      // Solo se vacía si se envió: si falla, el visitante conserva su texto
      setUserData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (sendError) {
      setError(describeSendError(sendError));
    } finally {
      setLoading(false);
    }
  };

  // El aviso de éxito desaparece a los 10 s
  useEffect(() => {
    if (!sended) return;
    const timer = setTimeout(() => setSended(false), 10000);
    return () => clearTimeout(timer);
  }, [sended]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const dots = container.querySelectorAll(".dot-contact");

    if (prefersReducedMotion()) return;

    dots.forEach((dot) => {
      gsap.to(dot, {
        scale: 0.8 + Math.random() * 0.5,
        duration: 1 + Math.random() * 5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // Manchas quietas mientras el formulario no se ve (las olas son CSS y se
    // pausan con data-offscreen)
    const stopPausingDots = pauseTweensWhileOffscreen(container, dots);

    return () => {
      // Limpiar todas las animaciones al desmontar
      stopPausingDots();
      gsap.killTweensOf(dots);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`anim-about-text filter-blur-3xl relative grid overflow-hidden rounded-xl border-2 border-ink/5 bg-transparent ${isMobile ? "grid-cols-1 grid-rows-2 pb-24" : "grid-cols-2"}`}
    >
      {/* Olas de fondo: cada una es su propio <svg> y se anima la caja completa
          con transform (compuesto en GPU). Animar elementos dentro de un SVG
          recalculaba su layout en cada frame. */}
      {/* En móvil las olas (con la canoa) ocupan una franja inferior de alto
          fijo: así la canoa navega bajo el botón Enviar en vez de sobre los
          campos. El fondo, con el degradado y los pájaros en el cielo, sigue
          cubriendo toda la tarjeta (es su contenedor para las unidades cq*). */}
      <div className="[container-type:size] absolute inset-0 z-[-1] overflow-hidden bg-gradient-to-bl from-cbpbg-50 via-cbpbg-500/20 to-transparent">
        <Birds />
      </div>
      <div
        className={`contact-waves absolute bottom-0 left-0 z-[-1] w-full overflow-hidden ${isMobile ? "h-[440px]" : "h-full"}`}
      >
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <linearGradient id="bg">
              <stop offset="0%" stopColor="#7b2cbf11"></stop>
              <stop offset="50%" stopColor="#9d4edd22"></stop>
              <stop offset="100%" stopColor="#b96edf33"></stop>
            </linearGradient>
            <path
              id="wave"
              fill="url(#bg)"
              d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
	s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
            />
          </defs>
        </svg>
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="contact-wave contact-wave-a absolute inset-0 h-full w-full overflow-visible"
        >
          <g className="translate-y-10">
            <use href="#wave" opacity=".3" />
          </g>
        </svg>
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="contact-wave contact-wave-b absolute inset-0 h-full w-full overflow-visible"
        >
          <g className="translate-y-10">
            <use href="#wave" opacity=".6" />
          </g>
        </svg>
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="contact-wave contact-wave-c absolute inset-0 h-full w-full overflow-visible"
        >
          <g className="translate-y-10">
            <use href="#wave" opacity=".9" />
          </g>
        </svg>
        {/* Canoa sobre la ola delantera: su altura e inclinación siguen la
            superficie de la ola (ver index.css). */}
        <Canoe />
      </div>
      <div
        className={`ring-component absolute ${isMobile ? "-top-35 -left-35 h-100 w-100 blur-xl" : "-top-15 -left-15 h-64 w-64 blur-md"} -z-1 rounded-full border-[15px] border-cbpviolet-500/50`}
      ></div>

      <div className="dot-contact absolute flex items-center justify-center will-change-transform">
        <BgDotGradient
          colors={["violet", "blue"]}
          size="lg"
          blur="5xl"
          position={{ top: 200, left: 200 }}
        />
      </div>
      <div className="dot-contact absolute flex items-center justify-center will-change-transform">
        <BgDotGradient
          colors={["blue", "green"]}
          size="lg"
          blur="5xl"
          position={{ top: 100, left: 400 }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        onFocus={prepareContact}
        className={`z-50 grid grid-cols-2 gap-6 rounded-xl ${isMobile ? "px-5 pb-5" : "p-8"} [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div]:pl-2 [&>div,&>span>textarea]:rounded-lg [&>div,&>span>textarea]:border [&>div,&>span>textarea]:border-ink/15 [&>div,&>span>textarea]:shadow-[inset_0px_0px_20px_var(--hover-glow)] light:[&>div,&>span>textarea]:border-ink/25 light:[&>div,&>span>textarea]:bg-white/75 light:[&>div,&>span>textarea]:shadow-[0_1px_2px_rgb(60_9_108/0.08)] [&>div>.form-icon]:text-ink/50 light:[&>div>.form-icon]:text-ink/65 [&>div>input]:p-3 [&>div>input,&>span>textarea]:w-full [&>div>input,&>span>textarea]:bg-transparent [&>div>input,&>span>textarea]:outline-none [&>div>input,&>span>textarea]:placeholder:text-ink/50 [&>div>input,&>span>textarea]:autofill:bg-transparent light:[&>div>input,&>span>textarea]:placeholder:text-ink/65 light:[&>span>textarea]:bg-white/75! ${userData.name !== "" ? "[&>div:nth-child(1)>input,&>div:nth-child(1)>.form-icon]:text-ink/90" : ""} ${userData.email !== "" ? "[&>div:nth-child(2)>input,&>div:nth-child(2)>.form-icon]:text-ink/90" : ""} ${userData.subject !== "" ? "[&>div:nth-child(3)>input,&>div:nth-child(3)>.form-icon]:text-ink/90" : ""} ${userData.message !== "" ? "[&>div:nth-child(4)>textarea]:text-ink/90" : ""} ${userData.name !== "" ? "[&>div:nth-child(1)]:border-ink/25" : ""} ${userData.email !== "" ? "[&>div:nth-child(2)]:border-ink/25" : ""} ${userData.subject !== "" ? "[&>div:nth-child(3)]:border-ink/25" : ""} ${userData.message !== "" ? "[&>span>textarea]:border-ink/25" : ""} ${isMobile ? "row-start-2 row-end-3" : ""}`}
      >
        <div className={`fx-focus ${isMobile ? "col-span-2" : ""}`}>
          <FaRegUser className="form-icon fx-icon fx-pop min-h-4 min-w-4" />
          <label htmlFor="contact-name" className="sr-only">
            Nombre
          </label>
          <input
            type="text"
            value={userData.name}
            placeholder="Nombre"
            autoComplete="off"
            name="name"
            id="contact-name"
            aria-invalid={error.name === "name"}
            aria-describedby={
              error.name === "name" ? "contact-error" : undefined
            }
            maxLength={MAX_LENGTHS.name}
            onChange={handleChange}
          />
        </div>
        <div className={`fx-focus ${isMobile ? "col-span-2" : ""}`}>
          <MdOutlineEmail className="form-icon fx-icon fx-pop min-h-4 min-w-4" />
          <label htmlFor="contact-email" className="sr-only">
            Email
          </label>
          <input
            type="text"
            value={userData.email}
            placeholder="Email"
            inputMode="email"
            autoComplete="off"
            name="email"
            id="contact-email"
            aria-invalid={error.name === "email"}
            aria-describedby={
              error.name === "email" ? "contact-error" : undefined
            }
            maxLength={MAX_LENGTHS.email}
            onChange={handleChange}
          />
        </div>
        <div className="fx-focus col-span-2">
          <MdOutlineSubject className="form-icon fx-icon fx-pop min-h-4 min-w-4" />
          <label htmlFor="contact-subject" className="sr-only">
            Asunto
          </label>
          <input
            type="text"
            value={userData.subject}
            placeholder="Asunto"
            autoComplete="off"
            name="subject"
            id="contact-subject"
            aria-invalid={error.name === "subject"}
            aria-describedby={
              error.name === "subject" ? "contact-error" : undefined
            }
            maxLength={MAX_LENGTHS.subject}
            onChange={handleChange}
          />
        </div>
        <span className="col-span-2">
          <label htmlFor="contact-message" className="sr-only">
            Mensaje
          </label>
          <textarea
            className="mb-2 h-30 resize-none p-2"
            value={userData.message}
            placeholder="Mensaje"
            autoComplete="off"
            name="message"
            id="contact-message"
            aria-invalid={error.name === "message"}
            aria-describedby={
              error.name === "message" ? "contact-error" : undefined
            }
            maxLength={MAX_LENGTHS.message}
            onChange={handleChange}
          ></textarea>
          {error.name && error.error && (
            <ErrorComponent
              icon={
                error.name === "name" ? (
                  <FaRegUser />
                ) : error.name === "email" ? (
                  <MdOutlineEmail />
                ) : error.name === "subject" ? (
                  <MdOutlineSubject />
                ) : (
                  <MdOutlineSubject />
                )
              }
              error={error.error}
              id="contact-error"
            />
          )}
          {sended && (
            <SendedComponent message="Revisa tu correo, te dejé un mensaje 😁✌️" />
          )}
        </span>
        {/* Honeypot: fuera de pantalla (no display:none, que algunos bots
            detectan), fuera del orden de tabulación y oculto a lectores. */}
        <span
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label>
            Empresa
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </span>
        <button
          type="submit"
          disabled={loading}
          className="fx-trigger col-span-2 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md border border-cbpbg-50 bg-cbpbg-500/50 px-4 py-2 shadow-[inset_0px_0px_10px_var(--hover-glow)] transition duration-300 hover:bg-cbpbg-500/75 disabled:cursor-wait light:border-cbpbg-400 light:bg-white/80 light:shadow-[0_1px_3px_rgb(60_9_108/0.12)] light:hover:bg-white"
        >
          {sended ? (
            <>
              Enviado correctamente
              <FaCheckCircle />
            </>
          ) : loading ? (
            <>
              Enviando
              <Spinner />
            </>
          ) : (
            <>
              Enviar
              <IoMdSend className="fx-icon fx-launch" />
            </>
          )}
        </button>
      </form>

      <div className={isMobile ? "row-start-1 row-end-2 p-5" : ""}>
        <div
          className={`relative h-full ${isMobile ? "flex items-center justify-center" : ""}`}
        >
          <div
            className={`${isMobile ? "relative top-15" : "absolute"} inset-0 flex flex-col items-center justify-center`}
          >
            <div
              className={`flex flex-col items-center ${isMobile ? "gap-4" : "gap-2"}`}
            >
              <div className="fx-trigger flex items-center gap-2 text-2xl">
                <IoLocationOutline className="fx-icon fx-drop text-cbpviolet-500" />
                <p className="bg-gradient-to-l from-cbpviolet-200 to-cbpviolet-400 bg-clip-text text-transparent">
                  El Salvador
                </p>
              </div>
              <span className="text-md">
                <ShinyText text={'"Desde el corazón de Centroamérica"'} />
              </span>
              <div className="mb-2">
                <WavingFlag />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={siteLinks.linkedin}
                className="blur-text-git fx-trigger text-[34px] text-cbpgray-300/70 hover:text-cbpgray-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linkedin"
              >
                <CiLinkedin className="fx-icon fx-pop" />
              </a>
              <a
                href={siteLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="blur-text-git fx-trigger text-[28px] text-cbpgray-300/70 hover:text-cbpgray-300"
                aria-label="Github"
              >
                <FaGithub className="fx-icon fx-spin" />
              </a>

              <a
                href={siteLinks.cv}
                download
                className="blur-text-git flex items-center gap-2 rounded-full border border-cbpgray-300/70 px-3 py-[2px] text-[20px] text-cbpgray-300/70 hover:border-cbpgray-300 hover:text-cbpgray-300"
              >
                <span className="text-[16px]">Descargar CV</span>
              </a>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-26 w-10"></div>
          <div
            className={`${isMobile ? "absolute top-0 right-0 h-24 w-24" : "absolute top-8 right-8 h-20 w-20"} rounded-full bg-gradient-to-bl from-cbpviolet-700 to-cbpbg-900 shadow-[inset_0px_5px_10px_var(--hover-glow),0px_0px_10px_var(--hover-glow),0px_0px_20px_var(--hover-glow),0px_0px_30px_var(--hover-glow)] light:shadow-[0_2px_8px_-2px_rgb(90_24_154/0.25)]`}
          ></div>
        </div>
      </div>
    </div>
  );
};
