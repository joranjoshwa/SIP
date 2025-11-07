import axios from "axios";
import type { Withdrawal, PostWithdrawalResponse } from "../../types/withdrawal";
import { api } from "../axios";

const buildDateTime = (dateStr: string, time: string): string => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}T${time}:00`;
};

export const postWithdrawal = async (
    withdrawal: Withdrawal,
    token: string
): Promise<PostWithdrawalResponse> => {
    const payload = {
        itemId: withdrawal.itemId,
        email: withdrawal.email,
        description: withdrawal.description,
        dateTime: buildDateTime(withdrawal.date, withdrawal.time),
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
            const status = e.response?.status;
            const data = e.response?.data;

            let message: string | undefined;

            if (typeof data === "string") {
                message = data;
            } else if (data && typeof (data as any).message === "string") {
                message = (data as any).message;
            }

            return {
                success: false,
                status,
                error: message ?? "Erro ao enviar solicitação de recuperação.",
            };
        }

        let message = "Erro inesperado ao enviar solicitação de recuperação.";
        if (e instanceof Error) {
            message = e.message;
        }

        return {
            success: false,
            error: message,
        };
    }
};
