type Props = {
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

export const TopPopup = ({ message, isOpen, onClose }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-96">
            <div className="bg-[#D4EED9] text-[#1B1B1B] p-4 rounded-lg shadow-md flex justify-between items-center">
                <p className="text-sm sm:text-base">{message}</p>

                <button
                    onClick={onClose}
                    className="ml-4 font-bold text-[#1B1B1B] hover:opacity-70 transition"
                >x</button>
            </div>
        </div>
    );
}