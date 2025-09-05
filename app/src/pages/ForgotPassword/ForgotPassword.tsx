"use client"

import { useState } from "react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";
import { recoverPassword } from "../../api/endpoints/user";
import { AxiosError } from "axios";
import { ApiResponse } from "../../types/user";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await recoverPassword(email);
            setMessage("Um link de recuperação foi enviado para seu e-mail!");

        } catch (error: any) {
            const err = error as AxiosError<ApiResponse>;

            if (err.response?.data) {
                const errors =
                    err.response.data.message ??
                    Object.values(err.response.data).join(" | ");

                setMessage(errors);
            } else {
                setMessage("Erro ao enviar o e-mail. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            headerContent={<Logo className="mb-4" />}
            title="Recuperar conta"
            subtitle="Informe seu e-mail para receber o link de redefinição"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="E-mail"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={18} />}
                    required
                />

                <Button variant="primary" className={loading ? "opacity-70" : ""}>
                    {loading ? "Enviando..." : "Enviar link"}
                </Button>

                {message && (
                    <p
                        className={`mt-2 text-sm text-red-500`}
                    >
                        {message}
                    </p>
                )}

            </form>
        </AuthCard>
    );
}