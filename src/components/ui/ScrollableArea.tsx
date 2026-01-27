"use client";

import { forwardRef } from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
};

export const ScrollableArea = forwardRef<HTMLDivElement, Props>(
    ({ children, className, onScroll }, ref) => {
        return (
            <div
                ref={ref}
                onScroll={onScroll}
                className={`overflow-y-auto flex-1 min-h-0 scrollbar-hide ${className ?? ""}`}
            >
                {children}
            </div>
        );
    }
);

ScrollableArea.displayName = "ScrollableArea";
