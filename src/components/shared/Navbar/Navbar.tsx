import { useCallback, useEffect, useRef, useState } from "react";
import { links as siteLinks } from "../../../content/site";
import { IoCodeWorkingOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";
import {
  MdOutlineConnectWithoutContact,
  MdOutlineWorkOutline,
} from "react-icons/md";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { PiReadCvLogoLight } from "react-icons/pi";
import { FaRobot } from "react-icons/fa";
import { NavbarLink } from "./NavbarLink";
import gsap from "gsap";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { getTheme } from "../../../hooks/useTheme";
import { t } from "../../../i18n/ui";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const [optionSelected, setOptionSelected] = useState("start");
  const menuRef = useRef<HTMLUListElement>(null);
  const socialMenuRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const links = [
    {
      label: "projects",
      href: "#projects",
      icon: <IoCodeWorkingOutline className="fx-icon fx-stretch" />,
      text: t.nav.projects,
    },
    {
      label: "experience",
      href: "#experience",
      icon: <MdOutlineWorkOutline className="fx-icon fx-swing" />,
      text: t.nav.experience,
    },
    {
      label: "about",
      href: "#about",
      icon: <IoIosInformationCircleOutline className="fx-icon fx-swing" />,
      text: t.nav.about,
    },
    {
      label: "technologies",
      href: "#technologies",
      icon: <IoCodeSlashOutline className="fx-icon fx-glitch" />,
      text: t.nav.technologies,
    },
    {
      label: "ai",
      href: "#ai",
      icon: <FaRobot className="fx-icon fx-beep text-lg" />,
      text: t.nav.ai,
    },
    {
      label: "contact",
      href: "#contact",
      icon: <MdOutlineConnectWithoutContact className="fx-icon fx-ring" />,
      text: t.nav.contact,
    },
  ];

  // Efecto de iluminación con mouse
  const handleMouseMove = useCallback((e: MouseEvent, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  useEffect(() => {
    const mainMenu = menuRef.current;
    const socialMenu = socialMenuRef.current;

    // Definimos los manejadores dentro del efecto
    const mainMenuHandler = (e: MouseEvent) =>
      mainMenu && handleMouseMove(e, mainMenu);
    const socialMenuHandler = (e: MouseEvent) =>
      socialMenu && handleMouseMove(e, socialMenu);

    if (mainMenu) {
      mainMenu.addEventListener("mousemove", mainMenuHandler);
    }

    if (socialMenu) {
      socialMenu.addEventListener("mousemove", socialMenuHandler);
    }

    return () => {
      if (mainMenu) {
        mainMenu.removeEventListener("mousemove", mainMenuHandler);
      }
      if (socialMenu) {
        socialMenu.removeEventListener("mousemove", socialMenuHandler);
      }
    };
  }, [handleMouseMove]); // Dependencia del callback

  // Sección activa según el scroll: la última cuyo borde superior ya pasó
  // una línea al 35% de la pantalla ("Inicio" si ninguna lo hizo).
  // Todo es geometría de la propia sección, sin depender de qué elemento hace
  // scroll (la página se desplaza con el contenedor raíz de App, no con
  // window, y ese contenedor puede no tener aún sus estilos al montar).
  useEffect(() => {
    const sections = [
      "projects",
      "experience",
      "about",
      "technologies",
      "ai",
      "contact",
    ];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let active = "start";
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) {
          active = id;
        }
      }
      // La última sección quizá nunca llegue a la línea (debajo solo está el
      // footer): cuenta como activa cuando ya se ve completa.
      const last = document.getElementById(sections[sections.length - 1]);
      if (last) {
        const rect = last.getBoundingClientRect();
        if (
          rect.top < window.innerHeight &&
          rect.bottom <= window.innerHeight
        ) {
          active = sections[sections.length - 1];
        }
      }
      setOptionSelected(active);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // El evento scroll no burbujea: en captura llega el de cualquier elemento
    document.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", schedule);
    // Recalcula cuando cambia el layout (estilos, imágenes, fuentes)
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    const start = document.getElementById("start");
    if (start) resizeObserver.observe(start);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
    };
  }, []);

  //animacion de gsap blurText para cada link con un delay de .3s
  // Solo transform/opacity/clip-path: nada de width/height/padding, que
  // obligaban a recalcular el layout de la página en cada frame.
  useEffect(() => {
    const root = navbarRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const links = root.querySelectorAll(".blur-text");
      const linksInGit = root.querySelectorAll(".blur-text-git");
      const menu = root.querySelectorAll(".fade-in-menu");
      const logo = root.querySelector(".cb-logo");
      const tl = gsap.timeline();

      // Entrada rápida y en paralelo (~1,2 s): antes cada pieza esperaba a la
      // anterior y los links no estaban listos hasta los ~8 s.
      // clearProps "filter": un blur(0px) residual empeora la nitidez.
      tl.fromTo(
        logo,
        { autoAlpha: 0, y: 10, filter: "blur(5px)" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          filter: "blur(0px)",
          ease: "power3.out",
          clearProps: "filter",
        },
        0,
      );

      // La píldora "crece" desde su centro recortándose, en lugar de animar
      // su tamaño real. Las dos píldoras a la vez.
      // El fondo final lo pone .navbar-pill según el tema: aquí solo se
      // anima el destello violeta de entrada y luego se limpia.
      tl.fromTo(
        menu,
        {
          autoAlpha: 0,
          clipPath: "inset(50% 50% round 9999px)",
          backgroundColor: getTheme() === "light" ? "#e0aaff" : "purple",
        },
        {
          autoAlpha: 1,
          clipPath: "inset(0% 0% round 9999px)",
          backgroundColor: getComputedStyle(menu[0]).backgroundColor,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "clipPath,backgroundColor",
        },
        0.1,
      );

      // Equivale al antiguo padding 100px -> 20px del nav: la barra entra
      // desplazada hacia abajo y sube a su sitio.
      tl.fromTo(
        root,
        { y: isMobile ? 30 : 80 },
        { y: 0, duration: 0.8, ease: "power3.out", clearProps: "transform" },
        0.1,
      );

      // Links e iconos sociales en cascada corta mientras la barra sube
      tl.fromTo(
        [...links, ...linksInGit],
        { autoAlpha: 0, y: 10, filter: "blur(5px)" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          filter: "blur(0px)",
          ease: "power2.out",
          stagger: 0.05,
          clearProps: "filter",
        },
        0.35,
      );
    }, root);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div
      ref={navbarRef}
      className={`fixed inset-x-[var(--scrollbar-gutter,0px)] top-0 z-40 mx-auto flex items-center ${isMobile ? "justify-between p-4" : "max-w-[950px] justify-between"}`}
    >
      {/* El logo lleva al inicio: así el menú no necesita un link "Inicio" y
          cabe con todas las secciones */}
      <a
        href="#start"
        aria-label={t.nav.home}
        title={t.nav.homeTitle}
        onClick={(e) => {
          e.preventDefault();
          setOptionSelected("start");
          document
            .getElementById("start")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbpviolet-400"
      >
        <img
          src="/images/logo-cb.webp"
          alt=""
          className={`cb-logo ${isMobile ? "w-10 max-w-10" : "w-12 min-w-12"}`}
        />
      </a>
      {/* En móvil, poco relleno lateral: así las dos píldoras no se tocan en
          pantallas angostas (375px) */}
      <nav className={`nav-padding ${isMobile ? "px-1.5 py-5" : "px-3 py-5"}`}>
        <ul
          ref={menuRef}
          style={{
            height: isMobile ? 40 : 50,
            paddingBlock: isMobile ? 6 : 16,
          }}
          className={`fade-in-menu navbar-pill relative flex items-center justify-center rounded-full border border-ink/7 backdrop-blur-sm ${isMobile ? "gap-2 px-3 py-0" : "gap-3 px-4 py-4"} ${!isMobile ? "before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:rounded-full before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),var(--hover-glow)_0%,transparent_10%)] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-[1]" : ""}`}
        >
          {links.map((link) => (
            <li key={link.label}>
              <NavbarLink
                label={link.label}
                href={link.href}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                icon={link.icon}
                text={link.text}
              />
            </li>
          ))}
        </ul>
      </nav>
      <div
        ref={socialMenuRef}
        style={{ height: isMobile ? 40 : 50, paddingBlock: isMobile ? 6 : 16 }}
        className={`fade-in-menu navbar-pill relative flex items-center rounded-full border border-ink/7 backdrop-blur-sm ${isMobile ? "justify-center gap-1 px-2" : "gap-2.5 px-3.5 py-4"} ${!isMobile ? "before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:rounded-full before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),var(--hover-glow)_0%,transparent_10%)] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-100" : ""}`}
      >
        <a
          href={siteLinks.linkedin}
          className={`blur-text-git fx-trigger text-cbpgray-300/70 transition-transform duration-300 hover:-translate-y-1 hover:text-cbpgray-300 ${isMobile ? "text-[22px]" : "text-[22px]"}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.nav.linkedin}
        >
          <CiLinkedin className="fx-icon fx-pop" />
        </a>
        <a
          href={siteLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`blur-text-git fx-trigger text-cbpgray-300/70 transition-transform duration-300 hover:-translate-y-1 hover:text-cbpgray-300 ${isMobile ? "text-[18px]" : "text-[19px]"}`}
          aria-label={t.nav.github}
        >
          <FaGithub className="fx-icon fx-spin" />
        </a>
        {/* En móvil no cabe junto al selector de idioma; el CV sigue en el
            botón del hero y en Contacto */}
        {!isMobile && (
          <a
            href={siteLinks.cv}
            download
            className="blur-text-git fx-trigger text-[22px] text-cbpgray-300/70 transition-transform duration-300 hover:-translate-y-1 hover:text-cbpgray-300"
            aria-label={t.nav.cv}
          >
            <PiReadCvLogoLight className="fx-icon fx-flip" />
          </a>
        )}
        <ThemeToggle className={isMobile ? "text-[19px]" : "text-[20px]"} />
        <LanguageSwitch />
      </div>
    </div>
  );
};
