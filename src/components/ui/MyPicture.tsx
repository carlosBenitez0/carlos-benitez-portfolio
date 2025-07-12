import { useEffect } from "react";
import { BgDotGradient } from "./BgDotGradient";
import gsap from "gsap";
export const MyPicture = () => {
  useEffect(() => {
    const picture = document.querySelector(".my-picture");
    const dots = document.querySelectorAll(".dot");
    const bubble = document.querySelector(".picture-bubble");
    const tl = gsap.timeline();

    const generateRandomPosition = () => {
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
        y: 100,
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
        y: 100,
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
    /* tl.to(
      picture,
      {
        translateY: "-5px",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
      "<",
    );
    tl.to(
      bubble,
      {
        translateY: "-40px",
        duration: 2,
        rotate: 360,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
      "<",
    ); */
    // Posiciones iniciales aleatorias fuera de pantalla
    dots.forEach((dot, index) => {
      const startX =
        (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 100);
      const startY =
        (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 100);

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
      const randomValue = Math.random() * 300 - 150;
      return randomValue;
    };

    const generateRandomSize = () => {
      const randomValue = Math.random() * 1.3;
      return randomValue;
    };
    const timer = setInterval(() => {
      dots.forEach((dot, index) => {
        tl.to(
          dot,
          {
            x: generateRandomMovement(),
            y: generateRandomMovement(),
            scale: generateRandomSize(),
            duration: 3,
            ease: "power1.inOut",
            delay: index * 0.1,
            repeat: -1,
            yoyo: true,
          },
          "<0.1", // Comienza 0.5s después del inicio de la timeline
        );
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative top-1/2 flex items-center justify-center">
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size="2xl"
          colors={["accent", "violet"]}
          blur="4xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size="3xl"
          colors={["black", "pink"]}
          blur="5xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size="5xl"
          colors={["accent", "blue"]}
          blur="3xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size="5xl"
          colors={["brown", "red"]}
          blur="2xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center">
        <BgDotGradient
          size="6xl"
          colors={["orange", "yellow"]}
          blur="xl"
          position={{ right: 0, top: 0 }}
        />
        <div className="dot absolute flex items-center justify-center">
          <BgDotGradient
            size="5xl"
            colors={["purple", "green"]}
            blur="4xl"
            position={{ right: 0, top: 0 }}
          />
        </div>
      </div>
      <div className="picture-bubble absolute shadow-[inset_8px_8px_16px_rgba(54,26,111,0.5),inset_-8px_-8px_16px_rgba(175,55,239,0.4)]  rounded-full p-8 bg-gradient-to-b from-cbpviolet-500/30 to-cbpviolet-900/50 left-[50px]  h-[400px] w-[400px]"></div>
      <figure className="my-picture absolute w-[300px] top-[-250px] object-cover">
        <img
          src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751572816/carlos-benitez-foto_mamqno.png"
          alt="Carlos Benitez"
          className="mask-radial-from-50% mask-radial-to-70% mask-radial-at-center"
        />
      </figure>
    </div>
  );
};
