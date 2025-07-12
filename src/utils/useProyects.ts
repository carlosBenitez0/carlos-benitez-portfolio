export const useProyects = () => {
  const proyectsList = [
    {
      name: "IBG Arcade",
      image:
        "https://res.cloudinary.com/dc69f3e0o/image/upload/v1751660477/ibgarcade_yywgwl.webp",
      description:
        "Sitio web cristiano con 3 juegos, el clasico XO y 2 juegos de preguntas.",
      technologies: ["React", "CSS", "TypeScript", "Motion", "bolt.new"],
      state: "Terminado",
      url: "https://ibg-arcade.vercel.app/",
      gitHub: "https://github.com/carlosBenitez0/IBGArcade",
    },
    {
      name: "TechZone",
      image:
        "https://res.cloudinary.com/dc69f3e0o/image/upload/v1751660476/techzone_rxdiy0.webp",
      description:
        "E-commerce de tecnología con un diseño moderno y con panel de administración.",
      technologies: ["Next.js", "CSS", "GSAP", "TypeScript", "Zustand"],
      state: "En desarrollo",
      url: "https://techzone-zeta.vercel.app/",
      gitHub: "https://github.com/carlosBenitez0/techzone",
    },
    {
      name: "Pokédex",
      image:
        "https://res.cloudinary.com/dc69f3e0o/image/upload/v1751662453/352_1x_shots_so_clxxz8.png",
      description: "Aplicación de Pokédex, utilizando la API de Pokeapi.",
      technologies: ["React", "Tailwind CSS", "TypeScript", "Axios", "Pokeapi"],
      state: "En desarrollo",
      url: "https://pok-dex-yx1k.vercel.app/",
      gitHub: "https://github.com/carlosBenitez0/pok-dex",
    },
    {
      name: "To-Do con Firebase",
      image:
        "https://res.cloudinary.com/dc69f3e0o/image/upload/v1751730507/to-do-firebase_o2u85j.webp",
      description:
        "Aplicación de To-Do con estilo de neumorphism y Firebase, para gestionar tareas.",
      technologies: [
        "React",
        "Tailwind CSS",
        "TypeScript",
        "Motion",
        "Firebase",
      ],
      state: "Terminado",
      url: "https://to-do-react-firebase-ten.vercel.app/",
      gitHub: "https://github.com/carlosBenitez0/to-do-react-firebase",
    },
    {
      name: "Clon de YouTube",
      image:
        "https://res.cloudinary.com/dc69f3e0o/image/upload/v1751649922/youtube_asp8lp.webp",
      description:
        "Clon de la página de inicio de YouTube (responsive pendiente).",
      technologies: ["HTML", "CSS"],
      state: "En desarrollo",
      url: "https://clon-yt-one.vercel.app/",
      gitHub: "https://github.com/carlosBenitez0/clon-yt",
    },
  ];
  return proyectsList;
};
