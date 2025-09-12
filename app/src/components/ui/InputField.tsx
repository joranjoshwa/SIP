import { ReactNode } from "react";

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
}

export const InputField = ({
    label, 
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    children,
    className,
    required = false
}: Props) => {

    return(
        <div className={`flex flex-col w-full ${className}`}>
            {label && (
                <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            <div className="flex items-center border rounded-xl px-3 py-2 bg-[#ECECEC] 
                focus-within:ring-2 focus-within:ring-blue-500
                dark:bg-gray-800 dark:border-gray-700">

                {icon && <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>}

                <input 
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-[#ECECEC]
                            dark:text-gray-100 dark:placeholder-gray-500 dark:bg-gray-800"
                    required={required}
                />

                

                {children}
            </div>
        </div>
    );
}