"use client";

import { SearchBar } from "@/src/components/ui/SearchBar";
import { SearchFilter } from "@/src/components/ui/SearchFilter";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { itemPaginated } from "@/src/api/endpoints/item";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import ItemCard from "@/src/components/ui/ItemCard";
import { useState, useRef, useEffect, useCallback } from "react";
import { SearchRequest, FilterType, Item } from "@/src/types/item";
import { SearchNotFound } from "@/src/components/ui/SearchNotFound";

export default function SearchPage() {
    const [filters, setFilters] = useState<SearchRequest>({
        page: 0,
        sort: "findingAt,desc",
        size: 10,
        category: [],
        dateStart: null,
        dateEnd: null,
        donation: false,
        lastDays: null,
    });

    const [results, setResults] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const toggleFilter = () => setShowFilters((prev) => !prev);

    const fetchItems = useCallback(
        async (reset = false) => {
            if (loading) return;
            setLoading(true);

            const data = await itemPaginated(filters);

            setResults((prev) => {
                const combined = reset ? data : [...prev, ...data];

                const unique = Array.from(
                    new Map(combined.map((item) => [item.id, item])).values()
                );

                return unique;
            });

            setHasMore(data.length === filters.size);
            setLoading(false);
        },
        [filters, loading]
    );

    const updateFilters = (patch: Partial<SearchRequest>) => {
        setFilters((prev) => ({ ...prev, ...patch, page: 0 }));
    };

    const handleCategorySelection = (categories: string[]) =>
        updateFilters({ category: categories });

    const handleDateChange = (start: Date | null, end: Date | null) =>
        updateFilters({ dateStart: start, dateEnd: end });

    const handleToggleChange = () =>
        updateFilters({ donation: !filters.donation });

    const handleNumberChange = (lastDays: number | null) =>
        updateFilters({ lastDays });

    const handleCleanFilters = () => {
        setFilters({
            page: 0,
            sort: "findingAt,desc",
            size: 40,
            category: [],
            dateStart: null,
            dateEnd: null,
            donation: false,
            lastDays: null,
        });
        setActiveFilters([]);
    };

    useEffect(() => {
        fetchItems(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        if (showFilters) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilters]);

    useEffect(() => {
        const el = scrollAreaRef.current;
        if (!el) return;
        const handleScroll = () => {
            if (loading || !hasMore) return;
            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
            if (nearBottom) {
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
            }
        };
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    useEffect(() => {
        const af: FilterType[] = [];
        if (filters.category.length) af.push("categoria");
        if (filters.dateStart && filters.dateEnd) af.push("data");
        if (filters.donation) af.push("donation");
        if (filters.lastDays != null) af.push("lastDays");
        setActiveFilters(af);
    }, [filters]);

    useEffect(() => {
        if (filters.page > 0) {
            fetchItems(false);
        }
    }, [filters.page]);

    return (
        <section className="flex flex-col flex-1 min-h-0 p-5 pb-0">
            <SearchBar />

            <div className="relative mt-2 flex flex-col flex-1 min-h-0">
                <div
                    id="filterBar"
                    className={`transition-opacity duration-300 ${showFilters ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}
                >
                    <FilterBar active={activeFilters} onSelect={toggleFilter} />
                </div>

                <div
                    id="filterForm"
                    ref={filterRef}
                    className={`absolute top-0 left-0 right-0 z-50 bottom-0 bg-white dark:bg-neutral-900 md:bg-transparent lg:max-w-[450px] w-full transition-all duration-300 transform ${showFilters
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                >
                    <div className="filter-scroll overscroll-y-contain touch-pan-y rounded-xl bg-white dark:bg-neutral-900">
                        <SearchFilter
                            handleCategorySelection={handleCategorySelection}
                            handleDateSelection={handleDateChange}
                            handleNumberChange={handleNumberChange}
                            handleToggleChange={handleToggleChange}
                            handleSubmit={() => fetchItems(true)}
                            handleCleanFilters={handleCleanFilters}
                        />
                    </div>
                </div>

                <h2 className="mt-4 text-lg font-bold">Resultados da busca</h2>
                <ScrollableArea ref={scrollAreaRef} className="pt-4 mt-4">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-3 justify-center place-items-center">
                            {results.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    id={item.id}
                                    picture={item.picture}
                                    description={item.description}
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && <SearchNotFound />
                    )}

                    {loading && (
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                            Carregando…
                        </p>
                    )}
                </ScrollableArea>
            </div>
        </section>
    );
}
