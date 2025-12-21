import { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        className="
          relative z-10 w-full md:max-w-md
          bg-white dark:bg-zinc-900
          p-6
          rounded-t-2xl md:rounded-2xl
          shadow-xl
          animate-slide-up md:animate-fade-in
        "
      >
        {children}
      </div>
    </div>
  );
}
