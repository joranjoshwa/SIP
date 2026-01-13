export type Picture = {
    id: string;
    url: string;
};

export type UserRole = "ROOT" | "ADMIN" | "COMMON";
export type MemberStatus = "ACTIVE" | "INACTIVE";

export type Owner = {
    name: string;
    cpf: string | null;
    email: string;
    role: UserRole;
    statusMember: MemberStatus;
    phone: string | null;
    profileImageUrl: string | null;
    registrationDate: string;
};

export type ItemStatus = "DISPONIBLE" | "CLAIMED" | "CHARITY";
export type DayPeriod = "MORNING" | "AFTERNOON" | "NIGHT";

export type Category =
    | "BOTTLE"
    | "CLOTHING"
    | "ELECTRONIC"
    | "ACCESSORY"
    | "CONTAINER"
    | "BOOK"
    | "SCHOOL_SUPPLY"
    | "DOCUMENT"
    | "OTHER";

export type Area =
    | "LIBRARY"
    | "VIDEO_ROOM"
    | "BLOCK_ONE"
    | "BLOCK_THREE"
    | "BLOCK_FOUR"
    | "BLOCK_FIVE"
    | "BLOCK_SIX"
    | "BLOCK_SEVEN"
    | "BLOCK_NINE";

export type Item = {
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
    pictures: Picture[];
    owner: Owner;
};

export type User = {
    name: string;
    cpf: string | null;
    email: string;
    role: UserRole;
    statusMember: MemberStatus;
    phone: string | null;
    profileImageUrl: string | null;
    registrationDate: string;
};

export type RecoveryStatus = "PENDING" | "APPROVED" | "REFUSED";

export type RecoveryRequest = {
    id: string;
    description: string;
    status: RecoveryStatus;
    requestDate: string;
    pickupDate?: string;
    item: Item;
    user: User;
};

export type RecoveryResponse = {
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    size: number;
    content: RecoveryRequest[];
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
};

export type RecoveryScheduleResponse = {
    content: {
      recovery: {
        id: string;
        description: string;
        status: string;
        pickupDate: string;
        requestDate: string;
        item: {
          description: string;
          pictures?: { url: string }[];
        };
      }[];
    }[];
  };
export type RecoveryHistoryItem = {
    recoveryId: string;
    itemId: string;

    title: string;
    status: RecoveryStatus;
    createdAtIso?: string;
    pickup?: string;
    description?: string;

    imageUrl: string | null;

    code?: string;
    category?: Category;
    area?: Area;
    dayPeriod?: DayPeriod;
    itemStatus?: ItemStatus;
};

export type ReviewRecoveryPayload = {
    idRecovery: string;
    statusRecovery: Exclude<RecoveryStatus, "PENDING">;
};

export type SortInfo = {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
};

export type PageableInfo = {
    pageNumber: number;
    pageSize: number;
    sort: SortInfo;
    offset: number;
    paged: boolean;
    unpaged: boolean;
};

export type RecoveryHistoryContentItem = {
    recovery: RecoveryRequest[];
};

export type RecoveryHistoryApiResponse = {
    content: RecoveryHistoryContentItem[];

    pageable: PageableInfo;

    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;

    sort: SortInfo;

    numberOfElements: number;
    empty: boolean;
};

export type RecoveriesByUserFilters = {
    q?: string;
    category?: string[];
    status?: string | null;
    dateStart?: Date | null;
    dateEnd?: Date | null;
    page?: number;
    size?: number;
};

export type FilterGroup = "search" | "requestsSelf";