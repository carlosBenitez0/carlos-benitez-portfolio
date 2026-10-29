import { useEffect, useRef } from "react";
import { MyPicture } from "../ui/MyPicture";
import { IoIosArrowDown } from "react-icons/io";
import gsap from "gsap";
import ShinyText from "../ui/ShinyText";
import AnimatedGradientText from "../ui/AnimatedGradientText";
import HighlightText from "../ui/HighlightText";
import { useIsMobile } from "../../hooks/useIsMobile";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { PiReadCvLogoLight } from "react-icons/pi";
import { links, profile } from "../../content/site";
import {
  pauseTweensWhileOffscreen,
  prefersReducedMotion,
} from "../../utils/visibility";

// Desplazamiento suave a una sección (#id) sin tocar la URL
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const id = e.currentTarget.getAttribute("href")!.slice(1);
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export const Header = () => {
  const arrowRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const header = headerRef.current;
    const arrow = arrowRef.current;
    if (!header || !arrow) return;

    const reduceMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const appearText = header.querySelectorAll(".appear-text");

      if (reduceMotion) {
        gsap.fromTo(
          [arrow, ...appearText],
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.15, ease: "power1.out" },
        );
        return;
      }

      // El blur se calcula en cada frame a partir de lo que le falta por
      // caer. El filtro se aplica antes del scale (1px a scale 40 se ve como
      // 40px), así que se divide entre la escala actual para que el
      // desenfoque *visible* dependa solo de la altura: arriba muy difusa,
      // nítida al llegar. Al terminar se quita el filter para que el rebote
      // infinito no siga pagando su coste.
      const MAX_VISIBLE_BLUR = 48;
      gsap.fromTo(
        arrow,
        {
          y: -1000,
          opacity: 0,
          scale: 40,
          rotation: 360,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 2.2,
          // Cae cuando el texto ya está casi listo, para no coincidir con
          // los desenfoques de la entrada
          delay: 0.8,
          ease: "power1.out",
          onUpdate: function (this: gsap.core.Tween) {
            const remaining = Math.pow(1 - this.ratio, 0.7);
            const scale = Number(gsap.getProperty(arrow, "scale")) || 1;
            const blur = (MAX_VISIBLE_BLUR * remaining) / scale;
            arrow.style.filter = `blur(${blur.toFixed(3)}px)`;
          },
          onComplete: () => {
            gsap.set(arrow, { clearProps: "filter" });
            ctx.add(() => {
              gsap.to(arrow, {
                y: -10,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
              });
            });
          },
        },
      );

      gsap.fromTo(
        appearText,
        { opacity: 0, filter: "blur(5px)", translateY: 50 },
        {
          // Título, subtítulo y párrafo listos en ~1,9 s (antes ~7 s)
          opacity: 1,
          delay: 0.2,
          duration: 1.1,
          ease: "power3.out",
          filter: "blur(0px)",
          translateY: 0,
          stagger: 0.3,
          clearProps: "filter",
        },
      );
    }, header);

    // El rebote infinito de la flecha se detiene cuando el header no se ve
    const stopPausing = pauseTweensWhileOffscreen(header, arrow);

    return () => {
      stopPausing();
      ctx.revert();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      data-pause-offscreen
      className={`relative min-h-screen ${isMobile ? "mt-0 flex flex-col items-center justify-center" : "mt-24"}`}
    >
      <div
        className={`mx-auto grid w-full gap-6 text-ink lg:max-w-[950px] ${isMobile ? "relative top-15 h-[calc(20vh)] grid-cols-1 grid-rows-2 text-center" : "h-[calc(100vh-80px)] grid-cols-2 grid-rows-1 pb-16"}`}
      >
        <div
          className={`col-span-1 flex flex-col justify-center ${isMobile ? "row-start-2 row-end-3" : ""}`}
        >
          {/* En móvil no cabe sobre la foto sin taparse */}
          {!isMobile && (
            <p
              className={`appear-text mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 light:border-emerald-700/30 light:bg-emerald-600/10 light:text-emerald-800`}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none light:bg-emerald-600"
              />
              {profile.availability}
            </p>
          )}
          <h1
            className={`appear-text relative mb-2 ${isMobile ? "text-[36px]" : "text-[44px]"}`}
          >
            Hola,{" "}
            <AnimatedGradientText
              colors={["#b388ff", "#7c4dff", "#651fff", "#9c64ff", "#d500f9"]}
            >
              <ShinyText text="soy Carlos" disabled={false} speed={3} />
            </AnimatedGradientText>
          </h1>
          <h2 className={`appear-text relative mb-8 text-[16px] text-balance`}>
            <ShinyText
              text="Ingeniero en Sistemas y Computación | Desarrollador Web"
              disabled={false}
              speed={3}
            />
          </h2>
          {!isMobile && (
            <div
              className={`appear-text z-10 font-poppins text-lg leading-relaxed text-balance text-cbpgray-200 ${!isMobile && "text-[16px]"}`}
            >
              Construyo{" "}
              <HighlightText shadowOpacity={1}>
                <ShinyText text="soluciones web" disabled={false} speed={3} />
              </HighlightText>{" "}
              robustas, fusionando{" "}
              <HighlightText shadowOpacity={1}>
                <ShinyText text="código eficiente" disabled={false} speed={3} />
              </HighlightText>{" "}
              con{" "}
              <HighlightText shadowOpacity={1}>
                <ShinyText text="diseño intuitivo" disabled={false} speed={3} />
              </HighlightText>{" "}
              y{" "}
              <HighlightText shadowOpacity={1}>
                <ShinyText text="creativo." disabled={false} speed={3} />
              </HighlightText>{" "}
              Creo que la programación va más allá de la lógica: es un espacio
              para{" "}
              <HighlightText shadowOpacity={1}>
                <ShinyText text="innovar" disabled={false} speed={3} />
              </HighlightText>{" "}
              y resolver problemas con{" "}
              <HighlightText shadowOpacity={1}>
                <ShinyText
                  text="soluciones ingeniosas."
                  disabled={false}
                  speed={3}
                />
              </HighlightText>
            </div>
          )}
          <div
            className={`appear-text z-10 flex flex-wrap items-center ${isMobile ? "justify-center gap-2" : "mt-8 gap-3"}`}
          >
            <a
              href="#cases"
              onClick={scrollToSection}
              className={`fx-trigger flex items-center gap-2 rounded-full bg-cbpviolet-500 font-semibold ${isMobile ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"} text-white shadow-[0_0_20px_var(--hover-glow)] transition-colors hover:bg-cbpviolet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbpviolet-400`}
            >
              Ver casos de estudio
              <HiOutlineArrowRight aria-hidden="true" className="fx-icon" />
            </a>
            <a
              href={links.cv}
              download
              className={`fx-trigger flex items-center gap-2 rounded-full border border-cbpviolet-400/50 font-medium ${isMobile ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} text-cbpgray-200 transition-colors hover:border-cbpviolet-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbpviolet-400`}
            >
              <PiReadCvLogoLight
                aria-hidden="true"
                className="fx-icon fx-flip text-lg"
              />
              Descargar CV
            </a>
          </div>
        </div>
        <div className="col-span-1">
          <MyPicture />
        </div>
      </div>

      <a
        ref={arrowRef}
        href="#projects"
        aria-label="Ir a la sección de proyectos"
        title="Ver proyectos"
        onClick={scrollToSection}
        className={`absolute left-1/2 -translate-x-1/2 cursor-pointer rounded-full p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbpviolet-400 ${isMobile ? "bottom-14" : "bottom-20"}`}
      >
        <IoIosArrowDown
          aria-hidden="true"
          className="h-8 w-8 text-cbpviolet-400 transition-colors duration-300 hover:text-cbpviolet-300"
        />
      </a>
    </header>
  );
};
