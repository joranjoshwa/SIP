import { ReactNode } from "react";

type Props = {
    className?: string;
    children: ReactNode;
};

export function ScrollableArea({ className = "", children }: Props) {
    return (
        <div className={`flex-1 min-h-0 overflow-y-auto overscroll-y-contain ${className}`}>
            {children}
        </div>
    );
}
