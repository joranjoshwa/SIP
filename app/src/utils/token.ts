import { jwtDecode } from "jwt-decode";
import { TokenType } from "../types/token";
import { JwtPayload } from "../types/jwt";

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

export const getTokenTypeFromString = (value: string | null): TokenType | null => {
    if (value === TokenType.VERIFICATION) return TokenType.VERIFICATION;
    if (value === TokenType.REACTIVATE) return TokenType.REACTIVATE;
    return null;
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return false;
        return decoded.exp * 1000 < Date.now();

    } catch {
        return true;
    }
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