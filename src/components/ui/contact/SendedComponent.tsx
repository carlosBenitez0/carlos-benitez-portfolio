import { FaCheckCircle } from "react-icons/fa";

interface SendedComponentProps {
  message: string;
}

export const SendedComponent = ({ message }: SendedComponentProps) => {
  return (
    <div className="flex shadow-none items-center gap-2 w-fit py-2 px-4 border border-green-500/50 bg-green-500/15 rounded-full text-sm text-green-500/70">
      <FaCheckCircle />
      <p>{message}</p>
    </div>
  );
};
