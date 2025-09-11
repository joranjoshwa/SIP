"use client";

import { Logo } from "../../components/ui/Logo";
import { SideBarItem } from "../../components/ui/SideBarItem";
import { House, HandHeart, CircleUserRound, Search, MoonStar, LogOut, BellRing, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryItem } from "../../components/ui/CategoryItem";
import { ItemCarousel } from "../../components/ui/ItemCarousel";
import { CarouselItem, Item, UUID, } from "../../types/item";
import { itemFromLast48Hours, itemAboutToBeDonated } from "../../api/endpoints/item";

const firstPic = (pics?: { id: string, url: string }) => (pics ? pics.url : "");
const mapToCarouselItem = (dto: Item): CarouselItem => ({
    id: dto.id as UUID,
    picture: firstPic(dto.picture),
    description: dto.description,
    time: dto.time,
});

export const Dashboard = () => {
    const [mounted, setMounted] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [itemsLast48Hours, setItemsLast48Hours] = useState<CarouselItem[]>([]);
    const [itemsAboutToBeDonated, setItemAboutToBeDonated] = useState<CarouselItem[]>([]);
    const [chosenCategory, setChosenCategory] = useState("");
    const [loading, setLoading] = useState(true);

    const handleCategorySelection = (category: string) => {
        if (category !== chosenCategory) {
            setChosenCategory(category);
        } else {
            setChosenCategory("");
        }
    }

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setDarkMode(true);
        }
    }, []);

    const fetchItems = async <T,>(
        fetcher: (category: string) => Promise<T>,
        mapper: (item: Item) => CarouselItem,
        setter: (items: CarouselItem[]) => void
    ) => {
        try {
            setLoading(true);
            const res = await fetcher(chosenCategory);
            const dtos: Item[] = res as Item[];
            setter(dtos.map(mapper));
        } catch (err) {
            console.error("Failed to fetch items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        (async () => {
            if (!active) return;
            await fetchItems(itemFromLast48Hours, mapToCarouselItem, setItemsLast48Hours);
        })();
        return () => { active = false; };
    }, [chosenCategory]);

    useEffect(() => {
        let active = true;
        (async () => {
            if (!active) return;
            await fetchItems(itemAboutToBeDonated, mapToCarouselItem, setItemAboutToBeDonated);
        })();
        return () => { active = false; };
    }, [chosenCategory]);

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
    return (
        <div
            className="
        flex min-h-screen
        flex-col-reverse md:flex-row
        bg-white text-gray-900
        dark:bg-neutral-900 dark:text-neutral-100
      "
        >
            {/* SIDEBAR */}
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
                {/* Logo */}
                <div className="hidden md:flex items-center gap-2 px-4 py-4 mb-8">
                    <Logo imageClassName="w-[87px] h-8" mode={darkMode ? "dark" : "light"} />
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2">
                    <ul
                        className="
              flex flex-row justify-between md:flex-col
              space-x-3 md:space-x-0 md:space-y-3
            "
                    >
                        <SideBarItem icon={House} text="Página inicial" href="/" exact />
                        <SideBarItem icon={HandHeart} text="Itens para doação" href="/donation" exact />
                        <SideBarItem icon={CircleUserRound} text="Perfil" href="/profile" exact />
                        <SideBarItem icon={Search} text="Buscar" href="/search" exact />
                    </ul>
                </nav>

                {/* Footer actions */}
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

            {/* MAIN */}
            <main className="flex min-w-0 flex-1 flex-col md:pt-16 pr-0 md:pr-8">
                {/* Mobile Logo */}
                <div className="block md:hidden flex items-center justify-center gap-2 px-4 py-4 pt-8 mb-0">
                    <Logo imageClassName="h-6 md:w-[87px] md:h-8" mode={darkMode ? "dark" : "light"} />
                </div>

                <header className="sticky top-0 z-10 flex items-center justify-between bg-white/70 px-5 py-0 backdrop-blur-sm dark:bg-neutral-900/70">
                    <h1 className="text-[18px] font-semibold md:text-2xl">Itens perdidos</h1>
                    <button className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
                        <BellRing className="h-6 w-6 md:h-7 md:w-7" />
                    </button>
                </header>

                <section className="p-5 pt-0 md:pt-5">
                    <CategoryItem setCategory={handleCategorySelection} />

                    <div className="py-1 pt-4">
                        <ItemCarousel title="Prestes a serem doados…" items={itemsAboutToBeDonated} />
                        {loading && (
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">Carregando…</p>
                        )}
                        {!loading && itemsAboutToBeDonated.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                                Nenhum item encontrado nas últimas 48 horas.
                            </p>
                        )}
                    </div>

                    <div className="py-1">
                        <ItemCarousel title="Perdidos nas últimas 48 horas" items={itemsLast48Hours} />
                        {loading && (
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">Carregando…</p>
                        )}
                        {!loading && itemsLast48Hours.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                                Nenhum item encontrado nas últimas 48 horas.
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
