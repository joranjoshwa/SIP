import { ReactNode, useEffect, useId, useRef, useState } from "react";

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
    onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    accept?: string;
    name?: string;
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
    onPressEnter,
    accept,
    name,
}: Props) => {
    const [isMozilla, setIsMozilla] = useState(false);
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);

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
                role={type === "file" ? "button" : undefined}
                tabIndex={type === "file" ? 0 : undefined}
                aria-disabled={disabled}
                className={`flex items-center rounded-xl px-4 py-3 bg-[#ECECEC]
                    outline outline-2 outline-transparent outline-offset-2
                    focus-within:outline-[#3E9F50]
                    dark:bg-[#292929]
                    ${type === "file" ? "cursor-pointer" : ""}`}

                onClick={() => {
                    if (type === "file" && !disabled) {
                        inputRef.current?.click();
                    }
                }}
            >
                {!(isMozilla && type === "date") && icon && (
                    <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>
                )}

                <input
                    name={name}
                    ref={inputRef}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    {...(type !== "file" && { value })}
                    onChange={onChange}
                    accept={accept}
                    className={`flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-[#ECECEC]
                                dark:text-gray-100 dark:placeholder-gray-500 dark:bg-[#292929] custom-date-input
                                ${type === "file" ? "sr-only" : ""}
                                disabled:opacity-60 disabled:cursor-not-allowed`}
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