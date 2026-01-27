import { AxiosError } from "axios";
import { ApiResponse, ChangePasswordRequest } from "../../types/user";
import { extractEmailFromToken } from "../../utils/token";
import { api } from "../axios";

export class ApiError extends Error {
    status?: number;
    data?: any;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const isGenericAxiosMessage = (msg?: string) =>
    !!msg && /^Request failed with status code \d+$/i.test(msg);

export const verifyToken = async (token: string): Promise<ApiResponse> => {
    try {
        const { data } = await api.post(`/user/account/verify/${token}`);
        return data;
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        throw new Error(apiMsg ?? e.message ?? "Failed to verify token");
    }
}

export const resendVerifyAccount = async (token: string | null, emailParam: string | null): Promise<ApiResponse> => {
    
    const email = token != null ? extractEmailFromToken(token) : emailParam;

    if (!email) {
        throw new Error( token != null ? "Não foi possível extrair o email de token." : "Falha ao validar email. Tente novamente ou entre em contato com o suporte.");
    }

    try {
        const { data } = await api.post(`/user/account/resend-verify-account/${email}`);
        return data;
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        throw new Error(apiMsg ?? e.message ?? "Failed to resend token");
    }
}

export const requestReactivation = async (email: string): Promise<ApiResponse> => {
    const { data } = await api.post(`/user/account/request-reactivation/${email}`);
    return data;
}

export const verifyReactivationToken = async (token: string): Promise<ApiResponse> => {
    const { data } = await api.post(`/user/account/reactivate/${token}`);
    return data;
}

export const resendReactivationToken = async (token: string): Promise<ApiResponse> => {
    const email = extractEmailFromToken(token);

    if (!email) {
        throw new Error("Não foi possível extrair o email do token.");
    }

    const { data } = await api.post(`/user/account/request-reactivation/${email}`);
    return data;
};

export const recoverPassword = async (email: string) => {
    const { data } = await api.post(`/user/account/password-recovery/${email}`);
    return data;
}

export const getAdminUsers = async (email: string) => {
    const { data } = await api.get(`/user/root/admin-users/${email}`);
    return data;
}

export const getAdminUser = async (email: string) => {
    const { data } = await api.get(`/user/root/admin-detail/${email}`);
    return data;
}

export const resetPassword = async (token: string, password: string) => {
    const { data } = await api.post("/user/account/password-reset", {
        token,
        password,
    });
    return data;
}

export const userUpdate = async (
    data: { name: string; phone: string },
    email: string
) => {
    try {
        await api.put(`/user/root/update/${email}`, data);
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        const fallback =
            e.response?.status === 400
                ? "Dados inválidos. Verifique nome/telefone e tente novamente."
                : "Não foi possível atualizar o usuário. Tente novamente.";

        const finalMsg =
            apiMsg ??
            (isGenericAxiosMessage(e.message) ? fallback : (e.message ?? fallback));

        throw new ApiError(finalMsg, e.response?.status, e.response?.data);
    }
};

export const registerAdmin = async (data: { name: string; phone: string; email: string; cpf: string }) => {
    try {
        await api.post(`/authentication/register-admin`, data);
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        const fallback =
            e.response?.status === 400
                ? "Dados inválidos. Verifique os campos e tente novamente."
                : "Não foi possível cadastrar o administrador. Tente novamente.";

        const finalMsg = apiMsg ?? (isGenericAxiosMessage(e.message) ? fallback : (e.message ?? fallback));

        throw new ApiError(finalMsg, e.response?.status, e.response?.data);
    }
};

export const deleteAdmin = async (email: string) => {
    try {
        await api.delete(`/user/root/delete-admin/${email}`);
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        throw new Error(apiMsg ?? e.message ?? "Failed to delete admin");
    }
}

export const changePassword = async (
    token: string,
    payload: ChangePasswordRequest
): Promise<ApiResponse> => {
    const email = extractEmailFromToken(token);

    if (!email) {
        throw new Error("Não foi possível extrair o email do token.");
    }

    const { data } = await api.patch(`/user/update-password/${email}`, payload,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return data;
};