type RequestStatus = "APPROVED" | "REJECTED" | "PENDING";

interface ItemRequest {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    date: string;
    status: RequestStatus;
}
