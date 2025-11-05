import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

type Props = {
    children: ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
    className?: string;
};

export const Button = ({
    children,
    variant = "primary",
    onClick,
    className
}: Props) => {

    const baseStyle = "w-full py-3 min-h-[48px] rounded-xl font-medium text-sm transition-colors";

    const variants = {
        primary: "bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white",
        secondary: "text-gray border hover:bg-gray-200 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
