"use client";

import { SearchBar } from "@/src/components/ui/SearchBar";
import { SearchFilter } from "@/src/components/ui/SearchFilter";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { itemPaginated } from "@/src/api/endpoints/item";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import ItemCard from "@/src/components/ui/ItemCard";
import { useState, useRef, useEffect } from "react";
import { SearchRequest, FilterType } from "@/src/types/item";

export default function SearchPage() {
    const [filters, setFilters] = useState<SearchRequest>({
        page: 0,
        sort: "findingAt,desc",
        size: 40,
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

    const toggleFilter = () => setShowFilters((prev) => !prev);

    const handleCategorySelection = (categories: string[]) => {
        setFilters((prev) => ({ ...prev, category: categories }));
    };

    const handleDateChange = (start: Date | null, end: Date | null) => {
        setFilters((prev) => ({ ...prev, dateStart: start, dateEnd: end }));
    };

    useEffect(() => {
        handleSubmit();
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

    const handleSubmit = async () => {
        const result = await itemPaginated(filters);
        const activeFilters: FilterType[] = [];
        if (filters.category.length !== 0) {
            activeFilters.push("categoria");
        }
        if (filters.dateStart !== null && filters.dateEnd !== null) {
            activeFilters.push("data");
        }
        if (filters.donation) {
            activeFilters.push("donation");
        }
        if(filters.lastDays != null) {
            activeFilters.push("lastDays");
        }

        setActiveFilters(activeFilters);
        setResults(result || []);
    };
    const handleToggleChange = () => {
        setFilters((prev) => ({ ...prev, donation: !prev.donation }));
    };

    const handleNumberChange = (lastDays: number | null) => {
        setFilters((prev) => ({ ...prev, lastDays }));
    }

    return (
        <section className="flex flex-col flex-1 min-h-0 p-5">
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
                    className={`absolute top-0 left-0 right-0 z-50 lg:max-w-[450px] w-full transition-all duration-300 transform ${showFilters
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
                            handleSubmit={handleSubmit}
                            handleCleanFilters={handleCleanFilters}
                        />
                    </div>
                </div>

                <h2 className="mt-4 text-lg font-bold">Resultados da busca</h2>

                <ScrollableArea className="pt-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-3 justify-center">
                        {results && results.length > 0 ? (
                            results.map((item, idx) => (
                                <ItemCard
                                    key={item.id || idx}
                                    picture={item.picture}
                                    description={item.description}
                                />
                            ))
                        ) : (
                            <p>Faça uma pesquisa</p>
                        )}
                    </div>
                </ScrollableArea>
            </div>
        </section>
    );
}
