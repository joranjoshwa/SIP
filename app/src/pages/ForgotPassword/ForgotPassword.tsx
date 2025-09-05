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
import { TopPopup } from "../../components/ui/TopPopup";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setPopupMessage("");
        setIsPopupOpen(false);

        try {
            await recoverPassword(email);
            setPopupMessage("Um link de recuperação foi enviado para seu e-mail!");
            setIsPopupOpen(true);

        } catch (error: any) {
            const err = error as AxiosError<ApiResponse>;

            if (err.response?.data) {
                const errors =
                    err.response.data.message ??
                    Object.values(err.response.data).join(" | ");

                setError(errors);
            } else {
                setError("Erro ao enviar o e-mail. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
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

                    {error && (
                        <p
                            className={`mt-2 text-sm text-red-500`}
                        >
                            {error}
                        </p>
                    )}

                </form>
            </AuthCard>

            <TopPopup
                message={popupMessage}
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
        </>

    );
}