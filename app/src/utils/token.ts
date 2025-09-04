import { jwtDecode } from "jwt-decode";

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

export const extractTokenType = (token: string): "verify" | "reactivation" | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.type || null;
    } catch {
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