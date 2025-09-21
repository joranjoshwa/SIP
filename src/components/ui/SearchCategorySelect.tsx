"use client";

import {
    CupSoda,
    Shirt,
    Zap,
    Glasses,
    Salad,
    BookMarked,
    NotebookPen,
    SquareUserRound,
    FileQuestionMark,
} from "lucide-react";
import { useState } from "react";

// categories config
const categories = [
    { key: "garrafa", label: "Garrafa", Icon: CupSoda, bg: "bg-rose-100"},
    { key: "roupa", label: "Roupa", Icon: Shirt, bg: "bg-pink-100" },
    { key: "eletronico", label: "Eletrônico", Icon: Zap, bg: "bg-amber-100" },
    { key: "acessorio", label: "Acessório", Icon: Glasses, bg: "bg-emerald-100" },
    { key: "vasilha", label: "Vasilha", Icon: Salad, bg: "bg-green-100" },
    { key: "livro", label: "Livro", Icon: BookMarked, bg: "bg-orange-100" },
    { key: "material", label: "Material", Icon: NotebookPen, bg: "bg-violet-200" },
    { key: "documento", label: "Documento", Icon: SquareUserRound, bg: "bg-fuchsia-100" },
    { key: "outros", label: "Outros", Icon: FileQuestionMark, bg: "bg-gray-100" },
] as const;

type CategoryItemProps = {
    setCategory: (category: string[]) => void;
    onSelect?: (keys: string[]) => void;
};

export const SearchCategorySelect = ({ onSelect, setCategory }: CategoryItemProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const activeRing =
        "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900";

    const handleClick = (key: string) => {
        const updatedCategories = selectedCategories.includes(key)
            ? selectedCategories.filter((cat) => cat !== key)
            : [...selectedCategories, key];

        setSelectedCategories(updatedCategories);
        setCategory(updatedCategories);

        if (onSelect) onSelect(updatedCategories);
    };

    return (
        <div className="relative">
            <ul
                className={[
                    "mt-0 flex gap-4 py-1 text-sm",
                    "flex-wrap justify-left"
                ].join(" ")}
                aria-label="Categories"
            >
                {categories.map(({ key, label, Icon, bg }) => {
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
                                    isSelected ? bg : "bg-transparent",
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                                    "text-gray-800 dark:text-neutral-900",
                                    "dark:brightness-90 dark:hover:brightness-100",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                ].join(" ")}
                            >
                                <span className="grid h-6 w-full place-items-center rounded-lg">
                                    <Icon className={`h-6 w-6 text-gray-800 ${isSelected ? "dark:text-gray-800" : "dark:text-white"}`} />
                                </span>
                            </button>
                            <span className="leading-none text-[10px] md:text-sm">
                                {label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
