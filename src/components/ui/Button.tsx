import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    variant?: "primary" | "secondary" | "tertiary";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    disabled?: boolean;
    type?: "submit" | "button";
};

export const Button = ({
    children,
    variant = "primary",
    onClick,
    className = "",
    disabled = false,
    type = "button",
}: Props) => {
    const baseStyle =
        "w-full py-3 min-h-[48px] rounded-xl font-medium text-sm transition-colors";

    const variants = {
        primary: "bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white",
        secondary:
            "text-gray border hover:bg-gray-200 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700",
        tertiary:
            "text-gray hover:bg-gray-200 dark:text-white hover:dark:bg-gray-700",
    } as const;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
