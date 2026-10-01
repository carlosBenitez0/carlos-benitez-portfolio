import { useEffect, useRef } from "react";
import { BgDotGradient } from "./BgDotGradient";
import gsap from "gsap";
import { useIsMobile } from "../../hooks/useIsMobile";

export const MyPicture = () => {
  const { isMobile } = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const picture = root.querySelector(".my-picture");
    const dots = root.querySelectorAll<HTMLElement>(".dot");
    const bubble = root.querySelector(".picture-bubble");
    // gsap.context registra la timeline de entrada para revertirla en el cleanup.
    const ctx = gsap.context(() => {}, root);
    let tl!: gsap.core.Timeline;
    ctx.add(() => {
      tl = gsap.timeline();
    });

    const generateRandomPosition = () => {
      if (isMobile) {
        return {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
        };
      }
      return {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      };
    };

    const finalPositions = Array.from(
      { length: dots.length },
      generateRandomPosition,
    );

    tl.fromTo(
      bubble,
      {
        opacity: 0,
        y: isMobile ? 50 : 100,
        scale: 0,
        filter: "blur(20px)",
      },
      {
        delay: 3.2,
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 2,
        ease: "power3.out",
      },
    );
    tl.fromTo(
      picture,
      {
        opacity: 0,
        y: isMobile ? 50 : 100,
        scale: 0,
        filter: "blur(20px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 2,
        ease: "power3.out",
      },
      "<1",
    );
    tl.to(
      picture,
      {
        filter: "blur(0px)",
        duration: 2,
        ease: "power3.out",
      },
      "<0.2",
    );

    // Posiciones iniciales aleatorias fuera de pantalla
    dots.forEach((dot, index) => {
      const startX = isMobile
        ? (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 50)
        : (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 100);
      const startY = isMobile
        ? (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 50)
        : (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 100);

      tl.fromTo(
        dot,
        {
          opacity: 0,
          x: startX,
          y: startY,
        },
        {
          opacity: 1,
          x: finalPositions[index].x,
          y: finalPositions[index].y,
          duration: 0.5,
          ease: "power1.inOut",
          delay: index * 0.01, // Espaciado entre dots
        },
        "<0.2", // Comienza 0.5s después del inicio de la timeline
      );
    });

    //generar movimiento aleatorio constante:
    const generateRandomMovement = () => {
      const randomValue =
        Math.random() * (isMobile ? 100 : 300) - (isMobile ? 50 : 150);
      return randomValue;
    };

    const generateRandomSize = () => {
      const randomValue = Math.random() * (isMobile ? 1.2 : 1.3);
      return randomValue;
    };
    // Deriva continua: cada dot tiene un único tween vivo que, al terminar,
    // encadena el siguiente hacia una posición aleatoria nueva. Antes un
    // setInterval añadía 6 tweens infinitos por segundo sin liberarlos nunca.
    const drift = (dot: HTMLElement, index: number) => {
      gsap.to(dot, {
        x: generateRandomMovement(),
        y: generateRandomMovement(),
        scale: generateRandomSize(),
        duration: 3,
        delay: index * 0.1,
        ease: "power1.inOut",
        onComplete: () => drift(dot, 0),
      });
    };
    tl.call(() => dots.forEach(drift));

    return () => {
      ctx.revert();
      gsap.killTweensOf(dots);
    };
  }, [isMobile]);

  return (
    <div
      ref={rootRef}
      className={`relative flex items-center justify-center ${isMobile ? "-top-16" : "top-1/2"}`}
    >
      <div className="dot absolute flex items-center justify-center bg-red-500">
        <BgDotGradient
          size={isMobile ? "xl" : "2xl"}
          colors={["accent", "violet"]}
          blur="4xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size={isMobile ? "xl" : "3xl"}
          colors={["black", "pink"]}
          blur="5xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size={isMobile ? "2xl" : "5xl"}
          colors={["accent", "blue"]}
          blur="3xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size={isMobile ? "2xl" : "5xl"}
          colors={["brown", "red"]}
          blur="2xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size={isMobile ? "3xl" : "6xl"}
          colors={["orange", "yellow"]}
          blur="xl"
          position={{ right: 0, top: 0 }}
        />
        <div className="dot absolute flex items-center justify-center">
          <BgDotGradient
            size={isMobile ? "2xl" : "5xl"}
            colors={["purple", "green"]}
            blur="4xl"
            position={{ right: 0, top: 0 }}
          />
        </div>
      </div>
      <div
        className={`picture-bubble absolute 
        ${
          !isMobile
            ? "shadow-[inset_8px_8px_16px_rgba(54,26,111,0.5),inset_-8px_-8px_16px_rgba(175,55,239,0.4),0px_0px_5px_rgba(140,55,200,0.3),0px_0px_25px_rgba(140,55,200,0.3),0px_0px_50px_rgba(140,55,200,0.3),0px_0px_100px_rgba(140,55,200,0.3)]"
            : "shadow-[inset_4px_4px_8px_rgba(54,26,111,0.5),inset_-4px_-4px_8px_rgba(175,55,239,0.4),0px_0px_2px_rgba(140,55,200,0.3),0px_0px_10px_rgba(140,55,200,0.3),0px_0px_20px_rgba(140,55,200,0.3),0px_0px_40px_rgba(140,55,200,0.3)]"
        }
          rounded-full bg-gradient-to-b from-cbpviolet-500/30 to-cbpviolet-900/50  ${isMobile ? "h-[200px] w-[200px] " : "h-[300px] w-[300px] left-[75px]"} `}
      ></div>
      <figure
        className={`my-picture absolute object-cover ${isMobile ? "w-[150px] top-[-120px]" : "w-[225px] top-[-180px]"}`}
      >
        <img
          src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751572816/carlos-benitez-foto_mamqno.png"
          alt="Carlos Benitez"
          className="mask-radial-from-50% mask-radial-to-70% mask-radial-at-center"
        />
      </figure>
    </div>
  );
};
