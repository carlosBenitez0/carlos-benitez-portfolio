import { FaGithub, FaRegUser } from "react-icons/fa";
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
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  pauseTweensWhileOffscreen,
  prefersReducedMotion,
} from "../../../utils/visibility";
import {
  validateContact,
  type ContactData,
} from "../../../utils/contactForm";
import { sendContactMessage } from "../../../utils/sendContact";


export const ContactContainer = () => {
  const { isMobile } = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    error: "",
  });
  const [sended, setSended] = useState<boolean>(false);
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

    // Si pasa todas las validaciones
    setLoading(true);
    try {
      await sendContactMessage(userData);
      setSended(true);
      // Solo se vacía si se envió: si falla, el visitante conserva su texto
      setUserData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setError({
        name: "formError",
        error: "No se pudo enviar el mensaje",
      });
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
      className={`anim-about-text grid relative overflow-hidden  bg-transparent filter-blur-3xl rounded-xl border-2 border-white/5
    ${isMobile ? "grid-cols-1 grid-rows-2" : " grid-cols-2"}`}
    >
      {/* Olas de fondo: cada una es su propio <svg> y se anima la caja completa
          con transform (compuesto en GPU). Animar elementos dentro de un SVG
          recalculaba su layout en cada frame. */}
      <div className="contact-waves absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden bg-gradient-to-bl from-cbpbg-50 via-cbpbg-500/20 to-transparent">
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
      </div>
      <div
        className={`ring-component absolute ${isMobile ? "-top-35 -left-35 blur-xl w-100 h-100" : "-top-15 -left-15 blur-md w-64 h-64"}  border-[15px] border-cbpviolet-500/50 rounded-full -z-1`}
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
        className={`z-50 grid grid-cols-2 gap-6 rounded-xl ${isMobile ? "pb-5 px-5" : "p-8"}
        [&>div]:flex [&>div]:items-center [&>div]:w-full [&>div]:pl-2 [&>div,&>span>textarea]:border [&>div,&>span>textarea]:border-white/15 [&>div,&>span>textarea]:rounded-lg
        [&>div>input,&>span>textarea]:outline-none [&>div>input]:p-3 [&>div>input,&>span>textarea]:w-full 
        [&>div>input,&>span>textarea]:placeholder:text-white/50 [&>div>input,&>span>textarea]:bg-transparent [&>div,&>span>textarea]:shadow-[inset_0px_0px_20px_rgba(255,255,255,0.1)]
        [&>div>input,&>span>textarea]:autofill:bg-transparent 
        [&>div>.form-icon]:text-white/50 
        ${userData.name !== "" ? "[&>div:nth-child(1)>input,&>div:nth-child(1)>.form-icon]:text-white/90" : ""}
        ${userData.email !== "" ? "[&>div:nth-child(2)>input,&>div:nth-child(2)>.form-icon]:text-white/90" : ""}
        ${userData.subject !== "" ? "[&>div:nth-child(3)>input,&>div:nth-child(3)>.form-icon]:text-white/90" : ""}
        ${userData.message !== "" ? "[&>div:nth-child(4)>textarea]:text-white/90" : ""}

        ${userData.name !== "" ? "[&>div:nth-child(1)]:border-white/25" : ""}
        ${userData.email !== "" ? "[&>div:nth-child(2)]:border-white/25" : ""}
        ${userData.subject !== "" ? "[&>div:nth-child(3)]:border-white/25" : ""}
        ${userData.message !== "" ? "[&>span>textarea]:border-white/25" : ""}
        ${isMobile ? "row-start-2 row-end-3" : ""}`}
      >
        <div className={` ${isMobile ? "col-span-2" : ""}`}>
          <FaRegUser className={`form-icon min-w-4 min-h-4 `} />
          <input
            type="text"
            value={userData.name}
            placeholder="Nombre"
            autoComplete="off"
            className={``}
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className={` ${isMobile ? "col-span-2" : ""}`}>
          <MdOutlineEmail className="form-icon min-w-4 min-h-4" />
          <input
            type="text"
            value={userData.email}
            placeholder="Email"
            autoComplete="off"
            name="email"
            onChange={handleChange}
          />
        </div>
        <div className="col-span-2">
          <MdOutlineSubject className="form-icon min-w-4 min-h-4" />
          <input
            type="text"
            value={userData.subject}
            placeholder="Asunto"
            autoComplete="off"
            name="subject"
            onChange={handleChange}
          />
        </div>
        <span className="col-span-2 ">
          <textarea
            className="p-2 h-30 mb-2 resize-none"
            value={userData.message}
            placeholder="Mensaje"
            autoComplete="off"
            name="message"
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
            />
          )}
          {sended && (
            <SendedComponent message="Revisa tu correo, te dejé un mensaje 😁✌️" />
          )}
        </span>
        <button
          type="submit"
          disabled={loading}
          className="disabled:cursor-wait flex gap-2 items-center justify-center col-span-2 cursor-pointer w-fit border border-cbpbg-50 bg-cbpbg-500/50 hover:bg-cbpbg-500/75 py-2 px-4 rounded-md
          transition duration-300
           [&:hover>.send-icon]:-rotate-35
           shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)]"
        >
          {/* <Spinner /> */}
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
              <IoMdSend className="send-icon transition-transform duration-300" />
            </>
          )}
        </button>
      </form>

      <div className={isMobile ? "row-start-1 row-end-2 p-5 " : ""}>
        <div
          className={`relative h-full ${isMobile ? "flex items-center justify-center" : ""}`}
        >
          <div
            className={`${isMobile ? "relative top-15" : "absolute"} inset-0 flex items-center justify-center flex-col`}
          >
            <div
              className={`flex flex-col items-center ${isMobile ? "gap-4" : "gap-2"}`}
            >
              <div className="flex items-center gap-2 text-2xl">
                <IoLocationOutline className="text-cbpviolet-500" />
                <p className="bg-gradient-to-l from-cbpviolet-200 to-cbpviolet-500 bg-clip-text text-transparent">
                  El Salvador
                </p>
              </div>
              <span className="text-md">
                <ShinyText text={'"Desde el corazón de Centroamérica"'} />
              </span>
              <img
                src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1752763407/el-salvador_s5asqk.png"
                alt="El Salvador"
                className="w-20 h-20 drop-shadow-[0px_0px_5px_#7b2cbfff] mb-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/carlos-benitez-profile/"
                className="blur-text-git text-cbpgray-300/70 hover:text-cbpgray-300 text-[34px]"
                target="_blank"
                aria-label="Linkedin"
              >
                <CiLinkedin />
              </a>
              <a
                href="https://github.com/carlosBenitez0"
                target="_blank"
                className="blur-text-git text-cbpgray-300/70 hover:text-cbpgray-300 text-[28px]"
                aria-label="Github"
              >
                <FaGithub />
              </a>

              <a
                href="/ES - Carlos Francisco Benítez Quintanilla - CV.pdf"
                download
                className="blur-text-git text-cbpgray-300/70 hover:text-cbpgray-300 text-[20px] 
                flex items-center gap-2 py-[2px] px-3 rounded-full border border-cbpgray-300/70 hover:border-cbpgray-300"
              >
                <span className="text-[16px]">Descargar CV</span>
              </a>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-10 h-26"></div>
          <div
            className={`${isMobile ? "absolute top-0 right-0 w-24 h-24" : "absolute top-8 right-8 w-20 h-20"}  bg-gradient-to-bl from-cbpviolet-700 to-cbpbg-900 rounded-full
          shadow-[inset_0px_5px_10px_rgba(255,255,255,0.1),0px_0px_10px_rgba(255,255,255,0.1),0px_0px_20px_rgba(255,255,255,0.1),0px_0px_30px_rgba(255,255,255,0.1)]`}
          ></div>
        </div>
      </div>
    </div>
  );
};
