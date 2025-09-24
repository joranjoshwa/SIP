import type { ItemPage, CarouselItem, SearchRequest, ItemCard, ItemDTO } from "../../types/item";
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

export const itemPaginated = async (filters: SearchRequest): Promise<ItemCard[]> => {
    const params = new URLSearchParams();

    params.set("page", filters.page.toString());
    params.set("sort", filters.sort);
    params.set("size", filters.size.toString());
    params.set("aboutToBeDonated", filters.donation.toString());

    if (filters.category.length > 0) {
        filters.category.forEach((cat) => params
            .append("category", CategoryEnum[cat.toUpperCase() as keyof typeof  CategoryEnum]));
    }

    if (filters.dateStart) {
        params.set("dateStart", filters.dateStart.toISOString());
    }
    if (filters.dateEnd) {
        params.set("dateEnd", filters.dateEnd.toISOString());
    }

    if (filters.lastDays) {
        params.set("lastDays", filters.lastDays.toString());
    }

    const { data } = await api.get(`/items?${params.toString()}`);
    const items = data.content.map((item: ItemDTO) => {
        return {
            id: item.id,
            description: item.description,
            picture: item.pictures[0],
        };
    });

    return items as ItemCard[];
};
