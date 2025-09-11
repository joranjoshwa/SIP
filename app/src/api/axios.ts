import axios from "axios";
import { isTokenExpired } from "../utils/token";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

        const raw = localStorage.getItem("token");

        if (raw) {
            if (isTokenExpired(raw)) {
                // 🚨 Option 1: clear and redirect to login
                localStorage.removeItem("token");
                // window.location.href = "/login"; // if you want redirect
                return config;
            }

            // Ensure Bearer prefix
            const token = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
            config.headers = config.headers ?? {};
            config.headers.Authorization = token;
        }
    

    return config;
});
