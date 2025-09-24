"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { categories, CategoryKey } from "@/src/constants/categories";

export type SearchCategorySelectRef = {
    reset: () => void;
};

type CategoryItemProps = {
    setCategory: (category: CategoryKey[]) => void;
    onSelect?: (keys: CategoryKey[]) => void;
};

export const SearchCategorySelect = forwardRef<
    SearchCategorySelectRef,
    CategoryItemProps
>(({ onSelect, setCategory }, ref) => {
    const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);

    const handleClick = (key: CategoryKey) => {
        const updatedCategories = selectedCategories.includes(key)
            ? selectedCategories.filter((cat) => cat !== key)
            : [...selectedCategories, key];

        setSelectedCategories(updatedCategories);
        setCategory(updatedCategories);
        onSelect?.(updatedCategories);
    };

    useImperativeHandle(ref, () => ({
        reset() {
            setSelectedCategories([]);
            setCategory([]);
            onSelect?.([]);
        },
    }));

    return (
        <div className="relative">
            <ul
                className="mt-0 flex gap-4 py-1 text-sm flex-wrap justify-left"
                aria-label="Categories"
            >
                {categories.map(({ key, label, Icon, bg, bgDark }) => {
                    const isSelected = selectedCategories.includes(key);
                    return (
                        <li
                            className="shrink-0 flex flex-col items-center text-center"
                            key={key}
                        >
                            <button
                                type="button"
                                aria-pressed={isSelected ? "true" : "false"}
                                onClick={() => handleClick(key)}
                                className={[
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition",
                                    isSelected
                                        ? `${bg} ${bgDark} text-black dark:text-white`
                                        : "bg-transparent text-gray-600 dark:text-gray-300",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                ].join(" ")}
                            >
                                <Icon
                                    className={`h-6 w-6 ${isSelected
                                            ? "text-black dark:text-white"
                                            : "text-gray-600 dark:text-gray-300"
                                        }`}
                                />
                            </button>
                            <span className="leading-none text-[10px] md:text-sm">{label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});

SearchCategorySelect.displayName = "SearchCategorySelect";
