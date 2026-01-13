import { useTheme } from "@/src/context/ThemeContext";

type PopupVariant = "success" | "error" | "warning" | "info";

type Props = {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    variant?: PopupVariant;
};

const variantStyles = {
    success: {
        light: "bg-[#D4EED9] text-[#1B1B1B]",
        dark: "bg-[#183E1F] text-[#E6F4EA]",
    },
    error: {
        light: "bg-[#FDE2E2] text-[#7A1C1C]",
        dark: "bg-[#4C1D1D] text-[#FECACA]",
    },
    warning: {
        light: "bg-[#FFF4CC] text-[#7A5A00]",
        dark: "bg-[#4A3B00] text-[#FDE68A]",
    },
    info: {
        light: "bg-[#E0ECFF] text-[#1E3A8A]",
        dark: "bg-[#1E3A8A] text-[#DBEAFE]",
    },
};

export const TopPopup = ({
    message,
    isOpen,
    onClose,
    variant = "success",
}: Props) => {
    const { theme } = useTheme();

    if (!isOpen) return null;

    const mode = theme === "dark" ? "dark" : "light";
    const containerStyle = variantStyles[variant][mode];

    return (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-96">
            <div
                className={`p-4 rounded-lg shadow-md flex justify-between items-center ${containerStyle}`}
            >
                <p className="text-sm sm:text-base">{message}</p>

                <button
                    onClick={onClose}
                    className="ml-4 font-bold opacity-70 hover:opacity-100 transition"
                    aria-label="Fechar"
                >
                    ×
                </button>
            </div>
        </div>
    );
};
