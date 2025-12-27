"use client";

import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!trackRef.current) return;
        isDownRef.current = true;
        startXRef.current = e.clientX;
        startScrollLeftRef.current = trackRef.current.scrollLeft;
    };

    const onMouseUp = () => {
        isDownRef.current = false;
    };
    const onMouseLeave = () => {
        isDownRef.current = false;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDownRef.current || !trackRef.current) return;
        const dx = e.clientX - startXRef.current;
        trackRef.current.scrollLeft = startScrollLeftRef.current - dx;
    };

    const getStep = () => {
        const track = trackRef.current;
        if (!track) return 160; // fallback

        // first card wrapper (your map renders direct children with w-[140px]/w-[160px])
        const first = track.querySelector<HTMLElement>('[data-carousel-item="true"]');
        if (!first) return 160;

        const firstRect = first.getBoundingClientRect();
        const second = first.nextElementSibling as HTMLElement | null;

        // if we have a second element, use distance between starts (includes gap)
        if (second) {
            const secondRect = second.getBoundingClientRect();
            const delta = Math.round(secondRect.left - firstRect.left);
            return delta > 0 ? delta : Math.round(firstRect.width);
        }

        return Math.round(firstRect.width);
    };

    const scrollByDir = (dir: "left" | "right") => {
        const track = trackRef.current;
        if (!track) return;

        const step = getStep();
        track.scrollBy({
            left: dir === "left" ? -step : step,
            behavior: "smooth",
        });
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

            <div className="relative group">
                {items.length > 0 && (
                    <button
                        type="button"
                        aria-label="Scroll left"
                        onClick={() => scrollByDir("left")}
                        className="
                            hidden md:grid
                            absolute left-0 top-0 z-10 h-full w-10 place-items-center
                            opacity-0 pointer-events-none
                            group-hover:opacity-100 group-hover:pointer-events-auto
                            transition-opacity
                            text-gray-700 dark:text-gray-200
                            bg-gradient-to-r from-white/90 to-transparent
                            dark:from-neutral-900/90
                        "
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {items.length > 0 && (
                    <button
                        type="button"
                        aria-label="Scroll right"
                        onClick={() => scrollByDir("right")}
                        className="
                        hidden md:grid
                        absolute right-0 top-0 z-10 h-full w-10 place-items-center
                        opacity-0 pointer-events-none
                        group-hover:opacity-100 group-hover:pointer-events-auto
                        transition-opacity
                        text-gray-700 dark:text-gray-200
                        bg-gradient-to-l from-white/90 to-transparent
                        dark:from-neutral-900/90
                    "
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                <div
                    ref={trackRef}
                    role="region"
                    aria-label={title || "Carousel"}
                    className="
                        relative flex overflow-x-auto overflow-y-hidden
                        snap-x snap-mandatory scroll-smooth pb-2
                        gap-8 md:gap-4
                        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                        [touch-action:pan-x] select-none
                        md:px-10
                    "
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                >
                    {items.map((item, idx) => (
                        <div
                            key={(item.id as unknown as string) ?? idx}
                            data-carousel-item="true"
                            className="snap-start flex-none shrink-0 w-[140px] md:w-[160px]"
                        >
                            <ItemCard id={item.id} picture={item.picture} description={item.description} time={item.time} />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
