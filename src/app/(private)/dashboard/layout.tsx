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
import { useEffect, useState } from "react";
import { extractRoleFromToken, logout } from "@/src/utils/token";
import { Role } from "@/src/enums/role";
import { AdminActions } from "@/src/components/ui/AdminActions";
import { WebSocketProvider } from "@/src/context/WebsocketContext";

type Channel = "admin" | "common";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";

    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setRole(extractRoleFromToken(token) as Role);
        }
    }, []);

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
                    sticky md:top-0
                    flex md:flex-col
                    w-full md:w-[368px]
                    h-auto md:h-screen
                    bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80
                    px-4 py-4 md:pt-16 md:pl-16
                "
            >
                <div className="hidden md:flex items-center gap-2 px-4 py-4 mb-8">
                    <Logo
                        imageClassName="w-[87px] h-8"
                        mode={darkMode ? "dark" : "light"}
                    />
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
                        <SideBarItem icon={Search} text="Buscar" href="/dashboard/items" exact />

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

                <div className="px-2 pb-4 pt-2 hidden md:block">
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
                <div className="block md:hidden flex items-center justify-center gap-2 px-4 pt-4 pt-8 mb-[1.5rem]">
                    <Logo
                        imageClassName="h-6 md:w-[87px] md:h-8"
                        mode={darkMode ? "dark" : "light"}
                    />
                </div>

                <WebSocketProvider
                    autoReconnect={true}
                    reconnectInterval={5000}>
                        {children}
                </WebSocketProvider>
            </main>
        </div>
    );
}