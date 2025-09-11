import { UUID } from "crypto";
import { ItemPage } from "../../types/item";
import { extractEmailFromToken } from "../../utils/token";
import { api } from "../axios";

export type Items = {
    id?: UUID;
    picture: string;
    description: string;
    time?: number;
};

const CategoryEnum: Record<string, string> = {
    GARRAFA: "BOTTLE",
    ROUPA: "CLOTHING",
    ELETRONICO: "ELECTRONIC",
    ACESSORIO: "ACCESSORY",
    VASILHA: "CONTAINER",
    LIVRO: "BOOK",
    MATERIAL: "SCHOOL_SUPPLY",
    DOCUMENTO: "DOCUMENT",
    OUTROS: "OTHER",
};

export const itemFromLast48Hours = async (category: string): Promise<Items[]> => {
    const categoryParam = category ? `&category=${CategoryEnum[category.toUpperCase()]}` : "";
    const result: ItemPage = await api.get(`/items?page=0&size=10${categoryParam}&lastDays=2`);
    const items = result.data.content.map(item => {
        return {
            id: item.id,
            description: item.description,
            picture: item.pictures[0],
        };
    });
    return items as Items[];
}

export const itemAboutToBeDonated = async (category: string): Promise<Items[]> => {
    const categoryParam = category ? `&category=${CategoryEnum[category.toUpperCase()]}` : "";
    const result: ItemPage = await api.get(`/items?page=0&size=10${categoryParam}&aboutToBeDonated=true${categoryParam}`);
    console.log(result);
    const items = result.data.content.map(item => {
        return {
            id: item.id,
            description: item.description,
            picture: item.pictures[0],
            time: Math.ceil(
                (new Date(item.donationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ),
        };
    });
    return items as Items[];
}
