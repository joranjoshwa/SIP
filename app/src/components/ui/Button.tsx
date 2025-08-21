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
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200"
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