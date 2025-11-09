import { useState, forwardRef, useImperativeHandle } from "react";

export type SquareToggleRef = {
    reset: () => void;
};

type Props = {
    label?: string;
    initialValue?: boolean;
    onChange: (enabled: boolean) => void;
};

export const SquareToggle = forwardRef<SquareToggleRef, Props>(
    ({ label, initialValue = false, onChange }, ref) => {
        const [enabled, setEnabled] = useState(initialValue);

        const toggle = () => {
            const newValue = !enabled;
            setEnabled(newValue);
            onChange(newValue);
        };

        useImperativeHandle(ref, () => ({
            reset: () => {
                setEnabled(initialValue);
                onChange(initialValue);
            },
        }));

        return (
            <div className="flex items-center justify-between">
                {label && <span className="text-sm">{label}</span>}
                <button
                    type="button"
                    onClick={toggle}
                    className={`w-12 h-6 flex items-center rounded-2xl transition ${enabled
                            ? "bg-[#D4EED9] dark:bg-[#183E1F]"
                            : "bg-[#ECECEC] dark:bg-[#292929]"
                        }`}
                >
                    <div
                        className={`w-5 h-5 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm transform transition ${enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>
        );
    }
);

SquareToggle.displayName = "SquareToggle";
