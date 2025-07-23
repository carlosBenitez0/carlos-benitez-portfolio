import "./App.css";
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
import { useEffect } from "react";
import gsap from "gsap";
import { useIsMobile } from "./hooks/useIsMobile";

function App() {
  const proyects = useProyects();
  const technologies = useTechnologies();
  const { isMobile, viewSize } = useIsMobile();
  const maxW = "max-w-[" + (viewSize - 40) + "px]";

  useEffect(() => {
    const dots_technologies = document.querySelectorAll(".dot-technologies");
    const technologiesSection = document.querySelector("section.relative"); // Seleccionamos la sección de tecnologías

    if (!technologiesSection) return;

    const tl = gsap.timeline();

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

    return () => {
      // Limpiar todas las animaciones al desmontar
      tl.kill();
      gsap.killTweensOf(dots_technologies);
    };
  }, []);

  return (
    <div
      className={`font-poppins bg-cbpbg-900 relative z-40 h-screen  overflow-x-hidden ${isMobile ? maxW : "w-full"}`}
    >
      <div
        className="absolute top-0 h-[70vh] w-full rounded-b-full mx-auto
        bg-gradient-to-b from-cbpviolet-500/20 to-cbpviolet-900/10 blur-3xl"
      ></div>
      <div
        id="start"
        className={`mx-auto h-full w-full text-white ${isMobile ? maxW : "max-w-5xl"}`}
      >
        <Navbar />

        <Header />
        <main>
          <section id="projects" className="mb-20 mt-30 p-4">
            <SectionTitle title="Proyectos" icon={<IoCodeWorkingOutline />} />
            <div className="cardsContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
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
            className={`mb-20 mt-30 ${isMobile ? "p-4" : ""}`}
          >
            <SectionTitle
              title="Sobre mí"
              icon={<IoIosInformationCircleOutline />}
            />

            <div
              className={`flex flex-col items-center gap-8 md:flex-row justify-between`}
            >
              <div
                className={`[&>p]:mb-4 text-balance ${isMobile ? "order-2" : ""}`}
              >
                <p className="anim-about-text">
                  ¡Hola de nuevo! 👋 Soy Carlos Benítez,{" "}
                  <ShinyText text="Desarrollador web" /> con formación en{" "}
                  <ShinyText text="Ingeniería de Sistemas y Computación." />{" "}
                  Especializado en crear{" "}
                  <ShinyText text="aplicaciones web modernas" /> que combinen{" "}
                  <ShinyText text="diseño atractivo" /> con{" "}
                  <ShinyText text="arquitecturas sólidas." />
                </p>
                <p className="anim-about-text ">
                  Mi expertise abarca desde el desarrollo de{" "}
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
                  <TechnologyLabel
                    name={technologies[11].name}
                    icon={technologies[11].icon}
                    color={technologies[11].color}
                    url={technologies[11].url}
                    fitContent={true}
                  />
                  . Disfruto especialmente optimizando la interacción entre{" "}
                  <ShinyText text="frontend" /> y <ShinyText text="backend" />{" "}
                  para crear experiencias fluidas.
                </p>
                <div className="space-y-3 anim-about-text">
                  <p className="font-medium">
                    Entre mis logros destacados están:
                  </p>
                  <ul className="list-none space-y-2">
                    <li className="flex items-start anim-achievement-text">
                      <FaCheck className="text-cbpviolet-500 mr-2" />
                      <span>
                        Desarrollo de soluciones full-stack para{" "}
                        <ShinyText text="automatización" /> de procesos
                      </span>
                    </li>
                    <li className="flex items-start anim-achievement-text">
                      <FaCheck className="text-cbpviolet-500 mr-2" />
                      <span>
                        Implementación de interfaces modernas con{" "}
                        <ShinyText text="React" /> y{" "}
                        <ShinyText text="Next.js" />
                      </span>
                    </li>
                    <li className="flex items-start anim-achievement-text">
                      <FaCheck className="text-cbpviolet-500 mr-2" />
                      <span>
                        Creación de APIs eficientes con{" "}
                        <ShinyText text="Python" /> y{" "}
                        <ShinyText text="FastAPI" />
                      </span>
                    </li>

                    <li className="flex items-start anim-achievement-text">
                      <FaCheck className="text-cbpviolet-500 mr-2" />
                      <span>
                        Transferencia de conocimiento técnico mediante{" "}
                        <ShinyText text="mentorías" />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <img
                src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1752513118/320_1x_shots_so_sf9nou.png"
                alt=""
                className={`object-cover w-64 h-full p-1 rotate-3 lg:p-2 lg:w-72 aspect-square rounded-2xl proyect-card-anim ${isMobile ? "order-1 w-3xl" : ""}`}
              />
            </div>
          </section>
          <section
            id="technologies"
            className={`relative mb-20 mt-30 ${isMobile ? "p-4" : ""}`}
          >
            <div className="dot-technologies absolute flex items-center justify-center">
              <BgDotGradient
                size="2xl"
                colors={["accent", "violet"]}
                blur="6xl"
                position={{ left: 100, top: 100 }}
              />
            </div>
            <div className="dot-technologies absolute flex items-center justify-center">
              <BgDotGradient
                size="3xl"
                colors={["black", "pink"]}
                blur="6xl"
                position={{ left: 600, top: 200 }}
              />
            </div>
            <div className="dot-technologies absolute flex items-center justify-center">
              <BgDotGradient
                size="5xl"
                colors={["accent", "blue"]}
                blur="6xl"
                position={{ left: 300, top: 400 }}
              />
            </div>
            <div className="dot-technologies absolute flex items-center justify-center">
              <BgDotGradient
                size="xl"
                colors={["yellow", "green"]}
                blur="6xl"
                position={{ left: 100, top: 450 }}
              />
            </div>

            <SectionTitle title="Tecnologías" icon={<IoCodeSlashOutline />} />
            <div
              className={`grid ${isMobile ? "" : "grid-cols-3 grid-rows-2"} gap-4 w-full`}
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
          <section id="contact" className="mb-20 mt-30 p-4">
            <SectionTitle
              title="Contáctame"
              icon={<MdOutlineConnectWithoutContact />}
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
