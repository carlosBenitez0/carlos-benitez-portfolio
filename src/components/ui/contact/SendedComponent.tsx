import { FaCheckCircle } from "react-icons/fa";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface SendedComponentProps {
  message: string;
}

export const SendedComponent = ({ message }: SendedComponentProps) => {
  const { isMobile } = useIsMobile();

  return (
    <div
      className={`flex shadow-none text-nowrap items-center gap-2 py-2 px-4 border border-green-500/50 bg-green-500/15 rounded-full text-sm text-green-500/70
        ${isMobile ? "w-full" : ""}`}
    >
      <FaCheckCircle className="min-w-[14px] min-h-[14px]" />
      <p>{message}</p>
    </div>
  );
};
