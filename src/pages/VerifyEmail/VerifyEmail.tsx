"use client"

import { useEffect, useState } from "react";
import { AuthCard } from "../../components/layout/AuthCard";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { resendReactivationToken, resendVerifyToken, verifyReactivationToken, verifyToken } from "../../api/endpoints/user";
import { TokenType } from "../../types/token";

export const VerifyEmail = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [token, setToken] = useState<string | null>(null);
    const [tokenType, setTokenType] = useState<TokenType | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token");
        setToken(token);

        if (!token) {
            setStatus("error")
            return;
        }

        const tokenType = searchParams.get("type") as TokenType | null;
        setTokenType(tokenType);

        const checkToken = async () => {
            try {
                if (tokenType === TokenType.VERIFICATION) {
                    await verifyToken(token);

                } else if (tokenType === TokenType.REACTIVATE) {
                    await verifyReactivationToken(token);
                }

                setStatus("success");

            } catch (error) {
                console.error("Erro ao verificar token: ", error);
                setStatus("error");
            }
        }

        checkToken();

    }, [searchParams]);

    const handleSendLogin = () => {
        router.push("/login")
    }

    const handleResend = async () => {
        if (!token) return;

        try {
            await resendVerifyToken(token);
            alert("Novo link enviado para seu e-mail.");

        } catch (error) {
            console.error("Erro ao reenviar: ", error);
            alert("Erro ao reenviar link. Tente novamente.")
        }
    }

    const handleResendReactivation = async () => {
        if (!token) return;

        try {
            await resendReactivationToken(token);
            alert("Novo link de reativação enviado para seu e-mail.");
        } catch (error) {
            console.error("Erro ao reenviar reativação: ", error);
            alert("Erro ao reenviar link de reativação. Tente novamente.");
        }
    };

    if (status === "loading") {
        return (
            <AuthCard
                title={tokenType === TokenType.REACTIVATE ? "Reativando conta..." : "Verificando o seu e-mail..."}
                subtitle="Aguarde alguns segundos enquanto confirmamos."
                headerContent={<Loader2 className="w-12 h-12 animate-spin text-blue-600" />}
            >
                <></>
            </AuthCard>
        );
    }

    if (status === "success") {
        return (
            <AuthCard
                title={tokenType === TokenType.REACTIVATE ? "Conta reativada!" : "E-mail verificado com sucesso!"}
                subtitle="Agora você já pode acessar a sua conta."
                headerContent={<CheckCircle className="w-12 h-12 text-green-600" />}
            >
                <Button variant="primary" onClick={handleSendLogin}>
                    Ir para login
                </Button>
            </AuthCard>
        );
    }

    if (status === "error") {
        return (
            <AuthCard
                title={tokenType === TokenType.REACTIVATE ? "Falha ao reativar conta" : "Link inválido ou expirado"}
                subtitle={tokenType === TokenType.REACTIVATE
                    ? "Solicite um novo link para reativação."
                    : "Solicite um novo link para verificar o seu e-mail."}
                headerContent={<XCircle className="w-12 h-12 text-red-600" />}
            >
                {tokenType === TokenType.VERIFICATION &&
                    <Button variant="secondary" onClick={handleResend}>
                        Reenviar e-mail
                    </Button>
                }

                {tokenType === TokenType.REACTIVATE && (
                    <Button variant="secondary" onClick={handleResendReactivation}>
                        Reenviar link de reativação
                    </Button>
                )}

            </AuthCard>
        );
    }

}