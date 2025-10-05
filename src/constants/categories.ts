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
import { CategoryEnum } from "../enums/category";

export const categories = [
    {
        key: "garrafa",
        label: "Garrafa",
        Icon: CupSoda,
        bg: "bg-[#D0F0F9]",
        bgDark: "dark:bg-[#00495D]",
        ring: "ring-[#D0F0F9] dark:ring-[#00495D]",
    },
    {
        key: "roupa",
        label: "Roupa",
        Icon: Shirt,
        bg: "bg-[#F9D0D0]",
        bgDark: "dark:bg-[#570000]",
        ring: "ring-[#F9D0D0] dark:ring-[#570000]",
    },
    {
        key: "eletronico",
        label: "Eletrônico",
        Icon: Zap,
        bg: "bg-[#FDF6C2]",
        bgDark: "dark:bg-[#594E00]",
        ring: "ring-[#FDF6C2] dark:ring-[#594E00]",
    },
    {
        key: "acessorio",
        label: "Acessório",
        Icon: Glasses,
        bg: "bg-[#D0F9EF]",
        bgDark: "dark:bg-[#005641]",
        ring: "ring-[#D0F9EF] dark:ring-[#005641]",
    },
    {
        key: "vasilha",
        label: "Vasilha",
        Icon: Salad,
        bg: "bg-[#D4F9D0]",
        bgDark: "dark:bg-[#064800]",
        ring: "ring-[#D4F9D0] dark:ring-[#064800]",
    },
    {
        key: "livro",
        label: "Livro",
        Icon: BookMarked,
        bg: "bg-[#F9E9D0]",
        bgDark: "dark:bg-[#4A2E00]",
        ring: "ring-[#F9E9D0] dark:ring-[#4A2E00]",
    },
    {
        key: "material",
        label: "Material",
        Icon: NotebookPen,
        bg: "bg-[#E2D0F9]",
        bgDark: "dark:bg-[#21004D]",
        ring: "ring-[#E2D0F9] dark:ring-[#21004D]",
    },
    {
        key: "documento",
        label: "Documento",
        Icon: SquareUserRound,
        bg: "bg-[#FFE2F7]",
        bgDark: "dark:bg-[#55003D]",
        ring: "ring-[#FFE2F7] dark:ring-[#55003D]",
    },
    {
        key: "outros",
        label: "Outros",
        Icon: FileQuestion,
        bg: "bg-[#EDEDED]",
        bgDark: "dark:bg-[#4B0000]",
        ring: "ring-[#EDEDED] dark:ring-[#4B0000]",
    },
] as const;

export const CategoryLabels: Record<CategoryEnum, string> = {
    [CategoryEnum.GARRAFA]: "Garrafa",
    [CategoryEnum.ROUPA]: "Roupa",
    [CategoryEnum.ELETRONICO]: "Eletrônico",
    [CategoryEnum.ACESSORIO]: "Acessório",
    [CategoryEnum.VASILHA]: "Vasilha",
    [CategoryEnum.LIVRO]: "Livro",
    [CategoryEnum.MATERIAL]: "Material escolar",
    [CategoryEnum.DOCUMENTO]: "Documento",
    [CategoryEnum.OUTROS]: "Outros",
} as const;

export type CategoryKey = (typeof categories)[number]["key"];
