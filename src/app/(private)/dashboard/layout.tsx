"use client";

import { Logo } from "../../../components/ui/Logo";
import { SideBarItem } from "../../../components/ui/SideBarItem";
import {
    House,
    HandHeart,
    CircleUserRound,
    Search,
    MoonStar,
    LogOut,
    Calendar1,
    Sun,
} from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";
import { extractRoleFromToken, logout } from "@/src/utils/token";
import { Role } from "@/src/enums/role";
import { AdminActions } from "@/src/components/ui/AdminActions";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";
    const role = extractRoleFromToken(localStorage.getItem("token") as string);

    return (
        <div
            className="
                flex h-screen min-h-0
                flex-col-reverse md:flex-row
                bg-white text-gray-900
                dark:bg-neutral-900 dark:text-neutral-100
            "
        >
            <aside
                className="
          hidden md:flex md:flex-col
          w-[368px] h-screen
          bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80
          px-4 py-4 md:pt-16 md:pl-16
        "
            >
                <div className="flex items-center gap-2 px-4 py-4 mb-8">
                    <Logo imageClassName="w-[87px] h-8" mode={darkMode ? "dark" : "light"} />
                </div>

                <nav className="flex-1 px-2">
                    <ul
                        className="
                        flex flex-row justify-between md:flex-col
                        space-x-3 md:space-x-0 md:space-y-3
                        "
                    >
                        <SideBarItem icon={House} text="Página inicial" href="/dashboard" exact />
                        <SideBarItem icon={CircleUserRound} text="Perfil" href="/dashboard/profile" exact />
                        <SideBarItem icon={Search} text="Buscar" href="/dashboard/search" exact />

                        {role === Role.COMMON && (
                            <SideBarItem icon={HandHeart} text="Itens para doação" href="/dashboard/donation" exact />
                        )}

                        {role === Role.ADMIN && (
                            <>
                                <SideBarItem icon={HandHeart} text="Itens para doação" href="/dashboard/donation" exact />
                                <SideBarItem icon={Calendar1} text="Horários" href="/dashboard/schedule" exact />
                                <AdminActions />
                            </>
                        )}
                        {role === Role.ROOT && (
                            <></>
                        )}
                    </ul>
                </nav>

                <div className="px-2 pb-4 pt-2">
                    <ul className="space-y-3">
                        <SideBarItem
                            icon={darkMode ? Sun : MoonStar}
                            text={darkMode ? "Tema claro" : "Tema escuro"}
                            onClick={toggleTheme}
                            className="text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 w-full"
                        />
                        <SideBarItem
                            icon={LogOut}
                            text="Sair"
                            onClick={() => logout()}
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 w-full"
                        />
                    </ul>
                </div>
            </aside>

            <main className="flex flex-1 min-w-0 min-h-0 flex-col md:pt-16 pr-0 md:pr-8">
                <div className="block md:hidden flex items-center justify-center gap-2 px-4 py-4 pt-8 mb-0">
                    <Logo
                        imageClassName="h-6 md:w-[87px] md:h-8"
                        mode={darkMode ? "dark" : "light"}
                    />
                </div>

                {children}
            </main>

            <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 z-50">
                <nav className="flex justify-around py-2">
                    <SideBarItem icon={House} text="" href="/dashboard" isMobile exact />
                    <SideBarItem icon={HandHeart} text="" href="/dashboard/donation" isMobile exact />
                    <SideBarItem icon={CircleUserRound} text="" href="/dashboard/profile" isMobile exact />
                    <SideBarItem icon={Search} text="" href="/dashboard/search" isMobile exact />
                </nav>
            </div>
        </div>
    );
}
