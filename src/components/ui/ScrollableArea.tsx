"use client";

import { forwardRef } from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
};

export const ScrollableArea = forwardRef<HTMLDivElement, Props>(
    ({ children, className }, ref) => {
        return (
            <div
                ref={ref}
                className={`overflow-y-auto flex-1 min-h-0 scrollbar-hide ${className}`}
            >
                {children}
            </div>
        );
    }
);

ScrollableArea.displayName = "ScrollableArea";
