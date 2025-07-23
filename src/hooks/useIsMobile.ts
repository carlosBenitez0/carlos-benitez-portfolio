import { useState, useEffect } from "react";

export const useIsMobile = () => {
  //Verificar si la app se abre en mobile
  const [isMobile, setIsMobile] = useState(false);
  const [viewSize, setViewSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewSize(width);

      if (width < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile, viewSize };
};
