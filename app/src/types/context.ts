import { LoginPayload, LoginResponse } from "./auth"

export type AuthContextType = {
    user: LoginResponse | null;
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => void;
}