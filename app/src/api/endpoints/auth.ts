import { api } from "../axios";
import { LoginPayload, LoginResponse, RegisterPayload } from "../../types/auth"

export const loginResponse = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post("/authentication/login", payload);
    return data;
}

export const registerResponse = async (payload: RegisterPayload): Promise<RegisterPayload> => {
    const { data } = await api.post("/authentication/register", payload);
    return data;
}