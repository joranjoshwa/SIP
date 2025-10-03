export type PaginatedApiResponse<T> = {
    data: {
        content: T[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                empty: boolean;
                unsorted: boolean;
                sorted: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        last: boolean;
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
        sort: {
            empty: boolean;
            unsorted: boolean;
            sorted: boolean;
        };
        first: boolean;
        numberOfElements: number;
        empty: boolean;
    }
}

export type ItemStatus = 'DISPONIBLE' | 'CLAIMED' | 'CHARITY';
export type DayPeriod = 'MORNING' | 'AFTERNOON' | 'NIGHT';
export type Category = 'BOTTLE' | 'CLOTHING' | 'ELECTRONIC' | 'ACCESSORY' | 'CONTAINER' | 'BOOK' | 'SCHOOL_SUPPLY' | 'DOCUMENT' | 'OTHER';
export type Area = 'RC' | 'BLOCK_ONE' | 'BLOCK_TWO' | 'BLOCK_THREE' | 'BLOCK_FOUR' | 'BLOCK_FIVE' | 'BLOCK_SIX' | 'BLOCK_SEVEN' | 'BLOCK_EIGHT' | 'BLOCK_NINE' | 'LIBRARY' | 'VIDEO_ROOM';

export interface ItemDTO {
    id: string;
    description: string;
    findingAt: string;
    donationDate: string;
    status: ItemStatus;
    dayPeriod: DayPeriod;
    category: Category;
    area: Area;
    dateReturned: string | null;
    code: string;
    pictures: {
        url: string | null,
        id: UUID,
    }[];
    owner: null | {
        id?: string;
        name?: string;
    };
}

export type UUID = string;

export type CarouselItem = {
    id?: UUID;
    picture: string | null;
    description: string;
    time?: number;
};

export type Item = {
    id: string;
    description: string;
    donationDate?: string;
    time?: number | undefined;
    picture?: { id: string, url: string };
};

export type ItemPage = PaginatedApiResponse<ItemDTO>;

export type ApiResponse<T> = T[] | { content: T[] };

export type SearchRequest = {
    page: number;
    sort: string;
    size: number;
    category: string[];
    dateStart: Date | null;
    dateEnd: Date | null;
    donation: boolean;
    lastDays: number | null;
};

export type ItemCard = {
    id?: UUID;
    picture: string | null;
    description: string;
    time?: number
};

export type FilterType = "categoria" | "data" | "local" | "donation" | "lastDays";
