"use client"

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ImageOff } from "lucide-react";
import { ItemDTO } from "@/src/types/item";

interface ImageSliderProps {
    item: ItemDTO;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ item }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % item.pictures.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + item.pictures.length) % item.pictures.length
        );
    };


    return (
        <div className="relative w-full h-64 md:h-[60vh] md:w-[80%] rounded-xl overflow-hidden">
            {item.pictures.length > 0 ? (
                <Image
                    src={item.pictures[currentIndex].url as string}
                    alt={item.description || "Item sem descrição"}
                    fill
                    className="object-contain object-center rounded-xl"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                    <ImageOff className="w-16 h-16 md:w-20 md:h-20" />
                </div>
            )}

            {item.pictures.length > 1 && (
                <button
                    onClick={prevImage}
                    className="absolute left-0 top-0 bottom-0
                            flex items-center justify-center
                            w-10 rounded-full"
                >
                    <ChevronLeft
                        className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]"
                    />
                </button>
            )}

            {item.pictures.length > 1 && (
                <button
                    onClick={nextImage}
                    className="absolute right-0 top-0 bottom-0
                            flex items-center justify-center
                            w-10 rounded-full"
                >
                    <ChevronRight
                        className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]"
                    />
                </button>
            )}

        </div>
    );
};
