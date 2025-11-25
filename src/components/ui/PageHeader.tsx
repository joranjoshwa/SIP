"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BellRing, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { NotificationList } from "./NotificationList";

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
    const [unread, setUnread] = useState<number>(0);


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
                        className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 block md:hidden"
                        aria-label="Notifications"
                    >
                        <BellRing className="h-6 w-6 md:h-7 md:w-7" />
                    </Link>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 hidden md:block"
                        aria-label="Open notifications"
                    >
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
                        <NotificationList setUnread={setUnread} />
                    </div>
                </div>
            )}
        </div>
    );
}
