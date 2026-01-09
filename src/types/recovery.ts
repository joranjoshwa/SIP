export type Picture = {
    id: string;
    url: string;
};

export type Owner = {
    name: string;
    cpf: string;
    email: string;
    role: string;
    statusMember: string;
    phone: string;
    profileImageUrl: string;
    registrationDate: string;
};

export type Item = {
    id: string;
    description: string;
    findingAt: string;
    donationDate: string;
    status: string;
    dayPeriod: string;
    category: string;
    area: string;
    dateReturned: string;
    code: string;
    pictures: Picture[];
    owner: Owner;
};

export type User = {
    name: string;
    cpf: string;
    email: string;
    role: string;
    statusMember: string;
    phone: string;
    profileImageUrl: string;
    registrationDate: string;
};

export type RecoveryRequest = {
    id: string;
    description: string;
    status: "PENDING" | "APPROVED" | "REFUSED";
    requestDate: string;
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

export type ReviewRecoveryPayload = {
    idRecovery: string;
    statusRecovery: "APPROVED" | "REFUSED";
};