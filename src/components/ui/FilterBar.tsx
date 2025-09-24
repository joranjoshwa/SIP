import { Filter, CalendarDays, Clock, HandHeart } from "lucide-react";
import { FilterType } from "@/src/types/item";

type Props = {
    active: FilterType[];
    onSelect: (value: FilterType) => void;
};

export const FilterBar = ({ active, onSelect }: Props) => {
    const baseClass =
        "flex items-center gap-2 px-3 py-2 rounded-full text-[12px] md:text-sm font-medium cursor-pointer transition-colors border shrink-0";

    const filters: { key: FilterType; label: string; icon: JSX.Element }[] = [
        { key: "categoria", label: "Categoria", icon: <Filter className="w-4 h-4" /> },
        { key: "data", label: "Data", icon: <CalendarDays className="w-4 h-4" /> },
        { key: "donation", label: "Doação", icon: <HandHeart className="w-4 h-4" /> },
        { key: "lastDays", label: "Últimos Dias", icon: <Clock className="w-4 h-4" /> },
    ];

    return (
        <div className="flex gap-3 overflow-x-auto flex-nowrap md:flex-wrap md:overflow-visible scrollbar-hide">
            {filters.map(({ key, label, icon }) => (
                <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className={`${baseClass} ${active.includes(key)
                            ? "bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white dark:border-[#183E1F]"
                            : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border-gray-600"
                        }`}
                >
                    {icon}
                    {label}
                </button>
            ))}
        </div>
    );
};
