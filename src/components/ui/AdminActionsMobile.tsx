"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, X, Hand, CalendarX2, PackagePlus } from "lucide-react";
import { extractRoleFromToken, getTokenFromCookie } from "@/src/utils/token";
import { Role as UserRole } from "@/src/enums/role";

type Props = {
    positionFab?: string;
    positionOptions?: string;
};

export function AdminActionsMobile({ positionFab, positionOptions }: Props) {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = getTokenFromCookie();
        const r = extractRoleFromToken(token as string);
        setRole(r);
    }, []);

    if (role !== UserRole.ADMIN) return null;

    return (
        <>
            {open && (
                <button
                    aria-hidden
                    onClick={() => setOpen(false)}
                    className="
            fixed inset-0 z-40 md:hidden
            bg-black/40 backdrop-blur-[1px]
            transition
          "
                />
            )}

            <div
                className={`
          fixed z-50 md:hidden
          w-72 ${positionOptions ? positionOptions : "right-8 bottom-[23%]"}
          rounded-xl
          text-white
          transition-all duration-200
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
            >
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

                <Link
                    href="/dashboard/schedule/edit"
                    className="flex items-center justify-end gap-2 py-2 rounded-lg hover:bg-white/5 transition"
                    onClick={() => setOpen(false)}
                >
                    <span className="font-semibold text-lg">Editar disponibilidade</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                        <CalendarX2 className="h-5 w-5" />
                    </span>
                </Link>

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

            <button
                type="button"
                aria-expanded={open}
                aria-controls="admin-fab-menu"
                onClick={() => setOpen((v) => !v)}
                className={`
          ${positionFab ? positionFab : "right-8 bottom-[15%]"}
          fixed md:hidden z-50 h-11 w-11 rounded-lg
          bg-[#95F8A8] dark:bg-[#183E1F] text-black shadow-md grid place-items-center
          active:scale-95 transition
        `}
            >
                {open ? (
                    <X className="h-6 w-6 dark:text-white" />
                ) : (
                    <Plus className="h-6 w-6 dark:text-white" />
                )}
            </button>
        </>
    );
}
