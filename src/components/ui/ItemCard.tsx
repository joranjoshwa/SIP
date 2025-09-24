import Image from "next/image";
import { CalendarClock, ImageOff } from "lucide-react";
import type { ItemCard } from "@/src/types/item";

function getTimeBgColor(days?: number) {
    if (days === undefined) return "bg-gray-100 dark:bg-neutral-800";
    if (days < 7) {
        return "bg-[#FFD1D1]";
    }
    if (days >= 7 && days < 14) {
        return "bg-[#FFE0D1]";
    }
    return "bg-[#D1FFD1]";
}

function formatDays(days?: number) {
    if (days === undefined) return "";
    if (days < 7) {
        return `${days} dia${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
    }
    const weeks = Math.floor(days / 7);
    return `${weeks} semana${weeks > 1 ? "s" : ""} restante${weeks > 1 ? "s" : ""}`;
}

export default function ItemCard({ picture, description, time }: ItemCard) {

    const bg = getTimeBgColor(time);
    const validPhoto = picture && picture.trim() !== "";
    return (
        <div className="w-40 flex-shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900">

            {/* Image */}
            <div className="relative w-full h-[140px] md:h-[170px] flex rounded-2xl items-center justify-center bg-gray-100 dark:bg-neutral-800">
                {validPhoto ? (
                    <Image src={picture} alt={description} fill className=" w-10 h-10 object-cover rounded-2xl" />
                ) : (
                    <ImageOff className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                )}
            </div>


            {/* Content */}
            <div className="py-2 space-y-2">
                <h3 className="text-sm font-medium leading-snug line-clamp-2 text-gray-800 dark:text-gray-100">
                    {description}
                </h3>


                {time && (
                    <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-2xl w-fit ${bg}`}>
                        <CalendarClock className="w-4 h-4 dark:text-black" />
                        <span className="dark:text-black">{formatDays(time)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
