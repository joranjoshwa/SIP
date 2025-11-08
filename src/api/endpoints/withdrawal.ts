import axios from "axios";
import type { 
    Withdrawal, 
    PostWithdrawalResponse, 
    UUID, 
    ItemRecoveryResponse, 
    WithdrawalRequestItem, 
    StatusRecovery } from "../../types/withdrawal";
import { api } from "../axios";

const buildDateTime = (dateStr: string, time: string): string => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}T${time}:00`;
};

function formatRecoveryDate(iso: string): string {
    const d = new Date(iso);

    const datePart = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });

    const timePart = d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return `${datePart} às ${timePart}h`;
}

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

export const getWithdrawalRequests = async (
    itemId: UUID,
    token: string
): Promise<WithdrawalRequestItem[]> => {
    try {
        const { data } = await api.get<ItemRecoveryResponse>(
            `/items/admin/recovery-by-item/${itemId}`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
        );

        return data.recovery.map((r) => ({
            id: r.id,
            user: {
                name: r.user.name,
                avatar: r.user.profileImageUrl,
            },
            description: r.description,
            date: formatRecoveryDate(r.requestDate),
            status: r.status,
        }));
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const reviewRequest = async (
    idRecovery: UUID, 
    statusRecovery: StatusRecovery) => 
{
    const payload = {
        idRecovery,
        statusRecovery
    };

    try {
        await api.post(
            `/items/admin/recovery/withdrawal-requests/review`,
            payload
        )
    } catch (e) {
        console.log(e);
    }
}