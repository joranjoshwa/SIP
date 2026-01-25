"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    handleSearch: (itemName: string) => void;
    handleRunSearch: (query: string) => void;
    className?: string,
}

export const SearchBar = ({ handleSearch, className, handleRunSearch }: Props) => {
    const [value, setValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleRunSearch(value);
        }
    };

    const handleIconClick = () => {
        handleSearch(value);
    };

    useEffect(() => {
        handleSearch(value)
    }, [value]);

    return (
        <div className={`flex items-center gap-2 rounded-full bg-[#E4ECDF] px-4 py-3 
                w-full dark:bg-[#292929] outline outline-2 outline-transparent outline-offset-2
                focus-within:outline-[#3E9F50] ${className}`}>
            <Search
                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={handleIconClick}
            />
            <input
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                id="itemName"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleRunSearch(value);
                        (e.currentTarget as HTMLInputElement).blur();
                    }
                }}
                placeholder="Pesquise por um item..."
                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 dark:text-white"
            />
        </div>
    );
};