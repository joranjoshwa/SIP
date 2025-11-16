import { ReactNode, useEffect, useId, useState } from "react";

type Props = {
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: ReactNode;
    children?: ReactNode;
    className?: string;
    required?: boolean;
    autoComplete?: string;
    disabled?: boolean;
    onPressEnter?: (e:  React.KeyboardEvent<HTMLInputElement>) => void;
};

export const InputField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    children,
    className,
    required = false,
    autoComplete,
    disabled,
    onPressEnter
}: Props) => {
    const [isMozilla, setIsMozilla] = useState(false);
    const id = useId();

    useEffect(() => {
        const isFirefox = /firefox/i.test(navigator.userAgent);
        setIsMozilla(isFirefox);
    }, []);

    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                className="flex items-center rounded-xl px-3 py-3 bg-[#ECECEC]
          focus-within:ring-2 focus-within:ring-blue-500
          dark:bg-[#292929] dark:border-gray-700"
            >
                {!(isMozilla && type === "date") && icon && (
                    <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>
                )}

                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-[#ECECEC]
                                dark:text-gray-100 dark:placeholder-gray-500 dark:bg-[#292929] custom-date-input
                                disabled:opacity-60 disabled:cursor-not-allowed"
                    required={required}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    onKeyDown={onPressEnter}
                />

                {children}
            </div>
        </div>
    );
};