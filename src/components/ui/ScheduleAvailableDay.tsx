"use client";

import { AvailableDayTime, DayOfWeek } from "@/src/types/schedule";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = AvailableDayTime & {
    onDeleteTime: (id: string, idx: number) => void;
    onDeleteDay?: (id: string) => void;
};

const DAY_PT: Record<DayOfWeek, string> = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
};

export function ScheduleAvailableDay({
    id,
    availableDay,
    availableTimeList = [],
    onDeleteDay,
    onDeleteTime,
}: Props) {
    const [openKey, setOpenKey] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocDown = (e: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setOpenKey(null);
            }
        };
        document.addEventListener("mousedown", onDocDown);
        document.addEventListener("touchstart", onDocDown, { passive: true });
        return () => {
            document.removeEventListener("mousedown", onDocDown);
            document.removeEventListener("touchstart", onDocDown);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="
                w-full max-w-[450px]
                rounded-2xl border border-zinc-200 bg-white
                px-5 py-4
                text-zinc-900
                shadow-sm
                dark:border-zinc-700 dark:bg-neutral-900 dark:text-neutral-100
            "
        >
            <h3 className="text-[18px] font-semibold leading-none">
                {DAY_PT[availableDay] ?? availableDay}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
                {availableTimeList.map((t, idx) => {
                    const key = `${id}-${idx}`;
                    const isOpen = openKey === key;

                    return (
                        <span
                            key={key}
                            className="
                                group relative inline-flex items-center
                                rounded-full px-3 py-1
                                text-[12px] font-medium
                                bg-[#D4EED9] text-black
                                dark:bg-[#183E1F] dark:text-white
                                select-none
                            "
                            onClick={() => setOpenKey((prev) => (prev === key ? null : key))}
                        >

                            <span className="inline-flex items-center gap-2">
                                {t.startTime.slice(0, 5)} - {t.endTime.slice(0, 5)}
                            </span>

                            <div
                                className={[
                                    "absolute -top-8 right-0 translate-x-2 -translate-y-full z-20",
                                    "transition-all duration-200 ease-out",
                                    "pointer-events-none",
                                    "md:-top-8",
                                    "md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:scale-100",
                                    "md:opacity-0 md:-translate-y-1 md:scale-95",
                                    isOpen
                                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto md:opacity-0 md:pointer-events-none"
                                        : "opacity-0 -translate-y-1 scale-95 md:opacity-0",
                                ].join(" ")}
                            >
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // don't toggle chip open/close
                                        onDeleteTime(id || "", idx);
                                        setOpenKey(null);
                                    }}
                                    className="
                                        inline-flex items-center gap-2
                                        rounded-xl border border-zinc-200 bg-white
                                        px-3 py-2 text-[12px] font-semibold text-zinc-900
                                        shadow-lg shadow-black/10
                                        hover:bg-zinc-50
                                        active:scale-[0.98]
                                        dark:border-zinc-700 dark:bg-neutral-900 dark:text-neutral-100
                                    "
                                >
                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    Excluir
                                </button>

                                <div
                                    className="
                                        ml-auto mr-3 mt-[-6px]
                                        h-3 w-3 rotate-45
                                        border-b border-r border-zinc-200 bg-white
                                        dark:border-zinc-700 dark:bg-neutral-900
                                    "
                                />
                            </div>
                        </span>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center justify-end">
                <button 
                    type="button" 
                    onClick={() => onDeleteDay?.(id || "")} 
                    className=" 
                        inline-flex items-center gap-2 
                        rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 
                        hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5 
                    " > 
                        <Trash2 size={18} /> Deletar 
                </button>
            </div>
        </div>
    );
}
