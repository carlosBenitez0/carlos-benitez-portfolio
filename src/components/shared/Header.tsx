import { useEffect, useRef } from "react";
import { MyPicture } from "../ui/MyPicture";
import { IoIosArrowDown } from "react-icons/io";
import gsap from "gsap";
import ShinyText from "../ui/ShinyText";
import AnimatedGradientText from "../ui/AnimatedGradientText";
import HighlightText from "../ui/HighlightText";
import { useIsMobile } from "../../hooks/useIsMobile";

export const Header = () => {
  const arrowRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const appearText = document.querySelectorAll(".appear-text");
    if (!arrowRef.current) return;

    gsap.fromTo(
      arrowRef.current,
      {
        y: -1000,
        opacity: 0,
        scale: 40,
        rotation: 360,
        repeat: -1,
        filter: "blur(10px)",
        yoyo: true,
        ease: "power1.inOut",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: "blur(0px)",
        duration: 5,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(arrowRef.current, {
            y: -10,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        },
      },
    );

    gsap.fromTo(
      appearText,
      { opacity: 0, filter: "blur(5px)", translateY: 50 },
      {
        opacity: 1,
        duration: 4.5,
        ease: "power3.out",
        filter: "blur(0px)",
        translateY: 0,
        stagger: 1.5,
      },
    );
  }, []);

  return (
    <header
      data-pause-offscreen
      className={`relative min-h-screen  ${isMobile ? "mt-0 flex flex-col items-center justify-center" : "mt-24"}`}
    >
      <div
        className={`mx-auto grid  w-full  gap-6 text-white lg:max-w-[950px] ${isMobile ? "grid-cols-1 grid-rows-2 text-center h-[calc(20vh)] relative top-15 " : "grid-cols-2 grid-rows-1 h-[calc(100vh-80px)] pb-16"}`}
      >
        <div
          className={`col-span-1 flex flex-col justify-center ${isMobile ? "row-start-2 row-end-3" : ""}`}
        >
          <h1
            className={`relative appear-text mb-2 ${isMobile ? "text-[36px] " : "text-[44px]"}`}
          >
            Hola,{" "}
            <AnimatedGradientText
              colors={["#b388ff", "#7c4dff", "#651fff", "#9c64ff", "#d500f9"]}
            >
              <ShinyText
                text="soy Carlos"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </AnimatedGradientText>
          </h1>
          <h2 className={`relative appear-text text-[16px] mb-8 text-balance `}>
            <ShinyText
              text="Ingeniero en Sistemas y Computación | Desarrollador Web"
              disabled={false}
              speed={3}
              className="custom-class"
            />
          </h2>
          {!isMobile && (
            <div
              className={`appear-text text-balance text-cbpgray-200 font-poppins text-lg leading-relaxed z-10 ${!isMobile && "text-[16px]"}`}
            >
              Construyo{" "}
              <HighlightText shadowOpacity={1}>
                {" "}
                <ShinyText
                  text="soluciones web"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />{" "}
              </HighlightText>{" "}
              robustas, fusionando{" "}
              <HighlightText shadowOpacity={1}>
                {" "}
                <ShinyText
                  text="código eficiente"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />{" "}
              </HighlightText>{" "}
              con
              <HighlightText shadowOpacity={1}>
                {" "}
                <ShinyText
                  text="diseño intuitivo"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />{" "}
              </HighlightText>{" "}
              y{" "}
              <HighlightText shadowOpacity={1}>
                {" "}
                <ShinyText
                  text="creativo. "
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </HighlightText>
              {" "}Creo que la programación va más allá de la lógica: es un espacio
              para{" "}
              <HighlightText shadowOpacity={1}>
                {" "}
                <ShinyText
                  text="innovar"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />{" "}
              </HighlightText>{" "}
              y resolver problemas con
              <HighlightText shadowOpacity={1}>
                {" "}
                <ShinyText
                  text="soluciones ingeniosas."
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </HighlightText>
            </div>
          )}
        </div>
        <div className="col-span-1">
          <MyPicture />
        </div>
      </div>

      <div
        ref={arrowRef}
        className={`absolute left-1/2 -translate-x-1/2 ${isMobile ? "bottom-16" : "bottom-22"}`}
      >
        <IoIosArrowDown className="h-8 w-8 text-cbpviolet-400" />
      </div>
    </header>
  );
};
