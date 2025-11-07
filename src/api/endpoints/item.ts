import type { ItemPage, CarouselItem, SearchRequest, ItemCard, ItemDTO, CreateItemRequest, ItemResponse, UUID } from "../../types/item";
import { CategoryEnum } from "@/src/enums/category";
import { api } from "../axios";

const getCategoryEnum = (category?: string) => {
    if (!category) return undefined;
    const normalized = category.toUpperCase();
    return CategoryEnum[normalized as keyof typeof CategoryEnum];
};

const toCarouselItem = (item: ItemDTO): CarouselItem => ({
    id: item.id,
    description: item.description,
    picture: item.pictures[0]?.url || null,
});

const fetchItems = async <T extends CarouselItem | ItemCard>(
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
    console.log(data);
    return data.content.map(mapper);
};

export const itemFromLast48Hours = async (category: string): Promise<CarouselItem[]> => {
    return fetchItems(
        {
            page: 0,
            size: 10,
            lastDays: 2,
            category: getCategoryEnum(category),
        },
        toCarouselItem
    );
};

export const itemAboutToBeDonated = async (category: string): Promise<CarouselItem[]> => {
    return fetchItems(
        {
            page: 0,
            size: 10,
            aboutToBeDonated: true,
            category: getCategoryEnum(category),
        },
        (item) => ({
            ...toCarouselItem(item),
            time: Math.ceil(
                (new Date(item.donationDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            ),
        })
    );
};

export const itemPaginated = async (filters: SearchRequest): Promise<ItemCard[]> => {
    const params: Record<string, string | number | boolean | undefined> = {
        page: filters.page,
        sort: filters.sort,
        size: filters.size,
        aboutToBeDonated: filters.donation,
        dateStart: filters.dateStart?.toISOString(),
        dateEnd: filters.dateEnd?.toISOString(),
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
    return data.content.map((item: ItemDTO) => ({
        id: item.id,
        description: item.description,
        picture: item.pictures[0]?.url || null,
    })) as ItemCard[];
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

export const itemForDonation = async (category: string): Promise<CarouselItem[]> => {
    return fetchItems(
        {
            page: 0,
            size: 10,
            status: "CHARITY",
            category: getCategoryEnum(category),
        },
        toCarouselItem
    );
};

export const editItem = async (
    itemId: string,
    data: {
        description?: string;
        category?: string;
        area?: string;
    },
    token: string
): Promise<ItemResponse> => {
    const response = await api.put<ItemResponse>(
        `/items/admin/edit/${itemId}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};