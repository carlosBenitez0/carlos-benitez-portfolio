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
import emailjs from "@emailjs/browser";
import { SendedComponent } from "./SendedComponent";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface UserData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactContainer = () => {
  const { isMobile } = useIsMobile();
  const form = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    error: "",
  });
  const [sended, setSended] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSended(false);
    setError({ name: "", error: "" });

    // Validaciones
    if (userData.name === "") {
      setError({ name: "name", error: "El nombre es requerido" });
      return;
    }

    if (userData.name.length < 3) {
      setError({
        name: "name",
        error: "El nombre debe tener al menos 3 caracteres",
      });
      return;
    }

    if (userData.email === "") {
      setError({ name: "email", error: "El email es requerido" });
      return;
    }

    if (
      !/^\w+([/.-]?\w+)@\w+([/.-]?\w+)\.[a-zA-Z]{2,3}$/.test(userData.email)
    ) {
      setError({ name: "email", error: "El email es invalido" });
      return;
    }

    if (userData.subject === "") {
      setError({ name: "subject", error: "El asunto es requerido" });
      return;
    }

    if (userData.subject.length < 3) {
      setError({
        name: "subject",
        error: "El asunto debe tener al menos 3 caracteres",
      });
      return;
    }

    if (userData.message === "") {
      setError({ name: "message", error: "El mensaje es requerido" });
      return;
    }

    if (userData.message.length < 10) {
      setError({
        name: "message",
        error: "El mensaje debe tener al menos 10 caracteres",
      });
      return;
    }

    // Si pasa todas las validaciones
    setLoading(true);

    // Enviar el formulario
    /* setTimeout(() => {
      setLoading(false);
      emailjs
        .sendForm(
          "service_3wblnba",
          "template_vx2h6qt",
          form.current as HTMLFormElement,
          {
            publicKey: "p1-mlOCmCgRp2jNnJ",
          },
        )
        .then(
          () => {
            setSended(true);
          },
          () => {
            setError({
              name: "formError",
              error: "No se pudo enviar el mensaje",
            });
          },
        );

      setUserData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset después de mostrar el mensaje de éxito
      setTimeout(() => {
        setSended(false);
      }, 3000);
    }, 3000); */

    emailjs
      .sendForm(
        "service_3wblnba",
        "template_vx2h6qt",
        form.current as HTMLFormElement,
        {
          publicKey: "p1-mlOCmCgRp2jNnJ",
        },
      )
      .then(
        () => {
          setLoading(false);
          setSended(true);
        },
        () => {
          setLoading(false);
          setError({
            name: "formError",
            error: "No se pudo enviar el mensaje",
          });
        },
      );

    emailjs
      .sendForm(
        "service_3wblnba",
        "template_32ukwf4",
        form.current as HTMLFormElement,
        {
          publicKey: "p1-mlOCmCgRp2jNnJ",
        },
      )
      .then(
        () => {
          setSended(true);
        },
        () => {
          console.log("No se pudo enviar el mensaje");
        },
      );

    setTimeout(() => {
      setSended(false);
    }, 10000);
    setUserData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  useEffect(() => {
    const tl = gsap.timeline();
    const dots = document.querySelectorAll(".dot-contact");

    dots.forEach((dot) => {
      gsap.to(dot, {
        scale: 0.8 + Math.random() * 0.5,
        duration: 1 + Math.random() * 5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      // Limpiar todas las animaciones al desmontar
      tl.kill();
      gsap.killTweensOf(dots);
    };
  }, []);

  return (
    <div
      className={`anim-about-text grid relative overflow-hidden  bg-transparent filter-blur-3xl rounded-xl border-2 border-white/5
    ${isMobile ? "grid-cols-1 grid-rows-2" : " grid-cols-2"}`}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute z-[-1] bg-transparent bg-gradient-to-bl from-cbpbg-50 via-cbpbg-500/20 to-transparent
        w-full"
      >
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
        <g className="translate-y-10">
          <use xlinkHref="#wave" opacity=".3">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="10s"
              calcMode="spline"
              values="270 230; -334 180; 270 230"
              keyTimes="0; .5; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlinkHref="#wave" opacity=".6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="-270 230;243 220;-270 230"
              keyTimes="0; .6; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlinkHref="#wave" opacity=".9">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="0 230;-140 200;0 230"
              keyTimes="0; .4; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
        </g>
      </svg>
      <div
        className={`ring-component absolute ${isMobile ? "-top-35 -left-35 blur-xl w-100 h-100" : "-top-15 -left-15 blur-md w-64 h-64"}  border-[15px] border-cbpviolet-500/50 rounded-full -z-1`}
      ></div>

      <div className="dot-contact absolute flex items-center justify-center">
        <BgDotGradient
          colors={["violet", "blue"]}
          size="lg"
          blur="5xl"
          position={{ top: 200, left: 200 }}
        />
      </div>
      <div className="dot-contact absolute flex items-center justify-center ">
        <BgDotGradient
          colors={["blue", "green"]}
          size="lg"
          blur="5xl"
          position={{ top: 100, left: 400 }}
        />
      </div>

      <form
        ref={form}
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
          className="flex gap-2 items-center justify-center col-span-2 cursor-pointer w-fit border border-cbpbg-50 bg-cbpbg-500/50 hover:bg-cbpbg-500/75 py-2 px-4 rounded-md
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
                href="https://www.linkedin.com/in/carlos-ben%C3%ADtez-profile/"
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
                href="./downloads/Carlos-Francisco-Benítez-Quintanilla-CV.pdf"
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
