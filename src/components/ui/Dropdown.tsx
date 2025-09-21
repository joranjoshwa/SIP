import { ReactNode, useState } from "react";

type Option = {
    value: string;
    label: string;
};

type Props = {
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    icon?: ReactNode;
    options: Option[]; // Accept options as a prop
    children?: ReactNode;
    className?: string;
    required?: boolean;
};

export const Dropdown = ({
    label,
    value,
    onChange,
    icon,
    options,
    children,
    className,
    required = false,
}: Props) => {
    return (
        <div className={`flex flex-col w-full mt-3 ${className}`}>
            {label && (
                <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            <div className="flex items-center rounded-xl px-3 py-3 bg-[#ECECEC] dark:bg-[#292929] dark:border-gray-700 transition-all ease-in-out duration-300 hover:shadow-lg">
                {icon && (
                    <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>
                )}

                <select
                    value={value}
                    onChange={onChange}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-[#ECECEC] dark:text-gray-100 dark:placeholder-gray-500 dark:bg-[#292929] rounded-md transition-all ease-in-out duration-300"
                    required={required}
                >
                    <option value="" disabled>
                        Selecione uma das opções
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {children}
            </div>
        </div>
    );
};
