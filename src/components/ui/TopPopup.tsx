type PopupVariant = "success" | "error" | "warning" | "info";

type Props = {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    variant?: PopupVariant;
}

const variantStyles = {
    success: {
        container: "bg-[#D4EED9] text-[#1B1B1B]",
    },
    error: {
        container: "bg-[#FDE2E2] text-[#7A1C1C]",
    },
    warning: {
        container: "bg-[#FFF4CC] text-[#7A5A00]",
    },
    info: {
        container: "bg-[#E0ECFF] text-[#1E3A8A]",
    },
};

export const TopPopup = ({ message, isOpen, onClose, variant = 'success' }: Props) => {

    const styles = variantStyles[variant];

    if (!isOpen) return null;

    return (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-96">
            <div className={`p-4 rounded-lg shadow-md flex justify-between items-center ${styles.container}`}>
                <p className="text-sm sm:text-base">{message}</p>

                <button
                    onClick={onClose}
                    className="ml-4 font-bold text-[#1B1B1B] hover:opacity-70 transition"
                >x</button>
            </div>
        </div>
    );
}