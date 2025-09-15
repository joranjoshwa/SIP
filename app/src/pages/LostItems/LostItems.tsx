"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, House, HandHeart, CircleUserRound, Search, MoonStar, Sun, LogOut } from "lucide-react";

import { Logo } from "../../components/ui/Logo";
import { SideBarItem } from "../../components/ui/SideBarItem";
import { ItemCarousel } from "../../components/ui/ItemCarousel"; 
import { Item, CarouselItem } from "../../types/item";
import { itemFromLast48Hours } from "../../api/endpoints/item";

export const LostItems = () => {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme");
        if (saved === "dark") setDarkMode(true);
    }, []);

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

    const toggleTheme = () => setDarkMode((v) => !v);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await itemFromLast48Hours("");
                if (!active) return;
                setItems(res); 
            } catch (err) {
                console.error("Erro ao buscar itens perdidos:", err);
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    return (
        <div
            className="
        flex min-h-screen
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
                    <Logo imageClassName="w-[87px] h-8" mode={darkMode ? "dark" : "light"} />
                </div>

                <nav className="flex-1 px-2">
                    <ul className="flex flex-row justify-between md:flex-col space-x-3 md:space-x-0 md:space-y-3">
                        <SideBarItem icon={House} text="Página inicial" href="/" exact />
                        <SideBarItem icon={HandHeart} text="Itens para doação" href="/donation" exact />
                        <SideBarItem icon={CircleUserRound} text="Perfil" href="/profile" exact />
                        <SideBarItem icon={Search} text="Buscar" href="/search" exact />
                    </ul>
                </nav>

                <div className="px-2 pb-4 pt-2 hidden md:block">
                    <ul className="space-y-3">
                        <SideBarItem
                            icon={darkMode ? Sun : MoonStar}
                            text={darkMode ? "Tema claro" : "Tema escuro"}
                            onClick={toggleTheme}
                            className="text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        />
                        <SideBarItem
                            icon={LogOut}
                            text="Sair"
                            onClick={() => console.log("logout")}
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        />
                    </ul>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col md:pt-16 pr-0 md:pr-8">
                <div className="block md:hidden flex items-center justify-center gap-2 px-4 py-4 pt-8 mb-0">
                    <Logo imageClassName="h-6 md:w-[87px] md:h-8" mode={darkMode ? "dark" : "light"} />
                </div>

                <header className="sticky top-0 z-10 flex items-center gap-3 bg-white/70 px-5 py-4 backdrop-blur-sm dark:bg-neutral-900/70">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-lg font-semibold md:text-2xl">Itens perdidos nas últimas 48h</h1>
                </header>

                <section className="p-5">
                    {loading && <p className="text-sm text-gray-500 dark:text-neutral-400">Carregando…</p>}
                    {!loading && items.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Nenhum item encontrado.</p>
                    )}
                    {!loading && (
                        <ItemCarousel title="" items={items} />
                    )}
                </section>
            </main>
        </div>
    );
};
