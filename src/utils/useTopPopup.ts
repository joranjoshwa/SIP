import { useState } from "react";

type PopupVariant = "success" | "error" | "warning" | "info";

type PopupState = {
    open: boolean;
    message: string;
    variant: PopupVariant;
};

export function useTopPopup(autoCloseMs = 3000) {
    const [popup, setPopup] = useState<PopupState>({
        open: false,
        message: "",
        variant: "success",
    });

    const openPopup = (
        message: string,
        variant: PopupVariant = "success"
    ) => {
        setPopup({ open: true, message, variant });

        if (autoCloseMs > 0) {
            setTimeout(() => {
                setPopup((prev) => ({ ...prev, open: false }));
            }, autoCloseMs);
        }
    };

    const closePopup = () => {
        setPopup((prev) => ({ ...prev, open: false }));
    };

    return {
        popup,
        openPopup,
        closePopup,
    };
}
