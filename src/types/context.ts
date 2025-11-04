import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "./auth"

export type AuthContextType = {
    user: LoginResponse | null;
    login: (payload: LoginPayload) => Promise<void>;
    logout: (redirectUrl?: string) => void;
    register: (payload: RegisterPayload) => Promise<RegisterResponse>;
}