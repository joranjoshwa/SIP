import Image from "next/image";
import Link from "next/link";
import { CalendarClock, ImageOff } from "lucide-react";
import type { ItemCard } from "@/src/types/item";

function getTimeBgColor(days?: number) {
    if (days === undefined) return "bg-gray-100 dark:bg-neutral-800";
    if (days < 7) {
        return "bg-[#F9D0D0] dark:bg-[#570000]";
    }
    if (days >= 7 && days < 14) {
        return "bg-[#F9E9D0] dark:bg-[#4A2E00]";
    }
    return "bg-[#D0F9EF] dark:bg-[#005641]";
}

function formatDays(days?: number): string {
    if (days === undefined) return "";
    if (days < 0) return "na doação";
    if (days < 7) {
        return `${days} dia${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
    }
    const weeks = Math.floor(days / 7);
    return `${weeks} semana${weeks > 1 ? "s" : ""} restante${weeks > 1 ? "s" : ""}`;
}

type DateInput = string | number | Date;

function timeAgoPtBr(date: DateInput, now: Date = new Date()) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";

    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 0) return "agora";

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "always" });

    if (diffSec < minute) return rtf.format(-diffSec, "second");
    if (diffSec < hour) return rtf.format(-Math.floor(diffSec / minute), "minute");
    if (diffSec < day) return rtf.format(-Math.floor(diffSec / hour), "hour");
    if (diffSec < month) return rtf.format(-Math.floor(diffSec / day), "day");
    if (diffSec < year) return rtf.format(-Math.floor(diffSec / month), "month");
    return rtf.format(-Math.floor(diffSec / year), "year");
}


export default function ItemCard({ id, picture, description, time, date }: ItemCard) {
    const bg = getTimeBgColor(time);
    const validPhoto = picture && picture.trim() !== "";

    return (
        <Link
            href={`/dashboard/items/${id}`}
            className="w-full flex-shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 block"
        >
            <div className="relative w-full h-[140px] md:h-[170px] flex rounded-2xl items-center justify-center bg-gray-100 dark:bg-neutral-800">
                {validPhoto ? (
                    <Image
                        src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + picture}
                        alt={description}
                        fill
                        sizes="400px"
                        className="w-10 h-10 object-cover rounded-2xl"
                        loading="lazy"
                        unoptimized
                    />
                ) : (
                    <ImageOff className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                )}
            </div>

            <div className="py-2 space-y-2 min-h-[5rem]">
                <h3 className="text-sm font-medium leading-snug line-clamp-2 text-gray-800 dark:text-gray-100">
                    {description}
                </h3>

                {date && (
                    <p className="text-[11px] font-medium leading-snug line-clamp-2 text-gray-800 dark:text-gray-100">
                        Encontrado {timeAgoPtBr(date as string)}
                    </p>
                )}

                {time && time < 15 && (
                    <div
                        className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-2xl w-fit ${bg}`}
                    >
                        <CalendarClock className="w-4 h-4" />
                        <span>{formatDays(time)}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
