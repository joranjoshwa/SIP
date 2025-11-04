import { api } from "../axios";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "../../types/auth";

export const loginResponse = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post("/authentication/login", payload);
    return data;
}

export const registerResponse = async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await api.post("/authentication/register", payload);
    return data;
}
