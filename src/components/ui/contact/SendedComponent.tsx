import { FaCheckCircle } from "react-icons/fa";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface SendedComponentProps {
  message: string;
}

export const SendedComponent = ({ message }: SendedComponentProps) => {
  const { isMobile } = useIsMobile();

  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/15 px-4 py-2 text-sm text-nowrap text-green-500/70 shadow-none ${isMobile ? "w-full" : ""}`}
    >
      <FaCheckCircle className="min-h-[14px] min-w-[14px]" />
      <p>{message}</p>
    </div>
  );
};
