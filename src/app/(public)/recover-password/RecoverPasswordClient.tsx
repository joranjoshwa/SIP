"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";
import { AuthCard } from "@/src/components/layout/AuthCard";
import { Button } from "@/src/components/ui/Button";
import { Logo } from "@/src/components/ui/Logo";
import { resetPassword } from "@/src/api/endpoints/user";
import { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/user";
import { PasswordField } from "@/src/components/ui/PasswordField";
import { Loading } from "@/src/components/ui/Loading";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get("token") || null;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!token) {
            setError("Token inválido ou expirado.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            await resetPassword(token, password);
            router.push("/login?success=password-reset");
        } catch (error: any) {
            const err = error as AxiosError<ApiResponse>;

            if (err.response?.data) {
                const errors =
                    err.response.data.message ??
                    Object.values(err.response.data).join(" | ");

                setError(errors);
            } else {
                setError("Erro ao redefinir a senha. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AuthCard
                headerContent={<Logo className="mb-4" />}
                title="Redefinir Senha"
                subtitle="Crie uma nova senha para acessar sua conta"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <PasswordField
                        label="Nova Senha"
                        placeholder="Digite sua nova senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <PasswordField
                        label="Confirmar Senha"
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button variant="primary" className={loading ? "opacity-70" : ""}>
                        {loading ? "Redefinindo..." : "Redefinir Senha"}
                    </Button>

                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </form>
            </AuthCard>

            <Loading isLoading={loading} />
        </>

    );
}