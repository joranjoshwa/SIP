"use client"

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImageOff } from "lucide-react";
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

            <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full"
            >
                <ArrowLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full"
            >
                <ArrowRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white">
                {currentIndex + 1} / {item.pictures.length}
            </div>
        </div>
    );
};
