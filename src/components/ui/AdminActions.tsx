import { useState } from "react";
import { Plus, X, Hand, CalendarX2, PackagePlus } from "lucide-react";
import { Role } from "@/src/enums/role";
import { SideBarItem } from "@/src/components/ui/SideBarItem";

export function AdminActions() {
    const [open, setOpen] = useState(false);

    return (
        <li className="hidden md:block w-full !mt-16">
            <button
                type="button"
                aria-expanded={open}
                aria-controls="admin-actions-menu"
                onClick={() => setOpen((s) => !s)}
                className="group w-full flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium transition-colors hover:brightness-105
                   bg-[#95F8A8] dark:bg-[#183E1F]"
            >
                {open ? (
                    <X className="h-7 w-7 opacity-90 group-hover:opacity-100" />
                ) : (
                    <Plus className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                )}
                <span className="hidden md:block">{open ? "Fechar ações" : "Ações de admin"}</span>
            </button>

            <ul
                id="admin-actions-menu"
                className={`mt-3 overflow-hidden space-y-3 transition-all duration-300
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
            >
                <li>
                    <SideBarItem
                        icon={Hand}
                        text="Analisar solicitações"
                        href="/dashboard/requests"
                        exact
                    />
                </li>
                <li>
                    <SideBarItem
                        icon={CalendarX2}
                        text="Novo horário ocupado"
                        href="/dashboard/schedule/new-block"
                        exact
                    />
                </li>
                <li>
                    <SideBarItem
                        icon={PackagePlus}
                        text="Registrar novo item"
                        href="/dashboard/items/new"
                        exact
                    />
                </li>
            </ul>
        </li>
    );
}
