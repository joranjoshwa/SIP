"use client";

import { BellRing } from "lucide-react";
import { CategoryItem } from "../../../components/ui/CategoryItem";
import { ItemCarousel } from "../../../components/ui/ItemCarousel";
import { useEffect, useState } from "react";
import { CarouselItem, Item, UUID } from "../../../types/item";
import { itemFromLast48Hours, itemAboutToBeDonated } from "../../../api/endpoints/item";
import { useRouter } from "next/navigation";
import { CategoryKey } from "@/src/constants/categories";

const firstPic = (pics?: { id: string, url: string }) => (pics ? pics.url : "");
const mapToCarouselItem = (dto: Item): CarouselItem => ({
    id: dto.id as UUID,
    picture: firstPic(dto.picture),
    description: dto.description,
    time: dto.time,
});

export default function DashboardPage() {
    const [itemsLast48Hours, setItemsLast48Hours] = useState<CarouselItem[]>([]);
    const [itemsAboutToBeDonated, setItemAboutToBeDonated] = useState<CarouselItem[]>([]);
    const [chosenCategory, setChosenCategory] = useState<CategoryKey | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const handleCategorySelection = (category: CategoryKey | null) => {
        if (category !== chosenCategory) {
            setChosenCategory(category);
        } else {
            setChosenCategory(null);
        }
    };

    const fetchItems = async <T,>(
        fetcher: (category: string) => Promise<T>,
        mapper: (item: Item) => CarouselItem,
        setter: (items: CarouselItem[]) => void
    ) => {
        try {
            setLoading(true);
            const res = await fetcher(chosenCategory ? chosenCategory : "");
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

    return (
        <>
            <header className="sticky top-0 z-10 flex items-center justify-between bg-white/70 px-5 py-0 backdrop-blur-sm dark:bg-neutral-900/70">
                <h1 className="text-[18px] font-semibold md:text-2xl">Itens perdidos</h1>
                <button className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
                    <BellRing className="h-6 w-6 md:h-7 md:w-7" />
                </button>
            </header>

            <section className="p-5 pt-0 md:pt-5">
                <CategoryItem handleCategorySelection={handleCategorySelection} />

                <div className="py-1 pt-4">
                    <ItemCarousel title="Prestes a serem doados…" items={itemsAboutToBeDonated} />
                    {loading && (
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">Carregando…</p>
                    )}
                    {!loading && itemsAboutToBeDonated.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                            Nenhum item para ser doado.
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
        </>
    );
}
