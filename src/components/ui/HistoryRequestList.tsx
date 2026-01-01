"use client";

import Image from "next/image";
import { Clock, ImageOff, ChevronDown } from "lucide-react";
import { useState } from "react";
import { RecoveryStatus } from "@/src/types/recovery";
import { RecoveryLabels } from "@/src/constants/recoveryStatus";

type Props = {
    title: string;
    imageUrl: string | null;
    status: RecoveryStatus;

    /** What you want to reveal when expanded */
    description?: string;

    /** ISO string, ex: "2025-05-29T09:30:00.000Z" */
    pickupIso?: string;

    /** Optional: force timezone used for formatting (default: user's) */
    timeZone?: string;

    /**
     * Optional callback (e.g., navigate). If you only want expand, just omit it.
     */
    onClick?: () => void;

    /** Optional: start expanded */
    defaultExpanded?: boolean;
};

const statusClass = (status: RecoveryStatus) => {
    switch (status) {
        case "APPROVED":
            return "bg-[#D4EED9] dark:bg-[#183E1F]";
        case "PENDING":
            return "bg-[#DBDBDB] dark:bg-[#9b9b9b]";
        case "REFUSED":
            return "bg-[#F9D0D0] dark:bg-[#570000]";
    }
};

function formatPtBrDateTime(iso: string, timeZone?: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Data inválida";

    const date = d.toLocaleDateString("pt-BR", {
        timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const time = d.toLocaleTimeString("pt-BR", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${date}, ${time}`;
}

export function HistoryRequestList({
    title,
    imageUrl,
    status,
    description,
    pickupIso,
    timeZone,
    onClick,
    defaultExpanded = false,
}: Props) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const dateLabel = pickupIso ? formatPtBrDateTime(pickupIso, timeZone) : null;

    const handleToggle = () => {
        setExpanded((v) => !v);
    };

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={handleToggle}
                aria-expanded={expanded}
                className={[
                    "w-full text-left transition-colors",
                    "md:border-b md:border-zinc-200/80 md:dark:border-zinc-800",
                    "p-2",
                ].join(" ")}
            >
                <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative md:h-20 md:w-20 h-16 w-16 rounded-lg overflow-hidden shrink-0">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ImageOff className="h-5 w-5 text-zinc-500 dark:text-zinc-500" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="w-full flex justify-between align-center">

                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold truncate text-zinc-900 dark:text-zinc-100">
                                    {title}
                                </div>
                            </div>

                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                                <span
                                    className={[
                                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                                        statusClass(status),
                                    ].join(" ")}
                                >
                                    {RecoveryLabels[status]}
                                </span>

                                {dateLabel && (
                                    <span className="flex items-center justify-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        {dateLabel}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ChevronDown
                            className={[
                                "h-5 w-5 shrink-0 text-zinc-500 transition-transform",
                                expanded ? "rotate-180" : "rotate-0",
                            ].join(" ")}
                        />
                    </div>
                </div>
                {/* Expanded area */}
                <div
                    className={[
                        "overflow-hidden px-3 pt-2",
                        "transition-[max-height,opacity] duration-200 ease-out",
                        expanded ? "max-h-40 opacity-100 pb-3" : "max-h-0 opacity-0 pb-0",
                    ].join(" ")}
                >
                    <div className="rounded-xl bg-zinc-50 dark:bg-white/5 px-4 py-3">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                            Descrição da solicitação
                        </p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 break-words">
                            {description?.trim() ? description : "Sem descrição."}
                        </p>
                    </div>
                </div>
            </button>
        </div>
    );
}
