import { ApiResponse, ChangePasswordRequest } from "../../types/user";
import { extractEmailFromToken } from "../../utils/token";
import { api } from "../axios";

export const verifyToken = async (token: string): Promise<ApiResponse> => {
    const { data } = await api.post(`/user/account/verify/${token}`);
    return data;
}

export const resendVerifyToken = async (token: string): Promise<ApiResponse> => {
    const email = extractEmailFromToken(token);

    if (!email) {
        throw new Error("Não foi possível extrair o email de token.");
    }

    const { data } = await api.post(`/user/account/resend-verify-account/${email}`);
    return data;
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

export const resetPassword = async (token: string, password: string) => {
    const { data } = await api.post("/user/account/password-reset", {
        token,
        password,
    });
    return data;
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