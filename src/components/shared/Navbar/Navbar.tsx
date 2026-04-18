import { useCallback, useEffect, useRef, useState } from "react";
import { RiHomeLine } from "react-icons/ri";
import { IoCodeWorkingOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { PiReadCvLogoLight } from "react-icons/pi";
import { FaRobot } from "react-icons/fa";
import { NavbarLink } from "./NavbarLink";
import gsap from "gsap";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const Navbar = () => {
  const [optionSelected, setOptionSelected] = useState("start");
  const menuRef = useRef<HTMLUListElement>(null);
  const socialMenuRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const sectionRefs = useRef<{
    [key: string]: IntersectionObserverEntry | null;
  }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const links = [
    {
      label: "start",
      href: "#start",
      icon: <RiHomeLine />,
      text: "Inicio",
    },
    {
      label: "projects",
      href: "#projects",
      icon: <IoCodeWorkingOutline />,
      text: "Proyectos",
    },
    {
      label: "about",
      href: "#about",
      icon: <IoIosInformationCircleOutline />,
      text: "Sobre mí",
    },
    {
      label: "technologies",
      href: "#technologies",
      icon: <IoCodeSlashOutline />,
      text: "Tecnologías",
    },
    {
      label: "ai",
      href: "#ai",
      icon: <FaRobot className="text-lg" />,
      text: "AI",
    },
    {
      label: "contact",
      href: "#contact",
      icon: <MdOutlineConnectWithoutContact />,
      text: "Contáctame",
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

  // Set up Intersection Observer
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      let mostVisibleSection = "";
      let maxRatio = 0;

      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        sectionRefs.current[sectionId] = entry;

        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleSection = sectionId;
        }
      });

      if (mostVisibleSection && maxRatio > 0.1) {
        setOptionSelected(mostVisibleSection);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Very low threshold to catch any visibility
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    // Observe all sections
    const sections = [
      "start",
      "projects",
      "about",
      "technologies",
      "ai",
      "contact",
    ];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  //animacion de gsap blurText para cada link con un delay de .3s
  useEffect(() => {
    const links = document.querySelectorAll(".blur-text");
    const linksInGit = document.querySelectorAll(".blur-text-git");
    const menu = document.querySelectorAll(".fade-in-menu");
    const nav = document.querySelectorAll(".nav-padding");
    const logo = document.querySelector(".cb-logo");
    const tl = gsap.timeline();

    tl.fromTo(
      logo,
      {
        autoAlpha: 0,
        y: 10,
        filter: "blur(5px)",
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        filter: "blur(0px)",
        ease: "power3.out",
      },
    );

    menu.forEach((menu) => {
      tl.fromTo(
        menu,
        {
          autoAlpha: 0,
          width: 0,
          background: "purple",
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
        },
        {
          autoAlpha: 1,
          width: "auto",
          background: "rgba(10, 14, 26, 0.7)",
          height: isMobile ? "40px" : "50px",
          paddingTop: isMobile ? 6 : 16,
          paddingBottom: isMobile ? 6 : 16,
          duration: 1.5,
          ease: "power3.out",
        },
      );
    });

    tl.fromTo(
      nav,
      { padding: isMobile ? 50 : 100 },
      { padding: 20, duration: 1.5, ease: "power3.out" },
    );

    links.forEach((link) => {
      tl.fromTo(
        link,
        { autoAlpha: 0, y: 10, filter: "blur(5px)" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.25,
          filter: "blur(0px)",
          ease: "power1.inOut",
        },
      );
    });

    linksInGit.forEach((link) => {
      tl.fromTo(
        link,
        { autoAlpha: 0, y: 10, filter: "blur(5px)" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          filter: "blur(0px)",
          ease: "power3.out",
        },
      );
    });
  }, [isMobile]);

  return (
    <div
      className={`z-40 flex items-center fixed top-0 mx-auto w-full lg:max-w-[950px] ${isMobile ? "justify-between p-4 " : "justify-between"}`}
    >
      {/* <div className="from-cbpviolet-400 via-cbpviolet-600 to-cbpviolet-500 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
        CarlosBenítez
      </div> */}

      <figure>
        <img
          src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751309549/cb-logo2_kowmru.png"
          alt=""
          className={`cb-logo  ${isMobile ? "w-10 max-w-10" : "min-w-12 w-12"}`}
        />
      </figure>
      <nav className="nav-padding">
        <ul
          ref={menuRef}
          className={`fade-in-menu relative border-white/7 flex items-center justify-center rounded-full border backdrop-blur-sm ${isMobile ? "px-3 py-0 gap-2" : "gap-5 px-6 py-4"}
         ${!isMobile ? "before:content-[''] before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-[1] before:z-[-1] before:pointer-events-none before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),rgba(255,255,255,0.1)_0%,transparent_10%)]" : ""}`}
        >
          {links.map((link) => (
            <NavbarLink
              key={link.label}
              label={link.label}
              href={link.href}
              optionSelected={optionSelected}
              setOptionSelected={setOptionSelected}
              icon={link.icon}
              text={link.text}
            />
          ))}
        </ul>
      </nav>
      <div
        ref={socialMenuRef}
        className={`fade-in-menu relative border-white/7 flex items-center rounded-full border  backdrop-blur-sm ${isMobile ? "justify-center gap-1 px-2" : "gap-5 px-6 py-4"}
     ${!isMobile ? "before:content-[''] before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-[-1] before:pointer-events-none before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,100px)_var(--mouse-y,100px),rgba(255,255,255,0.1)_0%,transparent_10%)]" : ""}`}
      >
        <a
          href="https://www.linkedin.com/in/carlos-benitez-profile/"
          className={`blur-text-git text-cbpgray-300/70 hover:text-cbpgray-300 transition-transform duration-300 hover:-translate-y-1 ${isMobile ? "text-[22px]" : "text-[22px]"}`}
          target="_blank"
          aria-label="Linkedin"
        >
          <CiLinkedin />
        </a>
        <a
          href="https://github.com/carlosBenitez0"
          target="_blank"
          className={`blur-text-git text-cbpgray-300/70 hover:text-cbpgray-300 transition-transform duration-300 hover:-translate-y-1 ${isMobile ? "text-[18px]" : "text-[19px]"}`}
          aria-label="Github"
        >
          <FaGithub />
        </a>
        <a
          href="/ES - Carlos Francisco Benítez Quintanilla - CV.pdf"
          download
          className={`blur-text-git text-cbpgray-300/70 hover:text-cbpgray-300 transition-transform duration-300 hover:-translate-y-1 ${isMobile ? "text-[20px]" : "text-[22px]"}`}
          aria-label="Curriculum vitae"
        >
          <PiReadCvLogoLight />
        </a>
      </div>
    </div>
  );
};