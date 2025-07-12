import "./App.css";
import { Footer } from "./components/shared/Footer";
import { Header } from "./components/shared/Header";
import { Navbar } from "./components/shared/Navbar/Navbar";
import { ProyectCard } from "./components/ui/proyects/ProyectCard";
import { SectionTitle } from "./components/ui/SectionTitle";
import { useProyects } from "./utils/useProyects";
import { IoCodeWorkingOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCodeSlashOutline } from "react-icons/io5";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function App() {
  /*useEffect(() => {
    // Animación para las cards
     gsap.utils.toArray(".proyectCard").forEach((card: any) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%", // Inicia cuando el top del card está al 80% del viewport
          end: "bottom 20%",
          toggleActions: "play none none none", // Solo se reproduce una vez
        },
      });
    });

    // Animación para los títulos (sin ScrollTrigger para probar)
    gsap.from(".section-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
    });
  }, []); */

  const proyects = useProyects();
  return (
    <div className="font-poppins bg-cbpbg-900 relative z-40 h-screen w-screen overflow-x-hidden">
      <div
        className="absolute top-0 h-[70vh] w-full rounded-b-full mx-auto
        bg-gradient-to-b from-cbpviolet-500/20 to-cbpviolet-900/10 blur-3xl"
      ></div>
      <div className="mx-auto h-full w-full text-white max-w-5xl">
        <Navbar />

        <Header />
        <main>
          <section className="mb-16">
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
          <section className="mb-16">
            <SectionTitle
              title="Sobre mí"
              icon={<IoIosInformationCircleOutline />}
            />
            <div></div>
          </section>
          <section className="mb-16">
            <SectionTitle title="Tecnologías" icon={<IoCodeSlashOutline />} />
            <div></div>
          </section>
          <section className="mb-16">
            <SectionTitle
              title="Contáctame"
              icon={<MdOutlineConnectWithoutContact />}
            />
            <div></div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
