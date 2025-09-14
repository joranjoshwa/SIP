"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ItemCard from "./ItemCard";
import { CarouselItem } from "../../types/item";

export type Props = {
    title: string;
    items: CarouselItem[];
};

export function ItemCarousel({ title = "", items = [] }: Props) {
    const trackRef = useRef<HTMLDivElement | null>(null);

    return (
        <section className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 md:text-[16px]">{title}</h2>
                <div className="flex gap-2">
                    <Link
                        aria-label="Next"
                        href="/"
                        className="p-2 text-gray-700 dark:text-gray-200"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Track */}
            <div
                ref={trackRef}
                className="relative flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollbarWidth: "none" }}
            >
                {/* Hide scrollbar*/}
                <style jsx>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {items.map((item, idx) => (
                    <div key={(item.id as unknown as string) ?? idx} className="snap-start shrink-0">
                        <ItemCard
                            picture={item.picture}
                            description={item.description}
                            time={item.time}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
