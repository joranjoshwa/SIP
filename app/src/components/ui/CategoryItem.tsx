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
    { key: "garrafa", label: "Garrafa", Icon: CupSoda, bg: "bg-rose-100", ring: "ring-rose-200" },
    { key: "roupa", label: "Roupa", Icon: Shirt, bg: "bg-pink-100", ring: "ring-pink-200" },
    { key: "eletronico", label: "Eletrônico", Icon: Zap, bg: "bg-amber-100", ring: "ring-amber-200" },
    { key: "acessorio", label: "Acessório", Icon: Glasses, bg: "bg-emerald-100", ring: "ring-emerald-200" },
    { key: "vasilha", label: "Vasilha", Icon: Salad, bg: "bg-green-100", ring: "ring-green-200" },
    { key: "livro", label: "Livro", Icon: BookMarked, bg: "bg-orange-100", ring: "ring-orange-200" },
    { key: "material", label: "Material", Icon: NotebookPen, bg: "bg-violet-200", ring: "ring-violet-300" },
    { key: "documento", label: "Documento", Icon: SquareUserRound, bg: "bg-fuchsia-100", ring: "ring-fuchsia-200" },
    { key: "outros", label: "Outros", Icon: FileQuestionMark, bg: "bg-gray-100", ring: "ring-gray-200" },
];

type CategoryItemProps = {
    setCategory: (category: string) => void,
    onSelect?: (key: string | null) => void;
};

export const CategoryItem = ({ onSelect, setCategory }: CategoryItemProps) => {
    const [activeCat, setActiveCat] = useState<string | null>(null);

    const activeRing =
        "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900";

    const handleClick = (key: string) => {
        const newActive = activeCat === key ? null : key;
        setActiveCat(newActive);
        setCategory(newActive as string);
        if (onSelect) onSelect(newActive);
    };

    return (
        <div className="relative">
            <ul
                className={[
                    "mt-0 md:mt-4 flex gap-3 py-1 px-4 text-sm",
                    // Mobile: horizontal scroll
                    "overflow-x-auto flex-nowrap snap-x snap-mandatory",
                    // Hide scrollbar (WebKit + Firefox + old IE)
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
                    // Desktop: wrap and no overflow
                    "md:flex-wrap md:overflow-visible md:snap-none",
                ].join(" ")}
                aria-label="Categories"
            >
                {categories.map(({ key, label, Icon, bg, ring }) => {
                    const isActive = activeCat === key;
                    return (
                        <li className="shrink-0 snap-start flex flex-col items-center text-center md:flex-1" key={key}>
                            <button
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => handleClick(key)}
                                className={[
                                    bg,
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                                    "md:rounded-2xl md:px-4 md:py-2 md:text-sm md:font-medium md:w-full",
                                    "text-gray-800 dark:text-neutral-900",
                                    "dark:brightness-90 dark:hover:brightness-100",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                    isActive ? `${activeRing} ${ring}` : "",
                                ].join(" ")}
                            >
                                <span className="grid h-6 w-full place-items-center rounded-lg">
                                    <Icon className="h-6 w-6 md:h-7 md:w-7 text-gray-800" />
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
