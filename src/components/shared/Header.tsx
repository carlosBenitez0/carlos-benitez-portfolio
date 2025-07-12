import { useEffect, useRef } from "react";
import { MyPicture } from "../ui/MyPicture";
import { IoIosArrowDown } from "react-icons/io";
import gsap from "gsap";
import ShinyText from "../ui/ShinyText";
import AnimatedGradientText from "../ui/AnimatedGradientText";
import HighlightText from "../ui/HighlightText";
import SplitText from "gsap/SplitText";

export const Header = () => {
  gsap.registerPlugin(SplitText);
  const arrowRef = useRef<HTMLDivElement>(null);

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
    <header className="relative min-h-screen mt-24">
      <div className="mx-auto grid h-[calc(100vh-80px)] w-full grid-cols-2 gap-4 text-white lg:max-w-5xl">
        <div className="col-span-1 flex flex-col justify-center">
          <h1 className="appear-text text-5xl mb-2">
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
          <h2 className="appear-text text-[16px] mb-8 text-balance">
            <ShinyText
              text="Egresado de Ingeniería en Sistemas y Computación | Desarrollador Web"
              disabled={false}
              speed={3}
              className="custom-class"
            />
          </h2>
          <div className="appear-text text-balance text-cbpgray-200 font-poppins text-lg leading-relaxed z-10">
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
                text="creativo"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </HighlightText>
            . Creo que la programación va más allá de la lógica: es un espacio
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
                text="soluciones ingeniosas"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </HighlightText>
            .
          </div>
        </div>
        <div className="col-span-1 ">
          <MyPicture />
        </div>
      </div>

      <div
        ref={arrowRef}
        className="absolute bottom-22 left-1/2 -translate-x-1/2"
      >
        <IoIosArrowDown className="h-8 w-8 text-cbpviolet-400" />
      </div>
    </header>
  );
};
