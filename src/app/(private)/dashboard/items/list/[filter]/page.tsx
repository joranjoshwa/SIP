"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import ItemCard from "@/src/components/ui/ItemCard";
import { CarouselItem } from "@/src/types/item";

import {
    itemFromLast48Hours,
    itemAboutToBeDonated,
    itemForDonation,
} from "@/src/api/endpoints/item";
import { Loading } from "@/src/components/ui/Loading";

type FilterKey = "last-48h" | "about-to-be-donated" | "donation-today";

const META: Record<FilterKey, { title: string; emptyMessage: string; backHref: string }> = {
    "last-48h": {
        title: "Itens perdidos nas últimas 48h",
        emptyMessage: "Nenhum item perdido nas últimas 48h.",
        backHref: "/dashboard",
    },
    "about-to-be-donated": {
        title: "Itens prestes a serem doados",
        emptyMessage: "Nenhum item próximo de doação no momento.",
        backHref: "/dashboard",
    },
    "donation-today": {
        title: "Itens para doação hoje",
        emptyMessage: "Nenhum item disponível para doação no momento.",
        backHref: "/dashboard",
    },
};

export default function ItemsListByFilterPage() {
    const params = useParams<{ filter: string }>();
    const filter = params?.filter as FilterKey;

    const meta = useMemo(() => META[filter], [filter]);
    if (!meta) return notFound();

    const [items, setItems] = useState<CarouselItem[]>([]);
    const [chosenCategory, setChosenCategory] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchingRef = useRef(false);


    const pageSize = 26;

    const fetchByFilter = useCallback(
        async (category: string, page: number, size: number) => {
            if (filter === "last-48h") return itemFromLast48Hours(category, page, size);
            if (filter === "about-to-be-donated") return itemAboutToBeDonated(category, page, size);
            return itemForDonation(category, page, size);
        },
        [filter]
    );

    const load = useCallback(
        async (reset = false) => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;

            setLoading(true);
            try {
                const currentPage = reset ? 0 : page;
                const data = await fetchByFilter(chosenCategory ?? "", currentPage, pageSize);

                setItems((prev) => {
                    const combined = reset ? data : [...prev, ...data];
                    return Array.from(new Map(combined.map((i) => [i.id, i])).values());
                });

                setHasMore(data.length === pageSize);
            } catch (e) {
                console.error("Erro ao carregar itens:", e);
                setHasMore(false);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        },
        [chosenCategory, page, pageSize, fetchByFilter]
    );


    useEffect(() => {
        setItems([]);
        setPage(0);
        setHasMore(true);
        load(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, chosenCategory]);

    useEffect(() => {
        if (page === 0) return;
        load(false);
    }, [page, load]);

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            if (loading || !hasMore) return;

            const el = e.currentTarget;

            const canScroll = el.scrollHeight > el.clientHeight + 5;
            if (!canScroll) return;

            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
            if (nearBottom) setPage((p) => p + 1);
        },
        [loading, hasMore]
    );


    return (
        <div className="flex flex-col bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100 min-h-0">
            <header className="sticky top-0 z-10 flex items-center gap-3 bg-white/70 px-5 pt-3 backdrop-blur-sm dark:bg-neutral-900/70">
                <h1 className="text-lg font-semibold md:text-2xl">{meta.title}</h1>
            </header>

            <section className="p-5 pb-0 pt-2 flex-shrink-0">
                <CategoryItem handleCategorySelection={setChosenCategory} />
            </section>

            <ScrollableArea onScroll={handleScroll}>
                <div className="px-5 pb-5 pt-3">
                    {items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-3 justify-center place-items-center mt-4">
                            {items.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    id={item.id}
                                    picture={item.picture}
                                    description={item.description}
                                    time={item.time}
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 text-center">
                                {meta.emptyMessage}
                            </p>
                        )
                    )}

                    <Loading isLoading={loading} />
                </div>
            </ScrollableArea>

        </div>
    );
}
