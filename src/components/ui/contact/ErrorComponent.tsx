interface ErrorComponentProps {
  icon: React.ReactNode;
  error: string;
  id?: string;
}

export const ErrorComponent = ({ error, icon, id }: ErrorComponentProps) => {
  return (
    <div
      id={id}
      role="alert"
      className="flex w-fit items-center gap-2 rounded-full border border-red-500/50 bg-red-500/15 px-4 py-2 text-sm text-red-500/70 shadow-none"
    >
      {icon}
      <p>{error}</p>
    </div>
  );
};
