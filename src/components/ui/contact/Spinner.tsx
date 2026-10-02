export const Spinner = () => {
  return (
    <div
      className="spinner inline-block h-4 w-4 rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-white"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
        Enviando…
      </span>
    </div>
  );
};
