"use client";

import { Logo } from "../../components/ui/Logo";
import {
    House, HandHeart, CircleUserRound, Search, MoonStar, LogOut, BellRing, Sun
} from "lucide-react";
import { useEffect, useState } from "react";

export const Dashboard = () => {
    const [mounted, setMounted] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Apply saved theme on mount (and mark mounted to avoid label mismatch)
    useEffect(() => {
        const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
        const shouldDark = saved === "dark";
        setDarkMode(shouldDark);
        if (shouldDark) document.documentElement.classList.add("dark");
        setMounted(true);
    }, []);

    // React to changes and persist
    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode, mounted]);

    const toggleTheme = () => setDarkMode(v => !v);

    return (
        <div className="flex min-h-screen bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
            {/* SIDEBAR */}
            <aside
                className="
          sticky top-0 hidden h-screen w-[368px] shrink-0
          bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80
          md:flex md:flex-col pt-16 pl-16
        "
            >
                {/* Logo */}
                <div className="flex items-center gap-2 px-4 py-4 mb-8">
                    <Logo
                        imageClassName="w-[87px] h-8"
                        mode={darkMode ? "dark" : "light"}
                    />
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2">
                    <ul className="space-y-3">
                        <li>
                            <a
                                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium
                           text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                href="#home"
                            >
                                <House className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                                Página inicial
                            </a>
                        </li>
                        <li>
                            <a
                                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium
                           text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                href="#donation"
                            >
                                <HandHeart className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                                Itens para doação
                            </a>
                        </li>
                        <li>
                            <a
                                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium
                           text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                href="#profile"
                            >
                                <CircleUserRound className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                                Perfil
                            </a>
                        </li>
                        <li>
                            <a
                                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium
                           text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                href="#search"
                            >
                                <Search className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                                Buscar
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Footer actions */}
                <div className="px-2 pb-4 pt-2">
                    <ul className="space-y-3">
                        <li>
                            <button
                                onClick={toggleTheme}
                                aria-pressed={darkMode}
                                title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
                                className="w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium
                           text-gray-700 hover:bg-gray-100 hover:text-gray-900
                           dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                            >
                                {
                                    mounted && (darkMode
                                        ? <Sun className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                                        : <MoonStar className="h-7 w-7 opacity-70 group-hover:opacity-100" />
                                    )
                                }
                                {mounted && (darkMode ? "Tema claro" : "Tema escuro")}
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-md font-medium
                           text-red-600 hover:bg-red-50
                           dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-7 w-7 opacity-80" />
                                Sair
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex min-w-0 flex-1 flex-col pt-16">
                <header
                    className="sticky top-0 z-10 flex items-center justify-between
                     bg-white/70 px-5 py-0 backdrop-blur-sm dark:bg-neutral-900/70"
                >
                    <h1 className="text-2xl font-semibold">Itens perdidos</h1>
                    <button className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
                        <BellRing className="h-7 w-7" />
                    </button>
                </header>

                <section className="p-5">
                    {/* your page content */}
                </section>
            </main>
        </div>
    );
};
