import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BgDotGradient } from "./BgDotGradient";
import gsap from "gsap";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  pauseTweensWhileOffscreen,
  prefersReducedMotion,
} from "../../utils/visibility";

// Orbe 3D (Three.js) en su propio chunk: la burbuja CSS se ve mientras carga
// y se queda si el navegador no tiene WebGL
const HeroOrb = lazy(() => import("./HeroOrb"));
const supportsWebGL = () =>
  typeof window !== "undefined" && "WebGLRenderingContext" in window;

export const MyPicture = () => {
  const { isMobile } = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);
  const [orbReady, setOrbReady] = useState(false);
  const [withOrb] = useState(supportsWebGL);
  // El orbe se monta cuando termina la entrada: iniciar WebGL a la vez que
  // las animaciones congelaba la pantalla al cargar
  const [loadOrb, setLoadOrb] = useState(false);
  const handleOrbReady = useCallback(() => setOrbReady(true), []);

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

    tl.fromTo(
      bubble,
      // Sin blur: desenfocar un elemento tan grande a la vez que el resto de
      // la entrada daba tirones; escala y opacidad bastan
      {
        opacity: 0,
        y: isMobile ? 50 : 100,
        scale: 0,
      },
      {
        // La foto entra junto con el texto (antes esperaba 3,2 s)
        delay: 0.4,
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      },
    );
    // La foto aparece justo cuando la burbuja termina de entrar (no antes):
    // un fundido corto desde un poco más pequeña y desenfocada
    tl.addLabel("bubbleIn");
    tl.fromTo(
      picture,
      { opacity: 0, scale: 0.85, filter: "blur(8px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      },
      "bubbleIn",
    );
    // Al terminar se quita el filter: aunque valga blur(0px), obliga a pintar
    // la esfera y la foto en una capa aparte y se ven menos nítidas.
    tl.set([bubble, picture], { clearProps: "filter" });
    // Cuando la entrada (y la flecha) terminan, el orbe se carga en un
    // momento libre del navegador
    let orbTimer = 0;
    let orbIdle = 0;
    tl.call(() => {
      orbTimer = window.setTimeout(() => {
        const start = () => setLoadOrb(true);
        if ("requestIdleCallback" in window) {
          orbIdle = window.requestIdleCallback(start, { timeout: 1500 });
        } else {
          start();
        }
      }, 1200);
    });

    // Cada mancha recorre su propia órbita elíptica alrededor de la foto,
    // con un segundo armónico que la deforma (trayectoria orgánica, no un
    // círculo perfecto) y una "respiración" de escala. Todo sale de un único
    // ángulo, así que la vuelta es continua: sin paradas ni cambios bruscos.
    const reduceMotion = prefersReducedMotion();
    const radius = isMobile ? [35, 75] : [70, 165];
    const orbits = Array.from(dots, (_, index) => ({
      rx: gsap.utils.random(radius[0], radius[1]),
      ry: gsap.utils.random(radius[0], radius[1]) * 0.75,
      wobble: gsap.utils.random(8, isMobile ? 14 : 28),
      phase: (index / dots.length) * Math.PI * 2 + gsap.utils.random(-0.4, 0.4),
      direction: index % 2 === 0 ? 1 : -1,
      period: gsap.utils.random(14, 26),
      baseScale: gsap.utils.random(0.85, 1.15),
      breath: gsap.utils.random(0.08, 0.18),
      depth: gsap.utils.random(0.4, 1) * (index % 2 === 0 ? 1 : -1),
    }));

    const orbitPoint = (orbit: (typeof orbits)[number], angle: number) => ({
      x: orbit.rx * Math.cos(angle) + orbit.wobble * Math.cos(2 * angle + 1),
      y: orbit.ry * Math.sin(angle) + orbit.wobble * Math.sin(3 * angle),
      scale: orbit.baseScale + orbit.breath * Math.sin(2 * angle),
    });

    // Entrada: las manchas nacen detrás de la burbuja ya girando. No hay un
    // tween de posición aparte (frenaba hasta quedarse quieta antes de que
    // empezara la órbita): la órbita arranca desde el primer frame y solo su
    // radio y su escala crecen de 0 a 1, así que nunca dejan de moverse.
    const intros = orbits.map(() => ({ grow: reduceMotion ? 1 : 0 }));
    dots.forEach((dot, index) => {
      const start = orbitPoint(orbits[index], orbits[index].phase);
      if (reduceMotion) {
        gsap.set(dot, { x: start.x, y: start.y, scale: start.scale });
      } else {
        gsap.set(dot, { x: 0, y: 0, scale: 0 });
      }
      tl.fromTo(
        dot,
        { opacity: 0 },
        {
          opacity: 1,
          duration: reduceMotion ? 0.6 : 1.2,
          ease: "power1.out",
          onStart: reduceMotion ? undefined : () => orbit(dot, index),
        },
        // Las manchas no esperan a la foto: salen mientras la burbuja termina
        index === 0 ? "bubbleIn+=0.45" : "<0.08",
      );
    });

    // Parallax con el puntero (solo con ratón): cada mancha se desplaza según
    // su profundidad y el valor se suaviza dentro del propio tween de órbita.
    const pointer = { x: 0, y: 0 };
    const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Un único tween infinito por mancha: anima una variable CSS de 0 a 1 y
    // en cada frame convierte ese progreso en ángulo → posición y escala.
    // Las órbitas nacen en callbacks (fuera del context), así que se guardan
    // aparte; "disposed" evita que un onStart tardío cree otra tras desmontar.
    let disposed = false;
    const orbitTweens: gsap.core.Tween[] = [];
    const orbit = (dot: HTMLElement, index: number) => {
      if (disposed) return;
      const config = orbits[index];
      const setX = gsap.quickSetter(dot, "x", "px");
      const setY = gsap.quickSetter(dot, "y", "px");
      // quickSetter no entiende el alias "scale": hay que fijar cada eje.
      const setScaleX = gsap.quickSetter(dot, "scaleX");
      const setScaleY = gsap.quickSetter(dot, "scaleY");
      const parallax = { x: 0, y: 0 };
      const strength = isMobile ? 0 : 30;
      const intro = intros[index];

      orbitTweens.push(
        gsap.to(intro, { grow: 1, duration: 1.6, ease: "power2.out" }),
      );

      const orbitTween = gsap.fromTo(
        dot,
        { "--orbit": 0 },
        {
          "--orbit": 1,
          duration: config.period,
          repeat: -1,
          ease: "none",
          onUpdate: function (this: gsap.core.Tween) {
            const angle =
              config.phase + config.direction * this.progress() * Math.PI * 2;
            const point = orbitPoint(config, angle);
            parallax.x +=
              (pointer.x * strength * config.depth - parallax.x) * 0.05;
            parallax.y +=
              (pointer.y * strength * config.depth - parallax.y) * 0.05;
            setX(point.x * intro.grow + parallax.x);
            setY(point.y * intro.grow + parallax.y);
            setScaleX(point.scale * intro.grow);
            setScaleY(point.scale * intro.grow);
          },
        },
      );
      orbitTweens.push(orbitTween);
    };

    // Profundidad: con el ratón, la burbuja y la foto se desplazan juntas (la
    // foto va dentro de la burbuja). En 2D y en píxeles enteros: girar en 3D
    // o mover a medio píxel obliga a reescalar la imagen y pierde nitidez.
    // Se usa la propiedad CSS "translate", que se suma a los transform de GSAP
    // de la entrada sin pisarlos.
    const bubbleEl = bubble as HTMLElement | null;
    const pictureEl = picture as HTMLElement | null;
    const depth = { x: 0, y: 0 };
    const applyDepth = () => {
      const offset = `${Math.round(depth.x * 8)}px ${Math.round(depth.y * 8)}px`;
      if (bubbleEl) bubbleEl.style.translate = offset;
      if (pictureEl) pictureEl.style.translate = offset;
    };
    const depthX = gsap.quickTo(depth, "x", {
      duration: 0.9,
      ease: "power3.out",
      onUpdate: applyDepth,
    });
    const depthY = gsap.quickTo(depth, "y", {
      duration: 0.9,
      ease: "power3.out",
      onUpdate: applyDepth,
    });
    const onDepthMove = () => {
      depthX(pointer.x);
      depthY(pointer.y);
    };
    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onDepthMove, { passive: true });
    }

    // La deriva se congela cuando el hero sale de pantalla
    const stopPausing = pauseTweensWhileOffscreen(root, dots);

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointermove", onDepthMove);
      window.clearTimeout(orbTimer);
      if (orbIdle) window.cancelIdleCallback(orbIdle);
      gsap.killTweensOf(depth);
      stopPausing();
      ctx.revert();
      orbitTweens.forEach((tween) => tween.kill());
      gsap.killTweensOf(dots);
      gsap.killTweensOf(intros);
    };
  }, [isMobile]);

  // Tamaño y posición de la burbuja
  const bubbleBox = isMobile
    ? "h-[200px] w-[200px]"
    : "left-[75px] h-[300px] w-[300px]";

  return (
    <div
      ref={rootRef}
      className={`relative flex items-center justify-center ${isMobile ? "-top-16" : "top-1/2"}`}
    >
      <div className="dot absolute flex items-center justify-center bg-red-500 will-change-transform">
        <BgDotGradient
          size={isMobile ? "xl" : "2xl"}
          colors={["accent", "violet"]}
          blur="4xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center will-change-transform">
        <BgDotGradient
          size={isMobile ? "xl" : "3xl"}
          colors={["black", "pink"]}
          blur="5xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center will-change-transform">
        <BgDotGradient
          size={isMobile ? "2xl" : "5xl"}
          colors={["accent", "blue"]}
          blur="3xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center will-change-transform">
        <BgDotGradient
          size={isMobile ? "2xl" : "5xl"}
          colors={["brown", "red"]}
          blur="2xl"
          position={{ right: 0, top: 0 }}
        />
      </div>
      <div className="dot absolute flex items-center justify-center will-change-transform">
        <BgDotGradient
          size={isMobile ? "3xl" : "6xl"}
          colors={["orange", "yellow"]}
          blur="xl"
          position={{ right: 0, top: 0 }}
        />
        <div className="dot absolute flex items-center justify-center will-change-transform">
          <BgDotGradient
            size={isMobile ? "2xl" : "5xl"}
            colors={["purple", "green"]}
            blur="4xl"
            position={{ right: 0, top: 0 }}
          />
        </div>
      </div>
      <div
        className={`picture-bubble absolute rounded-full ${bubbleBox} ${
          orbReady
            ? ""
            : `glass-sphere ${
                !isMobile
                  ? "shadow-[inset_8px_8px_16px_rgba(54,26,111,0.5),inset_-8px_-8px_16px_rgba(175,55,239,0.4),0px_0px_5px_rgba(140,55,200,0.3),0px_0px_25px_rgba(140,55,200,0.3),0px_0px_50px_rgba(140,55,200,0.3),0px_0px_100px_rgba(140,55,200,0.3)]"
                  : "shadow-[inset_4px_4px_8px_rgba(54,26,111,0.5),inset_-4px_-4px_8px_rgba(175,55,239,0.4),0px_0px_2px_rgba(140,55,200,0.3),0px_0px_10px_rgba(140,55,200,0.3),0px_0px_20px_rgba(140,55,200,0.3),0px_0px_40px_rgba(140,55,200,0.3)]"
              }`
        }`}
      >
        {withOrb && loadOrb && (
          <Suspense fallback={null}>
            <HeroOrb onReady={handleOrbReady} />
          </Suspense>
        )}
      </div>
      <figure
        // Centrada sobre la burbuja: mismo centro que bubbleBox (en escritorio,
        // left 75px + 150px de radio - 140px de media foto). Empieza invisible:
        // la entrada de GSAP la muestra cuando la burbuja termina de aparecer.
        className={`my-picture absolute object-cover opacity-0 ${isMobile ? "top-[-93px] w-[185px]" : "top-[-140px] left-[85px] w-[280px]"}`}
      >
        <img
          src="/images/carlos-benitez.webp"
          alt="Carlos Benitez"
          className="mask-radial-from-50% mask-radial-to-70% mask-radial-at-center"
        />
      </figure>
    </div>
  );
};
