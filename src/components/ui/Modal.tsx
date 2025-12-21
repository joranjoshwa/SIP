import { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        className="
          relative z-10 w-full max-w-md
          rounded-2xl
          bg-white dark:bg-zinc-900
          p-6
          shadow-xl
        "
      >
        {children}
      </div>
    </div>
  );
}
