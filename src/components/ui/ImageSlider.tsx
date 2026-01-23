"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ImageOff } from "lucide-react";
import { ItemDTO } from "@/src/types/item";

interface ImageSliderProps {
    item: ItemDTO;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ item }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const count = item.pictures.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === count - 1;

    const nextImage = () => {
        if (count <= 1 || isLast) return;
        setCurrentIndex((p) => p + 1);
    };

    const prevImage = () => {
        if (count <= 1 || isFirst) return;
        setCurrentIndex((p) => p - 1);
    };

    const startXRef = useRef<number | null>(null);
    const startYRef = useRef<number | null>(null);
    const THRESHOLD_PX = 50;

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (count <= 1) return;
        if (e.pointerType === "mouse") return;

        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
        setIsDragging(true);
        setDragX(0);

        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        if (startXRef.current == null || startYRef.current == null) return;

        const dx = e.clientX - startXRef.current;
        const dy = e.clientY - startYRef.current;

        if (Math.abs(dy) > Math.abs(dx)) return;

        setDragX(dx);
    };

    const onPointerUpOrCancel = () => {
        if (!isDragging) return;

        // swipe left => next (only if not last)
        if (dragX <= -THRESHOLD_PX && !isLast) nextImage();
        // swipe right => prev (only if not first)
        else if (dragX >= THRESHOLD_PX && !isFirst) prevImage();

        setIsDragging(false);
        setDragX(0);
        startXRef.current = null;
        startYRef.current = null;
    };

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL as string;

    if (count === 0) {
        return (
            <div className="relative w-full h-64 md:h-[60vh] md:w-[80%] rounded-xl overflow-hidden flex items-center justify-center text-gray-400 dark:text-gray-600">
                <ImageOff className="w-16 h-16 md:w-20 md:h-20" />
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-64 md:h-[60vh] md:w-[80%] rounded-xl overflow-hidden"
            style={{ touchAction: "pan-y" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrCancel}
            onPointerCancel={onPointerUpOrCancel}
        >
            <div
                className={[
                    "h-full w-full flex",
                    isDragging ? "" : "transition-transform duration-300 ease-out",
                ].join(" ")}
                style={{
                    transform: `translateX(calc(${-currentIndex * 100}% + ${dragX}px))`,
                }}
            >
                {item.pictures.map((pic, idx) => (
                    <div key={pic.id ?? `${pic.url}-${idx}`} className="relative h-full w-full flex-shrink-0">
                        <Image
                            src={baseUrl + (pic.url as string)}
                            alt={item.description || "Item sem descrição"}
                            fill
                            className="object-contain object-center"
                            draggable={false}
                            priority={idx === currentIndex}
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {count > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        type="button"
                        aria-label="Imagem anterior"
                        disabled={isFirst}
                        className={[
                            "absolute left-0 top-0 bottom-0 flex items-center justify-center w-10 transition",
                            isFirst ? "opacity-30 pointer-events-none" : "opacity-100",
                        ].join(" ")}
                    >
                        <ChevronLeft className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]" />
                    </button>

                    <button
                        onClick={nextImage}
                        type="button"
                        aria-label="Próxima imagem"
                        disabled={isLast}
                        className={[
                            "absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 transition",
                            isLast ? "opacity-30 pointer-events-none" : "opacity-100",
                        ].join(" ")}
                    >
                        <ChevronRight className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]" />
                    </button>
                </>
            )}
        </div>
    );
};
