import axios from "axios";
import { isTokenExpired } from "../utils/token";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
export const extractEmailFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const sub = JSON.parse(decoded.sub);
        return sub.to || null;

    } catch (err) {
        console.log("Erro ao extrair email do token: ", err);
        return null;
    }
}
api.interceptors.request.use((config) => {

        const raw = localStorage.getItem("token");

        if (raw) {
            if (isTokenExpired(raw)) {
                localStorage.removeItem("token");
                return config;
            }

            const token = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
            config.headers = config.headers ?? {};
            config.headers.Authorization = token;
        }


    return config;
});
