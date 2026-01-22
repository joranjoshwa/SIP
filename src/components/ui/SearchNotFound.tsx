"use client";

import Image from "next/image";
import { useTheme } from "@/src/context/ThemeContext";
import imageSrc from "@/src/assets/noItems.png";

type Props = {
    title?: string;
    description?: string;
};

export const SearchNotFound = ({
    title = "Lista vazia",
    description = "Parece que seu item não está aqui ainda! Espere até amanhã ou tente pesquisar outras palavras chave.",
}: Props) => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="mb-4">
                <Image
                    src={imageSrc}
                    alt="Lista vazia"
                    width={480}
                    height={480}
                />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {title}
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {description}
            </p>
        </div>
    );
};
