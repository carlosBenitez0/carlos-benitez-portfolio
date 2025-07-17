interface ErrorComponentProps {
  icon: React.ReactNode;
  error: string;
}

export const ErrorComponent = ({ error, icon }: ErrorComponentProps) => {
  return (
    <div className="flex shadow-none items-center gap-2 w-fit py-2 px-4 border border-red-500/50 bg-red-500/15 rounded-full text-sm text-red-500/70">
      {icon}
      <p>{error}</p>
    </div>
  );
};
