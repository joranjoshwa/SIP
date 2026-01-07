"use client";

import {
    Filter,
    CalendarDays,
    HandHeart,
    ArrowUpNarrowWide,
    MapPin,
    NotebookPen
} from "lucide-react";
import { FilterType } from "@/src/types/item";
import { JSX } from "react/jsx-runtime";
import { useMemo } from "react";

type Props = {
    active: FilterType[];
    onSelect: (value: FilterType) => void;
    page?: "search" | "requests" | "requestsSelf";
};

type FilterOption = {
    key: FilterType;
    label: string;
    icon?: JSX.Element;
};

export const FilterBar = ({ active, onSelect, page = "search" }: Props) => {
    const baseClass =
        "flex items-center gap-2 px-3 py-2 rounded-full text-[12px] md:text-sm font-medium cursor-pointer transition-colors border shrink-0";

    const dictFilters: Record<"search" | "requests" | "requestsSelf", FilterOption[]> = {
        search: [
            { key: "categoria", label: "Categoria", icon: <Filter className="w-4 h-4" /> },
            { key: "data", label: "Data", icon: <CalendarDays className="w-4 h-4" /> },
            { key: "donation", label: "Doação", icon: <HandHeart className="w-4 h-4" /> },
        ],
        requests: [
            {
                key: "dataSolicitacao",
                label: "Data de solicitação",
                icon: <ArrowUpNarrowWide className="w-4 h-4" />,
            },
            { key: "dataBusca", label: "Data de busca" },
        ],
        requestsSelf: [
            { key: "categoria", label: "Categoria", icon: <Filter className="w-4 h-4" /> },
            { key: "data", label: "Data", icon: <CalendarDays className="w-4 h-4" /> },
            { key: "status", label: "Status", icon: <NotebookPen className="w-4 h-4" /> },
        ]
    };

    const filters = useMemo(() => dictFilters[page], [page]);

    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((f) => {
                const isActive = active.includes(f.key);

                return (
                    <button
                        key={f.key}
                        type="button"
                        onClick={() => onSelect(f.key)}
                        className={[
                            baseClass,
                            isActive
                                ? "bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white border-none"
                                : "bg-transparent text-zinc-900 border-zinc-200 hover:bg-zinc-100 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800",
                        ].join(" ")}
                    >
                        {f.icon}
                        <span>{f.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
