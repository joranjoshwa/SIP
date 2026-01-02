type RequestStatus = "APPROVED" | "REFUSED" | "PENDING";

interface ItemRequest {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    date: string;
    status: RequestStatus;
}
