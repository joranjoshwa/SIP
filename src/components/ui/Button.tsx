import { ReactNode } from "react"
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

    const { theme } = useTheme();

    const baseStyle = "w-full py-3 rounded-xl font-normal text-sm transition-colors";

    const variants = {
        primary: theme === "light" 
            ? "bg-[#D4EED9] text-black" 
            : "bg-[#183E1F] text-white",
        secondary: theme === "light" 
            ? "bg-white text-black border border-[#9C9C9C] hover:bg-gray-200"
            : "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
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