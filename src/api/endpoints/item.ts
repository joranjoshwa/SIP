import { ItemPage, CarouselItem } from "../../types/item";
import { CategoryEnum } from "@/src/enums/category";
import { api } from "../axios";

export const itemFromLast48Hours = async (category: string): Promise<CarouselItem[]> => {
    const normalized = category?.toUpperCase();
    const enumValue = normalized ? CategoryEnum[normalized as keyof typeof CategoryEnum] : undefined;

    const categoryParam = enumValue ? `&category=${enumValue}` : "";
    const result: ItemPage = await api.get(`/items?page=0&size=10${categoryParam}&lastDays=2`);
    const items = result.data.content.map(item => {
        return {
            id: item.id,
            description: item.description,
            picture: item.pictures[0],
        };
    });
    return items as CarouselItem[];
}

export const itemAboutToBeDonated = async (category: string): Promise<CarouselItem[]> => {
    const normalized = category?.toUpperCase();
    const enumValue = normalized ? CategoryEnum[normalized as keyof typeof CategoryEnum] : undefined;

    const categoryParam = enumValue ? `&category=${enumValue}` : "";
    const result: ItemPage = await api.get(`/items?page=0&size=10${categoryParam}&aboutToBeDonated=true`);
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
    return items as CarouselItem[];
}
