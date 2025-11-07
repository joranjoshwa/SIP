import axios from "axios";
import type { Withdrawal, PostWithdrawalResponse } from "../../types/withdrawal";
import { api } from "../axios";

export const postWithdrawal = async (
    withdrawal: Withdrawal,
    token: string
): Promise<PostWithdrawalResponse> => {
    const payload = {
        description: withdrawal.description,
        email: withdrawal.email,
        itemId: withdrawal.itemId,
    };

    try {
        const resp = await api.post(
            "/items/recovery/withdrawal-requests",
            payload,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
        );

        return { success: true, data: resp.data };
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            return {
                success: false,
                status: e.response?.status,
                error: e.response?.data.message,
            };
        }
        return { success: false, error: e as string };
    }
};
