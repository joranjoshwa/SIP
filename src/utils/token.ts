import { jwtDecode } from "jwt-decode";
import { TokenType } from "../types/token";
import { JwtPayload } from "../types/jwt";

export const extractEmailFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const sub = decoded.sub;

        if (sub.startsWith("{")) {
            const parsed = JSON.parse(sub);
            return parsed.to || null;
        }

        return sub;

    } catch (err) {
        console.log("Erro ao extrair email do token: ", err);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return false;
        return decoded.exp * 1000 < Date.now();

    } catch {
        return true;
    }
};

export const getTokenTypeFromString = (value: string | null): TokenType | null => {
    if (value === TokenType.VERIFICATION) return TokenType.VERIFICATION;
    if (value === TokenType.REACTIVATE) return TokenType.REACTIVATE;
    return null;
}

export const scheduleTokenExpiryLogout = (
    token: string | null,
    onExpire: () => void
) => {
    if (!token || typeof window === "undefined") return () => { };
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded?.exp) return () => { };

        const expireAt = decoded.exp * 1000;
        const msUntilExpire = expireAt - Date.now();

        if (msUntilExpire <= 0) {
            onExpire();
            return () => { };
        }

        const id = window.setTimeout(() => {
            onExpire();
        }, msUntilExpire);

        return () => clearTimeout(id);
    } catch {
        return () => { };
    }
};

export const extractRoleFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role || null;
    } catch (err) {
        console.error("Error extracting role from token: ", err);
        return null;
    }
};

export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    window.location.href = "/login";
};
