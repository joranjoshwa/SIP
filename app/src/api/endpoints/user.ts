import { ResendVerifyResponse, VerifyTokenResponse } from "../../types/user";
import { extractEmailFromToken } from "../../utils/jwt";
import { api } from "../axios";

export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
    const { data } = await api.post(`/user/account/verify/${token}`);
    return data;
}

export const resendVerifyToken = async (token: string): Promise<ResendVerifyResponse> => {
    const email = extractEmailFromToken(token);

    if (!email) {
        throw new Error("Não foi possível extrair o email de token.");
    }

    const { data } = await api.post(`/user/account/resend-verify-account/${email}`);
    return data;
}