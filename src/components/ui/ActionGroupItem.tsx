"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BaseProps = {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    disabled?: boolean;
    danger?: boolean;
    rightSlot?: React.ReactNode;
    className?: string;
    showChevron?: boolean;
    onClick?: () => void;
};

type LinkProps = BaseProps & { href: string; onClick?: never };
type ButtonProps = BaseProps & { href?: never; onClick: () => void };

export type ActionGroupItemProps = LinkProps | ButtonProps;

export function ActionGroupItem(props: ActionGroupItemProps) {
    const {
        icon,
        title,
        description,
        disabled,
        danger,
        rightSlot,
        className,
        showChevron = true,
    } = props;

    const base =
        "w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors " +
        "bg-neutral-100/80 dark:bg-[#262626] active:scale-[0.99]";

    const disabledStyle = disabled
        ? "opacity-50 pointer-events-none"
        : "";

    const content = (
        <>
            {icon ? (
                <div
                    className={cn(
                        "shrink-0 w-9 h-9 rounded-xl grid place-items-center",
                    )}
                >
                    <span className={cn("text-neutral-700 dark:text-neutral-200")}>
                        {icon}
                    </span>
                </div>
            ) : null}

            <div className="min-w-0 flex-1 text-left">
                <div className="text-[14px] font-semibold truncate">{title}</div>
                {description ? (
                    <div className="text-[12px] text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                        {description}
                    </div>
                ) : null}
            </div>

            {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}

            {showChevron ? (
                <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
            ) : null}
        </>
    );

    if ("href" in props) {
        return (
            <Link
                href={disabled ? "#" : props.href as string}
                aria-disabled={disabled || undefined}
                className={cn(base, disabledStyle, className)}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={disabled ? undefined : props.onClick}
            disabled={disabled}
            className={cn(base, disabledStyle, className)}
        >
            {content}
        </button>
    );
}

export function cn(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(" ");
}