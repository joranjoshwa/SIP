"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Props = {
    icon: LucideIcon;
    text: string;
    href?: string;
    exact?: boolean;
    onClick?: () => void;
    className?: string;
    isMobile?: boolean;
};

export const SideBarItem = ({
    icon: Icon,
    text,
    href,
    onClick,
    className = "",
    exact = false,
    isMobile
}: Props) => {
    const pathname = usePathname();

    const isActive = href
        ? exact
            ? pathname === href
            : href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(href)
        : false;

    const base =
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium";

    const combined = [
        base,
        isMobile ? "p-2" : "px-3 py-2 text-md font-medium",
        isActive ? "text-black" : "text-gray-700",
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white",
        isActive ? "bg-gray-100 dark:bg-neutral-800" : "",
        className,
    ].join(" ");

    if (href) {
        return (
            <li className="list-none">
                <Link href={href} className={combined}>
                    <Icon className={`h-7 w-7 opacity-70 group-hover:opacity-100`} />
                    {!isMobile && <span className="hidden md:block">{text}</span>}
                </Link>
            </li>
        );
    }

    return (
        <li className="list-none">
            <button onClick={onClick} className={combined}>
                <Icon className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                {!isMobile && <span className="hidden md:block">{text}</span>}
            </button>
        </li>
    );
};
