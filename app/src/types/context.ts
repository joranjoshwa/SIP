import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "./auth"

export type AuthContextType = {
    user: LoginResponse | null;
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => void;
    register: (payload: RegisterPayload) => Promise<RegisterResponse>;
}