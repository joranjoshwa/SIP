"use client";

import { Search } from "lucide-react";

export const SearchBar = () => {
    return (
        <div className="flex items-center gap-2 rounded-full bg-[#E4ECDF] px-4 py-3 w-full dark:bg-[#292929]">
            <Search className="w-5 h-5 text-gray-500" />
            <input
                type="text"
                placeholder="Pesquise por um item..."
                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 dark:text-white"
            />
        </div>
    );
};
