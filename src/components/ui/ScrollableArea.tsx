import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export function ScrollableArea({ className = "", children }: Props) {
  return (
    <div
      className={`flex-1 overflow-y-auto overscroll-y-contain scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
}
