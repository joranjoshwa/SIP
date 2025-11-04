"use client";

import { useState } from "react";
import { categories, CategoryKey } from "@/src/constants/categories";

type CategoryItemProps = {
    handleCategorySelection: (category: CategoryKey | null) => void;
    onSelect?: (key: CategoryKey | null) => void;
};

export const CategoryItem = ({ onSelect, handleCategorySelection }: CategoryItemProps) => {
    const [activeCat, setActiveCat] = useState<CategoryKey | null>(null);

    const activeRing =
        "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900";

    const handleClick = (key: CategoryKey) => {
        const newActive = activeCat === key ? null : key;
        setActiveCat(newActive);
        handleCategorySelection(newActive);
        onSelect?.(newActive);
    };

    return (
        <div className="relative">
            <ul
                className={[
                    "mt-0 md:mt-4 flex gap-3 py-1 px-4 text-sm",
                    "overflow-x-auto flex-nowrap snap-x snap-mandatory",
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
                    "md:flex-wrap md:overflow-visible md:snap-none",
                ].join(" ")}
                aria-label="Categories"
            >
                {categories.map(({ key, label, Icon, bg, bgDark, ring }) => {
                    const isActive = activeCat === key;

                    return (
                        <li
                            className="shrink-0 snap-start flex flex-col items-center text-center md:flex-1"
                            key={key}
                        >
                            <button
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => handleClick(key)}
                                className={[
                                    `${bg} ${bgDark} text-black dark:text-white`,
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition",
                                    "md:rounded-2xl md:px-4 md:py-2 md:text-sm md:font-medium md:w-full",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                    isActive ? `${activeRing} ${ring}` : "",
                                ].join(" ")}
                            >
                                <span className="grid h-6 w-full place-items-center rounded-lg">
                                    <Icon
                                        className={`h-6 w-6 md:h-7 md:w-7 ${isActive
                                                ? "text-black dark:text-white"
                                                : "text-gray-800 dark:text-neutral-200"
                                            }`}
                                    />
                                </span>
                            </button>
                            <span className="leading-none text-[10px] md:text-sm">{label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
