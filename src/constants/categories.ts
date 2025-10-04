import {
    CupSoda,
    Shirt,
    Zap,
    Glasses,
    Salad,
    BookMarked,
    NotebookPen,
    SquareUserRound,
    FileQuestion,
} from "lucide-react";
import { Category } from "../types/item";

export const categories = [
    {
        key: "garrafa",
        label: "Garrafa",
        backend: "BOTTLE" as Category,
        Icon: CupSoda,
        bg: "bg-[#D0F0F9]",
        bgDark: "dark:bg-[#00495D]",
        ring: "ring-[#D0F0F9] dark:ring-[#00495D]",
    },
    {
        key: "roupa",
        label: "Roupa",
        backend: "CLOTHING" as Category,
        Icon: Shirt,
        bg: "bg-[#F9D0D0]",
        bgDark: "dark:bg-[#570000]",
        ring: "ring-[#F9D0D0] dark:ring-[#570000]",
    },
    {
        key: "eletronico",
        label: "Eletrônico",
        backend: "ELECTRONIC" as Category,
        Icon: Zap,
        bg: "bg-[#FDF6C2]",
        bgDark: "dark:bg-[#594E00]",
        ring: "ring-[#FDF6C2] dark:ring-[#594E00]",
    },
    {
        key: "acessorio",
        label: "Acessório",
        backend: "ACCESSORY" as Category,
        Icon: Glasses,
        bg: "bg-[#D0F9EF]",
        bgDark: "dark:bg-[#005641]",
        ring: "ring-[#D0F9EF] dark:ring-[#005641]",
    },
    {
        key: "vasilha",
        label: "Vasilha",
        backend: "CONTAINER" as Category,
        Icon: Salad,
        bg: "bg-[#D4F9D0]",
        bgDark: "dark:bg-[#064800]",
        ring: "ring-[#D4F9D0] dark:ring-[#064800]",
    },
    {
        key: "livro",
        label: "Livro",
        backend: "BOOK" as Category,
        Icon: BookMarked,
        bg: "bg-[#F9E9D0]",
        bgDark: "dark:bg-[#4A2E00]",
        ring: "ring-[#F9E9D0] dark:ring-[#4A2E00]",
    },
    {
        key: "material",
        label: "Material",
        backend: "SCHOOL_SUPPLY" as Category,
        Icon: NotebookPen,
        bg: "bg-[#E2D0F9]",
        bgDark: "dark:bg-[#21004D]",
        ring: "ring-[#E2D0F9] dark:ring-[#21004D]",
    },
    {
        key: "documento",
        label: "Documento",
        backend: "DOCUMENT" as Category,
        Icon: SquareUserRound,
        bg: "bg-[#FFE2F7]",
        bgDark: "dark:bg-[#55003D]",
        ring: "ring-[#FFE2F7] dark:ring-[#55003D]",
    },
    {
        key: "outros",
        label: "Outros",
        backend: "OTHER" as Category,
        Icon: FileQuestion,
        bg: "bg-[#EDEDED]",
        bgDark: "dark:bg-[#4B0000]",
        ring: "ring-[#EDEDED] dark:ring-[#4B0000]",
    },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export const categoryKeyToCategory = (key: CategoryKey): Category => {
    const found = categories.find((c) => c.key === key);
    if (!found) throw new Error(`Categoria inválida: ${key}`);
    return found.backend;
};