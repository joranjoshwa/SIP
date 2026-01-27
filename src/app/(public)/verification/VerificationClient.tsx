"use client";

import { useEffect, useState } from "react";
import { AuthCard } from "@/src/components/layout/AuthCard";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import {
    resendReactivationToken,
    resendVerifyToken,
    verifyReactivationToken,
    verifyToken,
} from "@/src/api/endpoints/user";
import { TokenType } from "@/src/types/token";

function extractNiceMessage(err: unknown, fallback: string) {
    if (err instanceof Error && err.message) return err.message;

    const anyErr = err as any;
    const data = anyErr?.response?.data;

    const apiMsg =
        data?.message ??
        data?.error ??
        (typeof data === "string" ? data : null);

    return apiMsg ?? anyErr?.message ?? fallback;
}

export default function VerificationClient() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [token, setToken] = useState<string | null>(null);
    const [tokenType, setTokenType] = useState<TokenType | null>(null);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [infoMsg, setInfoMsg] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const t = searchParams?.get("token");
        if (!t) {
            setErrorMsg("Token não encontrado na URL.");
            setStatus("error");
            return;
        }

        setToken(t);

        const tt = searchParams?.get("type") as TokenType | null;
        setTokenType(tt);

        const checkToken = async () => {
            setErrorMsg(null);
            setInfoMsg(null);

            try {
                if (tt === TokenType.VERIFICATION) {
                    await verifyToken(t);
                } else if (tt === TokenType.REACTIVATE) {
                    await verifyReactivationToken(t);
                } else {
                    throw new Error("Tipo de token inválido.");
                }

                setStatus("success");
            } catch (err) {
                setErrorMsg(extractNiceMessage(err, "Erro ao verificar token."));
                setStatus("error");
            }
        };

        checkToken();
    }, [searchParams]);

    const handleSendLogin = () => router.push("/login");

    const handleResend = async () => {
        if (!token) return;

        setErrorMsg(null);
        setInfoMsg(null);

        try {
            await resendVerifyToken(token, null);
            setInfoMsg("Novo link enviado para seu e-mail.");
        } catch (err) {
            setErrorMsg(extractNiceMessage(err, "Erro ao reenviar link. Tente novamente."));
        }
    };

    const handleResendReactivation = async () => {
        if (!token) return;

        setErrorMsg(null);
        setInfoMsg(null);

        try {
            await resendReactivationToken(token);
            setInfoMsg("Novo link de reativação enviado para seu e-mail.");
        } catch (err) {
            setErrorMsg(extractNiceMessage(err, "Erro ao reenviar link de reativação. Tente novamente."));
        }
    };

    if (status === "loading") {
        return (
            <AuthCard
                title={tokenType === TokenType.REACTIVATE ? "Reativando conta..." : "Verificando o seu e-mail..."}
                subtitle="Aguarde alguns segundos enquanto confirmamos."
                headerContent={<Loader2 className="w-12 h-12 animate-spin text-blue-600" suppressHydrationWarning />}
            >
                <></>
            </AuthCard>
        );
    }

    if (status === "success") {
        return (
            <AuthCard
                title={tokenType === TokenType.REACTIVATE ? "Conta reativada!" : "E-mail verificado com sucesso!"}
                subtitle={infoMsg ?? "Agora você já pode acessar a sua conta."}
                headerContent={<CheckCircle className="w-12 h-12 text-green-600" suppressHydrationWarning />}
            >
                <Button variant="primary" onClick={handleSendLogin}>
                    Ir para login
                </Button>
            </AuthCard>
        );
    }

    const defaultSubtitle =
        tokenType === TokenType.REACTIVATE
            ? "Solicite um novo link para reativação."
            : "Solicite um novo link para verificar o seu e-mail.";

    return (
        <AuthCard
            title={tokenType === TokenType.REACTIVATE ? "Falha ao reativar conta" : "Link inválido ou expirado"}
            subtitle={errorMsg ?? defaultSubtitle}
            headerContent={<XCircle className="w-12 h-12 text-red-600" suppressHydrationWarning />}
        >
            {infoMsg && (
                <div className="text-sm text-green-600">
                    {infoMsg}
                </div>
            )}

            {tokenType === TokenType.VERIFICATION && (
                <Button variant="secondary" onClick={handleResend}>
                    Reenviar e-mail
                </Button>
            )}

            {tokenType === TokenType.REACTIVATE && (
                <Button variant="secondary" onClick={handleResendReactivation}>
                    Reenviar link de reativação
                </Button>
            )}
        </AuthCard>
    );
}
