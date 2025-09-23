import { Filter, CalendarDays, MapPin } from "lucide-react";

type Props = {
    active: ("categoria" | "data" | "local")[];
    onSelect: (value: "categoria" | "data" | "local") => void;
};

export const FilterBar = ({ active, onSelect }: Props) => {
    const baseClass =
        "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors";

    return (
        <div className="flex gap-3">
            <button
                onClick={() => onSelect("categoria")}
                className={`${baseClass} ${active.includes("categoria")
                        ? "bg-green-100 text-black border-green-300 dark:bg-[#183E1F] dark:text-white dark:border-green-[#183E1F]"
                        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border"
                    }`}
            >
                <Filter className="w-4 h-4" />
                Categoria
            </button>

            <button
                onClick={() => onSelect("data")}
                className={`${baseClass} ${active.includes("data")
                        ? "bg-green-100 text-black border-green-300 dark:bg-[#183E1F] dark:text-white dark:border-green-[#183E1F]"
                        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border"
                    }`}
            >
                <CalendarDays className="w-4 h-4" />
                Data
            </button>
        </div>
    );
};
