import type { ItemPage, CarouselItem, SearchRequest, ItemCard, ItemDTO, UUID, CreateItemRequest, ItemResponse, EditItemRequest } from "../../types/item";
import { CategoryEnum } from "@/src/enums/category";
import { api } from "../axios";
import { AxiosError } from "axios";

const getCategoryEnum = (category?: string) => {
    if (!category) return undefined;
    const normalized = category.toUpperCase();
    return CategoryEnum[normalized as keyof typeof CategoryEnum];
};

const toCarouselItem = (item: ItemDTO): CarouselItem => ({
    id: item.id,
    description: item.description,
    picture: item.pictures[0]?.url || null,
    date: item.findingAt,
});

const withTimeLeft = (item: ItemDTO): CarouselItem => ({
    ...toCarouselItem(item),
    time: Math.ceil(
        (new Date(item.donationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
});

const fetchItems = async <T>(
    params: Record<string, string | number | boolean | undefined>,
    mapper: (item: ItemDTO) => T
): Promise<T[]> => {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            search.append(key, String(value));
        }
    });

    const { data }: ItemPage = await api.get(`/items?${search.toString()}`);
    return data.content.map(mapper);
};

export const itemFromLast48Hours = async (
    category: string,
    page: number = 0,
    size: number = 10
): Promise<CarouselItem[]> => {
    return fetchItems(
        {
            page,
            size,
            startPeriod: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            category: getCategoryEnum(category),
        },
        toCarouselItem
    );
};

export const itemAboutToBeDonated = async (
    category: string,
    page: number = 0,
    size: number = 10
): Promise<CarouselItem[]> => {
    return fetchItems(
        {
            page,
            size,
            aboutToBeDonated: true,
            category: getCategoryEnum(category),
        },
        withTimeLeft
    );
};

export const itemForDonation = async (
    category: string,
    page: number = 0,
    size: number = 10
): Promise<CarouselItem[]> => {
    return fetchItems(
        {
            page, 
            size, 
            status: "CHARITY", 
            category: category ? getCategoryEnum(category) : undefined,
        },
        withTimeLeft
    );
};


export const itemPaginated = async (filters: SearchRequest): Promise<ItemCard[]> => {
    const params: Record<string, string | number | boolean | undefined> = {
        page: filters.page,
        sort: filters.sort,
        size: filters.size,
        aboutToBeDonated: filters.donation,
        itemName: filters.itemName ?? undefined,
        startPeriod: filters.dateStart?.toISOString().split('T')[0],
        endPeriod: filters.dateEnd?.toISOString().split('T')[0],
        lastDays: filters.lastDays ?? undefined,
    };

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) search.set(key, String(value));
    });
    filters.category.forEach((cat) =>
        search.append("category", getCategoryEnum(cat)!)
    );

    const { data } = await api.get(`/items?${search.toString()}`);
    return data.content.map((item: ItemDTO) => {
        const timeMs = new Date(item.donationDate).getTime() - Date.now();
        const days = Math.ceil(timeMs / (1000 * 60 * 60 * 24));
        return {
            id: item.id,
            description: item.description,
            picture: item.pictures[0]?.url || null,
            date: item.findingAt,
            time: days,
        }
    }) as ItemCard[];
};

export const createItem = async (data: CreateItemRequest, token: string): Promise<ItemResponse> => {
    const response = await api.post<ItemResponse>("/items/admin/create", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const uploadItemImage = async (itemId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("itemImages", file);

    await api.post(`/items/admin/images/${itemId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const singleItem = async (id: UUID, token: string): Promise<ItemDTO> => {
    const { data } = await api.get<ItemDTO>(`/items/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
}

export const editItem = async (
    itemId: string,
    data: EditItemRequest,
): Promise<ItemResponse> => {
    const response = await api.put<ItemResponse>(
        `/items/admin/edit/${itemId}`,
        data
    );
    return response.data;
};

export const deleteItem = async (itemId: string, token: string) => {
    try {
        await api.delete(`/items/root/delete/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        throw new Error(apiMsg ?? e.message ?? "Failed to delete item");
    }
}