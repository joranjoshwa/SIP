import { ResendVerifyResponse, VerifyTokenResponse } from "../../types/user";
import { api } from "../axios";

export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
    const { data } = await api.get(`/user/account/verify/${token}`);
    return data;
}

export const resendVerifyToken = async (email: string): Promise<ResendVerifyResponse> => {
    const { data } = await api.post(`/user/account/resend-verify-account/${email}`);
    return data;
}