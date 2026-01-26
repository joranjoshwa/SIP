"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/src/components/layout/AuthCard";
import { Button } from "@/src/components/ui/Button";
import { Loading } from "@/src/components/ui/Loading";
import { Logo } from "@/src/components/ui/Logo";
import { PasswordField } from "@/src/components/ui/PasswordField";
import { changePassword } from "@/src/api/endpoints/user";
import { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/user";
import { useAuth } from "@/src/context/AuthContext";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";

const ChangePassword = () => {
    const router = useRouter();
    const { logout } = useAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) return;

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem.")
            setLoading(false);
            return;
        }

        try {
            await changePassword(token, {
                password: oldPassword,
                newPassword: newPassword
            });

            logout("/login?success=password-changed");

        } catch (err: any) {
            const errorResp = err as AxiosError<ApiResponse>;
            if (errorResp.response?.data) {
                const errors =
                    errorResp.response.data.message ??
                    Object.values(errorResp.response.data).join(" | ");
                setError(errors);
            } else {
                setError("Erro ao alterar a senha. Tente novamente.");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <ScrollableArea className="flex flex-col min-h-0">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2">
                    <AuthCard
                        title="Alterar Senha"
                        subtitle="Digite sua senha atual e escolha uma nova"
                        className="!min-h-0 !justify-start !px-0"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <PasswordField
                                label="Senha Atual"
                                placeholder="Digite sua senha atual"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />

                            <PasswordField
                                label="Nova Senha"
                                placeholder="Digite sua nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <PasswordField
                                label="Confirmar Nova Senha"
                                placeholder="Confirme sua nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <Button
                                variant="primary"
                                className={loading ? "opacity-70" : ""}
                            >
                                {loading ? "Alterando..." : "Alterar Senha"}
                            </Button>

                            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        </form>
                    </AuthCard>

                    <Loading isLoading={loading} />
                </div>
            </ScrollableArea>
        </main>
    );
}

export default ChangePassword;
