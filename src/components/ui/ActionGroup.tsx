"use client";

import * as React from "react";

type Props = {
    title?: string;
    children: React.ReactNode;
    className?: string;
};

export function ActionGroup({ title, children, className }: Props) {
    return (
        <section className={cn("w-full", className)}>
            {title ? (
                <h3 className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {title}
                </h3>
            ) : null}

            <div className="rounded-2xl p-2">
                <div className="flex flex-col gap-2">{children}</div>
            </div>
        </section>
    );
}

export function cn(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(" ");
}
