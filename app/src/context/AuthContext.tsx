"use client"

import { createContext, ReactNode, useContext, useState } from "react";
import { AuthContextType } from "../types/context";
import { LoginPayload, LoginResponse, RegisterPayload } from "../types/auth";
import { loginResponse, registerResponse } from "../api/endpoints/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<LoginResponse | null>(null);
    const router = useRouter();

    const login = async (payload: LoginPayload) => {
        try {
            const response = await loginResponse(payload);
            setUser(response);
            localStorage.setItem("token", response.token);

        } catch (error) {
            console.log("Erro no login: ", error);
            throw error;
        }
    };

    const register = async (payload: RegisterPayload) => {
        try {
            const response = await registerResponse(payload);
            return response;
        } catch (error) {
            console.log("Erro no cadastro: ", error);
            throw error;
        }
    }

    const logout = (redirectUrl?: string) => {
        setUser(null);
        localStorage.removeItem("token");

        // Só aceita string ou padrão "/login"
        const path = typeof redirectUrl === "string" ? redirectUrl : "/login";
        router.replace(path);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");

    return context;
}