import { ReactNode } from "react"

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

    const baseStyle = "w-full py-3 rounded-xl font-semibold text-sm transition-colors";

    const variants = {
        primary: "bg-[#D4EED9] text-black",
        secondary: "bg-white text-black border border-[#9C9C9C] hover:bg-gray-200"
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