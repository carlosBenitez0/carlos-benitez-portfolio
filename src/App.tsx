import { Footer } from "./components/shared/Footer/Footer";
import { Header } from "./components/shared/Header";
import { Navbar } from "./components/shared/Navbar/Navbar";
import { ProyectCard } from "./components/ui/proyects/ProyectCard";
import { SectionTitle } from "./components/ui/SectionTitle";
import { useProyects } from "./utils/useProyects";
import { IoCodeWorkingOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import ShinyText from "./components/ui/ShinyText";
import { TechnologyLabel } from "./components/ui/proyects/TechnologyLabel";
import { useTechnologies } from "./utils/useTechnologies";
import { technologies as technologiesSectionData } from "./utils/technologies";
import { TechnologiesContainer } from "./components/ui/Technologies/TechnologiesContainer";
import { BgDotGradient } from "./components/ui/BgDotGradient";
import { ContactContainer } from "./components/ui/contact/ContactContainer";
import { AISection } from "./components/ui/ai/AISection";
import { HoloPhotoCard } from "./components/ui/HoloPhotoCard";
import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsMobile } from "./hooks/useIsMobile";
import { TechTooltip } from "./components/deferred";
import { SiteAnalytics } from "./components/SiteAnalytics";
import { preloadDeferredComponents } from "./utils/preloadDeferred";
import { usePauseOffscreenAnimations } from "./hooks/usePauseOffscreenAnimations";
import {
  pauseTweensWhileOffscreen,
  prefersReducedMotion,
} from "./utils/visibility";

function App() {
  const proyects = useProyects();
  const technologies = useTechnologies();
  const { isMobile } = useIsMobile();

  const technologiesRef = useRef<HTMLElement>(null);
  usePauseOffscreenAnimations();
  useEffect(() => preloadDeferredComponents(), []);

  useEffect(() => {
    const technologiesSection = technologiesRef.current;
    if (!technologiesSection || prefersReducedMotion()) return;
    const dots_technologies =
      technologiesSection.querySelectorAll(".dot-technologies");

    // Función para generar movimiento aleatorio dentro del contenedor
    const generateRandomMovement = () => {
      return {
        x: Math.random() * 200,
        y: Math.random() * 100,
      };
    };

    // Animación de movimiento continuo
    dots_technologies.forEach((dot) => {
      const moveDot = () => {
        const newPos = generateRandomMovement();
        gsap.to(dot, {
          x: newPos.x,
          y: newPos.y,
          scale: 0.8 + Math.random() * 0.5, // Variación de tamaño
          duration: 1 + Math.random() * 5, // Duración variable
          ease: "power1.inOut",
          onComplete: moveDot, // Vuelve a llamar la función para movimiento continuo
        });
      };

      moveDot(); // Iniciar el movimiento
    });

    // Sin animar mientras la sección no se ve
    const stopPausing = pauseTweensWhileOffscreen(
      technologiesSection,
      dots_technologies,
    );

    return () => {
      // Limpiar todas las animaciones al desmontar
      stopPausing();
      gsap.killTweensOf(dots_technologies);
    };
  }, []);

  return (
    <div
      className={`relative z-40 h-screen overflow-x-hidden bg-cbpbg-900 font-poppins ${isMobile ? "" : "w-full"}`}
    >
      {/* Tech Tooltip - componente que muestra información sobre las tecnologías */}
      <SiteAnalytics />
      <Suspense fallback={null}>
        <TechTooltip />
      </Suspense>

      <div className="absolute top-0 mx-auto h-[70vh] w-full rounded-b-full bg-gradient-to-b from-cbpviolet-500/20 to-cbpviolet-900/10 blur-3xl"></div>

      <div
        id="start"
        className={`mx-auto h-full w-full text-white ${isMobile ? "" : "max-w-[950px]"}`}
      >
        <Navbar />

        <Header />
        <main>
          <section
            id="projects"
            data-pause-offscreen
            className={`mt-30 mb-20 ${isMobile ? "px-3 py-4" : ""}`}
          >
            <SectionTitle
              title="Proyectos"
              icon={<IoCodeWorkingOutline className="fx-icon fx-stretch" />}
            />
            <div className="cardsContainer grid w-full grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
              {proyects.map((proyect, index) => (
                <div key={proyect.name + index} className="relative">
                  <ProyectCard
                    name={proyect.name}
                    image={proyect.image}
                    description={proyect.description}
                    technologies={proyect.technologies}
                    state={proyect.state}
                    url={proyect.url}
                    gitHub={proyect.gitHub}
                  />
                </div>
              ))}
            </div>
          </section>
          <section
            id="about"
            data-pause-offscreen
            className={`mt-30 mb-20 ${isMobile ? "p-4" : ""}`}
          >
            <SectionTitle
              title="Sobre mí"
              icon={
                <IoIosInformationCircleOutline className="fx-icon fx-swing" />
              }
            />

            <div
              className={`flex flex-col items-center justify-between gap-8 md:flex-row`}
            >
              <div
                className={`text-balance [&>p]:mb-4 ${isMobile ? "order-2" : ""}`}
              >
                <p className="anim-about-text">
                  ¡Hola de nuevo! 👋 Soy Carlos Benítez,{" "}
                  <ShinyText text="desarrollador web" /> con formación en{" "}
                  <ShinyText text="Ingeniería de Sistemas y Computación." /> Me
                  centro en construir{" "}
                  <ShinyText text="aplicaciones web modernas" /> que combinan un{" "}
                  <ShinyText text="diseño cuidado" /> con una{" "}
                  <ShinyText text="arquitectura sólida." />
                </p>
                <p className="anim-about-text">
                  Mi experiencia abarca desde el desarrollo de{" "}
                  <ShinyText
                    text="interfaces
                  dinámicas"
                  />{" "}
                  con{" "}
                  <TechnologyLabel
                    name={technologies[0].name}
                    icon={technologies[0].icon}
                    color={technologies[0].color}
                    url={technologies[0].url}
                    fitContent={true}
                  />{" "}
                  /{" "}
                  <TechnologyLabel
                    name={technologies[1].name}
                    icon={technologies[1].icon}
                    color={technologies[1].color}
                    url={technologies[1].url}
                    fitContent={true}
                  />{" "}
                  hasta la construcción de APIs eficientes con{" "}
                  <TechnologyLabel
                    name={technologies[10].name}
                    icon={technologies[10].icon}
                    color={technologies[10].color}
                    url={technologies[10].url}
                    fitContent={true}
                  />{" "}
                  /{" "}
                  <span className="whitespace-nowrap">
                    <TechnologyLabel
                      name={technologies[11].name}
                      icon={technologies[11].icon}
                      color={technologies[11].color}
                      url={technologies[11].url}
                      fitContent={true}
                    />
                    .
                  </span>{" "}
                  Me interesa especialmente la integración entre{" "}
                  <ShinyText text="frontend" /> y <ShinyText text="backend" />{" "}
                  para ofrecer experiencias fluidas.
                </p>
                <p className="anim-about-text">
                  Hoy gran parte de mi trabajo es{" "}
                  <ShinyText text="desarrollo agéntico:" /> programo junto a{" "}
                  <ShinyText text="agentes de IA" /> y elijo la herramienta
                  adecuada para cada tarea. Con{" "}
                  <ShinyText text="harness engineering" /> les doy el{" "}
                  <ShinyText text="contexto adecuado" /> (reglas, memoria y
                  skills), los conecto a herramientas con{" "}
                  <ShinyText text="MCP" /> y verifico cada cambio con{" "}
                  <ShinyText text="tests automáticos." /> Así optimicé este
                  portafolio, que hoy cuenta con más de 150 tests.
                </p>
                <div className="anim-about-text space-y-3">
                  <p className="font-medium">Logros destacados</p>
                  <ul className="list-none space-y-2">
                    <li className="anim-achievement-text fx-trigger flex items-start">
                      <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
                      <span>
                        Motor de cálculo y validación de{" "}
                        <ShinyText text="créditos automotrices," /> con análisis
                        de riesgo apoyado en IA
                      </span>
                    </li>
                    <li className="anim-achievement-text fx-trigger flex items-start">
                      <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
                      <span>
                        <ShinyText text="E-commerce con subastas en tiempo real:" />{" "}
                        ofertas concurrentes, cierres automáticos y checkout con
                        geolocalización
                      </span>
                    </li>
                    <li className="anim-achievement-text fx-trigger flex items-start">
                      <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
                      <span>
                        <ShinyText text="Automatización" /> de facturas y
                        liquidaciones con Python, eliminando procesos manuales
                      </span>
                    </li>
                    <li className="anim-achievement-text fx-trigger flex items-start">
                      <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
                      <span>
                        Conversión automática de imágenes a WebP y carga en{" "}
                        <ShinyText text="AWS S3" /> para acelerar la carga del
                        sitio
                      </span>
                    </li>
                    <li className="anim-achievement-text fx-trigger flex items-start">
                      <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
                      <span>
                        <ShinyText text="Desarrollo agéntico" /> con distintos
                        agentes de IA, apoyado en MCP, subagentes y skills a
                        medida
                      </span>
                    </li>
                    <li className="anim-achievement-text fx-trigger flex items-start">
                      <FaCheck className="fx-icon fx-check mt-1 mr-2 text-cbpviolet-500" />
                      <span>
                        <ShinyText text="Tutor de desarrollo web" /> en la UNAB:
                        JavaScript, C#, HTML/CSS y MySQL
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className={`proyect-card-anim shrink-0 ${isMobile ? "order-1 mx-auto w-full max-w-xs" : "w-64 lg:w-72"}`}
              >
                <HoloPhotoCard className="rotate-3" />
              </div>
            </div>
          </section>
          <section
            id="technologies"
            ref={technologiesRef}
            data-pause-offscreen
            className={`relative mt-30 mb-20 ${isMobile ? "p-4" : ""}`}
          >
            <div className="dot-technologies absolute flex items-center justify-center will-change-transform">
              <BgDotGradient
                size="2xl"
                colors={["accent", "violet"]}
                blur="6xl"
                position={{ left: 100, top: 100 }}
              />
            </div>
            <div className="dot-technologies absolute flex items-center justify-center will-change-transform">
              <BgDotGradient
                size="3xl"
                colors={["black", "pink"]}
                blur="6xl"
                position={{ left: 600, top: 200 }}
              />
            </div>
            <div className="dot-technologies absolute flex items-center justify-center will-change-transform">
              <BgDotGradient
                size="5xl"
                colors={["accent", "blue"]}
                blur="6xl"
                position={{ left: 300, top: 400 }}
              />
            </div>
            <div className="dot-technologies absolute flex items-center justify-center will-change-transform">
              <BgDotGradient
                size="xl"
                colors={["yellow", "green"]}
                blur="6xl"
                position={{ left: 100, top: 450 }}
              />
            </div>

            <SectionTitle
              title="Tecnologías"
              icon={<IoCodeSlashOutline className="fx-icon fx-glitch" />}
            />
            <div
              className={`grid ${isMobile ? "" : "grid-cols-3 grid-rows-2"} w-full gap-4`}
            >
              {Object.entries(technologiesSectionData).map(([key, value]) => {
                return (
                  <TechnologiesContainer
                    key={key}
                    title={key}
                    technologies={value}
                  />
                );
              })}
            </div>
          </section>
          <AISection />
          <section
            id="contact"
            data-pause-offscreen
            className={`mt-30 mb-20 ${isMobile ? "p-4" : ""}`}
          >
            <SectionTitle
              title="Contáctame"
              icon={
                <MdOutlineConnectWithoutContact className="fx-icon fx-ring" />
              }
            />
            <ContactContainer />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
