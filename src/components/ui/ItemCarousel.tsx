"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import ItemCard from "./ItemCard";
import type { CarouselItem } from "../../types/item";

export type Props = {
    title: string;
    items: CarouselItem[];
    seeAllHref?: string;
};

export function ItemCarousel({ title = "", items = [], seeAllHref }: Props) {
    const trackRef = useRef<HTMLDivElement | null>(null);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startScrollLeft, setStartScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!trackRef.current) return;
        setIsDown(true);
        setStartX(e.clientX);
        setStartScrollLeft(trackRef.current.scrollLeft);
    };
    const onMouseLeave = () => setIsDown(false);
    const onMouseUp = () => setIsDown(false);
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !trackRef.current) return;
        const dx = e.clientX - startX;
        trackRef.current.scrollLeft = startScrollLeft - dx;
    };

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 md:text-[16px]">
                    {title}
                </h2>
                <div className="flex gap-2">
                    {seeAllHref && (
                        <Link
                            aria-label="Ver todos"
                            href={seeAllHref}
                            className="p-2 text-gray-700 dark:text-gray-200"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>

            <div
                ref={trackRef}
                role="region"
                aria-label={title || "Carousel"}
                className="
                    relative flex gap-1 overflow-x-auto overflow-y-hidden
                    snap-x snap-mandatory scroll-smooth pb-2 gap-8 md:gap-4
                    [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                    [touch-action:pan-x] select-none
                "
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                {items.map((item, idx) => (
                    <div
                        key={(item.id as unknown as string) ?? idx}
                        className="snap-start flex-none shrink-0 w-[140px] md:w-[160px]"
                    >
                        <ItemCard id={item.id} picture={item.picture} description={item.description} time={item.time} />
                    </div>
                ))}
            </div>
        </section>
    );
}
