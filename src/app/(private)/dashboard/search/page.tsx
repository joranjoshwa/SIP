"use client";

import { SearchBar } from "@/src/components/ui/SearchBar";
import { SearchFilter } from "@/src/components/ui/SearchFilter";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { useState, useRef, useEffect } from "react";

export default function SearchPage() {
    const [chosenCategory, setChosenCategory] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const handleCategorySelection = (categories: string[]) => {
        setChosenCategory(categories);
    };

    const toggleFilter = () => {
        setShowFilters((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node)
            ) {
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

    return (
        <section className="p-5">
            <SearchBar />

            <div className="relative mt-2" ref={filterRef}>
                <div
                    id="filterBar"
                    className={`transition-opacity duration-300 ${showFilters ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}
                >
                    <FilterBar active="categoria" onSelect={toggleFilter} />
                </div>

                <div
                    id="filterForm"
                    className={`absolute top-0 lg:max-w-[450px] w-full transition-all duration-300 transform ${showFilters
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                        }`}
                >
                    <SearchFilter handleCategorySelection={handleCategorySelection} />
                </div>
            </div>
        </section>
    );
}
