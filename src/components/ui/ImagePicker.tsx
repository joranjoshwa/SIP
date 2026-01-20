"use client";

import { useRef } from "react";
import UploadDark from "@/src/assets/uploadDark.png"
import UploadWhite from "@/src/assets/uploadWhite.png"
import Image from "next/image";
import { useTheme } from "@/src/context/ThemeContext";

type Props = {
    images: { preview: string }[];
    onAddImages: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
    maxImages?: number;
};

export function ImagePicker({
    images,
    onAddImages,
    onRemoveImage,
    maxImages = 3,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { theme } = useTheme();
    const uploadSrc = theme === "dark" ? UploadWhite : UploadDark;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        onAddImages(Array.from(e.target.files));
        e.target.value = "";
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagens do item (até {maxImages})
            </label>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleInputChange}
            />

            <div className="w-full px-3 py-3.5 rounded-xl bg-[#ECECEC] dark:bg-[#292929] flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 transition"
                >
                    <Image
                        src={uploadSrc}
                        alt="Upload"
                        width={18}
                        height={18}
                        className="object-contain"
                    />
                </button>

                <div className="flex gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="relative shrink-0">
                            <img
                                src={img.preview}
                                alt="Preview"
                                className="h-14 w-14 rounded-md object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => onRemoveImage(index)}
                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:scale-110 transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
