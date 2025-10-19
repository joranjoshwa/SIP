"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, Hand, CalendarX2, PackagePlus } from "lucide-react";

export function AdminActionsMobile() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Backdrop (tap to close) */}
            <button
                aria-hidden={!open}
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-40 md:hidden transition ${open ? "bg-black/40 backdrop-blur-[1px]" : "pointer-events-none bg-transparent"}`}
            />

            {/* Actions panel */}
            <div
                className={`
          fixed z-50 md:hidden
          right-8 bottom-[23%] w-72
          rounded-xl
          text-white
          transition-all duration-200
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
            >
                {/* Item 1 */}
                <Link
                    href="/dashboard/requests"
                    className="flex items-center justify-end py-2 gap-2 rounded-lg hover:bg-white/5 transition"
                    onClick={() => setOpen(false)}
                >
                    <span className="font-semibold text-lg">Analisar solicitações</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                        <Hand className="h-5 w-5" />
                    </span>
                </Link>

                {/* Item 2 */}
                <Link
                    href="/dashboard/schedule/new-block"
                    className="flex items-center justify-end gap-2 py-2 rounded-lg hover:bg-white/5 transition"
                    onClick={() => setOpen(false)}
                >
                    <span className="font-semibold text-lg">Novo horário ocupado</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                        <CalendarX2 className="h-5 w-5" />
                    </span>
                </Link>

                {/* Item 3 */}
                <Link
                    href="/dashboard/items/new"
                    className="flex items-center justify-end gap-2 py-2 rounded-lg hover:bg-white/5 transition"
                    onClick={() => setOpen(false)}
                >
                    <span className="font-semibold text-lg">Registrar novo item</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                        <PackagePlus className="h-5 w-5" />
                    </span>
                </Link>
            </div>

            {/* FAB (toggle) */}
            <button
                type="button"
                aria-expanded={open}
                aria-controls="admin-fab-menu"
                onClick={() => setOpen((v) => !v)}
                className="fixed md:hidden z-50 md:hidden right-8 bottom-[15%] h-11 w-11 rounded-lg
                   bg-[#95F8A8] dark:bg-[#183E1F] text-black shadow-md grid place-items-center
                   active:scale-95 transition"
            >
                {open ? <X className="h-6 w-6 dark:text-white" /> : <Plus className="h-6 w-6 dark:text-white" />}
            </button>
        </>
    );
}
