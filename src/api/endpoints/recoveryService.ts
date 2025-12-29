import { api } from "../axios";
import { RecoveryResponse, ReviewRecoveryPayload } from "@/src/types/recovery";

export async function getRecoveryRequests(
    page = 0,
    size = 10,
    sort: string
): Promise<RecoveryResponse> {
    const response = await api.get<RecoveryResponse>(
        "/items/admin/recovery",
        {
            params: {
                page,
                size,
                sort,
                statusRecovery: "PENDING"
            },
        }
    );

    return response.data;
}

export async function reviewRecoveryRequest(
    payload: ReviewRecoveryPayload
) {
    const response = await api.post(
        "/items/admin/recovery/withdrawal-requests/review",
        payload
    );

    return response.data;
}