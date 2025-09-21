"use client";

import { SearchBar } from "@/src/components/ui/SearchBar";
import { SearchFilter } from "@/src/components/ui/SearchFilter";
import { useState } from "react";

export default function SearchPage() {
    const [chosenCategory, setChosenCategory] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const handleCategorySelection = (categories: string[]) => {
        setChosenCategory(categories);
    };

    return (
        <section className="p-5">
            <SearchBar />
            <div>
                
            </div>
            <div className="lg:max-w-[450px]">
                {/*<SearchFilter handleCategorySelection={ handleCategorySelection }/>*/}
            </div>
        </section>
    );
}
