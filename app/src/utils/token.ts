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

export const getTokenTypeFromString = (value: string | null): TokenType | null => {
    if (value === TokenType.VERIFICATION) return TokenType.VERIFICATION;
    if (value === TokenType.REACTIVATE) return TokenType.REACTIVATE;
    return null;
}

export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded?.exp) return false;
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch {
        return false;
    }
};

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

export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    window.location.href = "/login";
};


// export const extractTokenType = (token: string): TokenType | null => {
//     try {
//         const decoded = jwtDecode<JwtPayload>(token);

//         if (decoded.type === TokenType.VERIFICATION) {
//             return TokenType.VERIFICATION;
//         }

//         if (decoded.type === TokenType.REACTIVATE) {
//             return TokenType.REACTIVATE;
//         }

//         return null;

//     } catch (error) {
//         console.error("Erro ao decodificar o token: ", error)
//         return null;
//     }
// };