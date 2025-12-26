"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BellRing, X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { NotificationList } from "./NotificationList";
import { useWebSocket } from "@/src/context/WebsocketContext";
import { markAsRead } from "@/src/api/endpoints/notification";

type Props = {
    title: string;
    showBell?: boolean;
    goBack?: boolean;
    className?: string;
};

export function PageHeader({ title, showBell = false, goBack = true, className }: Props) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { messages, setMessages } = useWebSocket();

    const unread = useMemo(
        () => messages.filter((msg) => msg?.status === "PENDING").length,
        [messages]
    );

    return (
        <div className={`flex relative items-center justify-between gap-2 mb-4 ${className}`}>
            <div className="flex gap-2 items-center">
                {goBack && (
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className="text-gray-700 dark:text-gray-200"
                    >
                        <ArrowLeft className="h-6 w-6 md:h-7 md:w-7" />
                    </button>
                )}

                <h1 className="text-[18px] font-semibold md:text-2xl">{title}</h1>
            </div>

            {showBell && (
                <>
                    <Link
                        href="/dashboard/notification"
                        className="rounded-xl p-2 relative hover:bg-gray-100 dark:hover:bg-neutral-800 block md:hidden"
                        aria-label="Notifications"
                    >
                        {unread > 0 && (
                            <div className="absolute bg-red-500 w-4 h-4 rounded-full text-[11px] top-[2px] right-1 text-center">{unread}</div>
                        )}
                        <BellRing className="h-6 w-6 md:h-7 md:w-7" />
                    </Link>

                    <button
                        onClick={async () => {
                            setModalOpen(true);

                            const ids = messages.map((m) => m.notificationId!).filter(Boolean);

                            await markAsRead(ids);

                            const idSet = new Set(ids);

                            setMessages((prev) =>
                                prev.map((item) =>
                                    item.notificationId && idSet.has(item.notificationId)
                                        ? { ...item, status: "READ" as const }
                                        : item
                                )
                            );
                        }}
                        className="rounded-xl relative p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 hidden md:block"
                        aria-label="Open notifications"
                    >
                        {unread > 0 && (
                            <div className="absolute bg-red-500 w-5 h-5 rounded-full text-sm top-[0px] right-1">{unread}</div>
                        )}
                        <BellRing className="h-6 w-6 md:h-7 md:w-7" />
                    </button>
                </>
            )}

            {modalOpen && (
                <div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Notifications"
                    className="absolute top-full right-0 mt-2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl py-2 z-10
                                md:border md:border-gray-300 md:dark:border-gray-600"
                >
                    <div className="rounded-lg bg-white dark:bg-neutral-900 min-h-0 max-h-[60vh] overflow-auto scrollbar-hide">
                        <NotificationList />
                    </div>
                </div>
            )}
        </div>
    );
}
