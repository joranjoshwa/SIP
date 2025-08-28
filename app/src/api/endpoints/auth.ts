import { api } from "../axios";
import { LoginPayload, LoginResponse } from "../../types/auth"

export const loginResponse = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post("/authentication/login", payload);
    return data;
}