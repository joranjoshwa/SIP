"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BellRing } from "lucide-react";

type Props = {
    title: string;
    showBell?: boolean;
};

export function PageHeader({ title, showBell }: Props) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => router.back()}
                    className="text-gray-700 dark:text-gray-200"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-semibold text-lg">{title}</h1>
            </div>

            <button className={`rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 ${showBell ? "" : "hidden"}`}>
                <BellRing className="h-6 w-6 md:h-7 md:w-7" />
            </button>
        </div>
    );
}
