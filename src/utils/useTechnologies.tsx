import { SiAxios, SiNextdotjs } from "react-icons/si";
import { FaHtml5, FaReact } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { SiJavascript } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { SiFastapi } from "react-icons/si";
import { SiMysql } from "react-icons/si";
import { SiFirebase } from "react-icons/si";

export interface Technology {
  name: string;
  icon: React.ReactNode;
  color: string;
  url: string;
}

export const useTechnologies = () => {
  const technologiesList: Technology[] = [
    {
      name: "React",
      icon: <FaReact />,
      color: "#6FE6FD",
      url: "https://reactjs.org/",
    },
    {
      name: "Next.js",
      icon: <SiNextdotjs />,
      color: "#BBBBBB",
      url: "https://nextjs.org/",
    },
    {
      name: "HTML",
      icon: <FaHtml5 />,
      color: "#E34F26",
      url: "https://html.com/",
    },
    {
      name: "CSS",
      icon: <FaCss3 />,
      color: "#4FA6FF",
      url: "https://developer.mozilla.org/es/docs/Web/CSS",
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss />,
      color: "#3CDDF4",
      url: "https://tailwindcss.com/",
    },
    {
      name: "JavaScript",
      icon: <SiJavascript />,
      color: "#FFF042",
      url: "https://javascript.com/",
    },
    {
      name: "TypeScript",
      icon: <SiTypescript />,
      color: "#4F9FEA",
      url: "https://typescriptlang.org/",
    },
    {
      name: "Zustand",
      icon: (
        <img
          src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751564282/zustand-logo-removebg-preview_bbzpat.png"
          alt="zustand"
          className="w-[17px] h-[17px] "
        />
      ),
      color: "#E6B97A",
      url: "https://zustand-demo.pmnd.rs/",
    },
    {
      name: "Motion",
      icon: (
        <img
          src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751562961/logo-motion_lelpra.png"
          alt="motion"
          className="w-[17px] h-[9px]"
        />
      ),
      color: "#FFF42B",
      url: "https://motion.dev/",
    },
    {
      name: "GSAP",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 82 30"
        >
          <path
            fill="#0ae448"
            d="M23.81 14.013v.013l-1.075 4.665c-.058.264-.322.458-.626.458H20.81a.218.218 0 0 0-.208.155c-1.198 4.064-2.82 6.858-4.962 8.535-1.822 1.428-4.068 2.093-7.069 2.093-2.696 0-4.514-.867-6.056-2.578C.478 25.09-.364 21.388.146 16.926 1.065 8.549 5.41.096 13.776.096c2.545-.023 4.543.762 5.933 2.33 1.47 1.657 2.216 4.154 2.22 7.421a.55.55 0 0 1-.549.536h-6.13a.42.42 0 0 1-.407-.41c-.05-2.259-.72-3.36-2.052-3.36-2.35 0-3.736 3.19-4.471 4.959-1.027 2.47-1.55 5.152-1.447 7.824.049 1.244.249 2.994 1.43 3.718 1.047.643 2.541.217 3.446-.495.904-.711 1.632-1.942 1.938-3.065.043-.156.046-.277.005-.332-.043-.055-.162-.068-.253-.068h-1.574a.572.572 0 0 1-.438-.202.42.42 0 0 1-.087-.362l1.076-4.674c.053-.24.27-.42.537-.453v-.011h10.33c.024 0 .049 0 .072.005.268.034.457.284.452.556h.002Z"
          />
          <path
            fill="#0ae448"
            d="M41.594 8.65a.548.548 0 0 1-.548.531H35.4c-.37 0-.679-.3-.679-.665 0-1.648-.57-2.45-1.736-2.45s-1.918.717-1.94 1.968c-.025 1.395.764 2.662 3.01 4.84 2.957 2.774 4.142 5.232 4.085 8.48C38.047 26.605 34.476 30 29.042 30c-2.775 0-4.895-.743-6.305-2.207-1.431-1.486-2.087-3.668-1.95-6.485a.548.548 0 0 1 .549-.53h5.84a.55.55 0 0 1 .422.209.48.48 0 0 1 .106.384c-.065 1.016.112 1.775.512 2.195.256.272.613.41 1.058.41 1.079 0 1.711-.763 1.735-2.09.02-1.148-.343-2.155-2.321-4.19-2.555-2.496-4.846-5.075-4.775-9.13.042-2.351.976-4.502 2.631-6.056C28.294.868 30.687 0 33.465 0c2.783.02 4.892.813 6.269 2.359 1.304 1.466 1.932 3.582 1.862 6.29h-.002Z"
          />
          <path
            fill="#0ae448"
            d="m59.096 29.012.037-27.932a.525.525 0 0 0-.529-.533h-8.738c-.294 0-.423.252-.507.42L36.707 28.842v.005l-.005.006c-.14.343.126.71.497.71h6.108c.33 0 .548-.1.656-.308l1.213-2.915c.149-.388.177-.424.601-.424h5.836c.406 0 .415.008.408.405l-.131 2.71a.525.525 0 0 0 .529.532h6.17a.522.522 0 0 0 .403-.182.458.458 0 0 0 .104-.369Zm-10.81-9.326c-.057 0-.102-.001-.138-.005a.146.146 0 0 1-.13-.183c.012-.041.029-.095.053-.163l4.377-10.827c.038-.107.086-.212.136-.314.071-.145.157-.155.184-.047.023.09-.502 11.118-.502 11.118-.041.413-.06.43-.467.464l-3.509-.041h-.008l.003-.002Z"
          />
          <path
            fill="#0ae448"
            d="M71.545.547h-4.639c-.245 0-.52.13-.585.422l-6.455 28.029a.423.423 0 0 0 .088.364.572.572 0 0 0 .437.202h5.798c.311 0 .525-.153.583-.418 0 0 .703-3.168.704-3.178.05-.247-.036-.439-.258-.555-.105-.054-.209-.108-.312-.163l-1.005-.522-1-.522-.387-.201a.186.186 0 0 1-.102-.17.199.199 0 0 1 .198-.194l3.178.014c.95.005 1.901-.062 2.836-.234 6.58-1.215 10.95-6.485 11.076-13.656.107-6.12-3.309-9.221-10.15-9.221l-.005.003Zm-1.579 16.68h-.124c-.278 0-.328-.03-.337-.04-.004-.007 1.833-8.073 1.834-8.084.047-.233.045-.367-.099-.446-.184-.102-2.866-1.516-2.866-1.516a.188.188 0 0 1-.101-.172.197.197 0 0 1 .197-.192h4.241c1.32.04 2.056 1.221 2.021 3.237-.061 3.492-1.721 7.09-4.766 7.214Z"
          />
        </svg>
      ),
      color: "#00FF88",
      url: "https://greensock.com/",
    },
    {
      name: "Python",
      icon: <FaPython />,
      color: "#6FA8E3",
      url: "https://python.org/",
    },
    {
      name: "FastAPI",
      icon: <SiFastapi />,
      color: "#4CD4BE",
      url: "https://fastapi.tiangolo.com/",
    },
    {
      name: "MySQL",
      icon: <SiMysql />,
      color: "#79C6F0",
      url: "https://www.mysql.com/",
    },
    {
      name: "Firebase",
      icon: <SiFirebase />,
      color: "#FFE452",
      url: "https://firebase.google.com/",
    },
    {
      name: "Axios",
      icon: <SiAxios />,
      color: "#671ddf",
      url: "https://axios-http.com/",
    },
    {
      name: "Pokeapi",
      icon: (
        <img
          src="https://res.cloudinary.com/dc69f3e0o/image/upload/v1751661655/pokeapi-logo_gcsoac.webp"
          alt="pokeapi"
          className="w-[17px] h-[9px]"
        />
      ),
      color: "#EaE452",
      url: "https://pokeapi.co/",
    },
  ];

  return technologiesList;
};
