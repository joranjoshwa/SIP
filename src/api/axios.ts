import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../types/jwt";
import { isTokenExpired } from "../utils/token";

export function getTokenFromCookie(): string | null {
    if (typeof window !== "undefined") {
        const match = document.cookie.match(/(^| )token=([^;]+)/);
        return match ? match[2] : null;
    }

    return null;
}

export const extractEmailFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const sub = decoded.sub;

        if (!sub) return null;

        try {
            const parsed = JSON.parse(sub);
            return parsed.to || null;
        } catch {
            return sub;
        }
    } catch (err) {
        console.error("Error extracting email from token: ", err);
        return null;
    }
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const raw = getTokenFromCookie();

    if (raw) {
        if (isTokenExpired(raw)) {
            if (typeof window !== "undefined") {
                document.cookie = "token=; Max-Age=0; Path=/;";
            }
            return config;
        }

        const token = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
        config.headers = config.headers ?? {};
        config.headers.Authorization = token;
    }

    return config;
});
