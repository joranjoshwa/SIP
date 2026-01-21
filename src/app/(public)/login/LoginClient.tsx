"use client";

import { Mail } from "lucide-react";
import { AuthCard } from "@/src/components/layout/AuthCard";
import { InputField } from "@/src/components/ui/InputField";
import { Logo } from "@/src//components/ui/Logo";
import { PasswordField } from "@/src/components/ui/PasswordField";
import { TextLink } from "@/src/components/ui/TextLink";
import { Button } from "@/src/components/ui/Button";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopPopup } from "@/src/components/ui/TopPopup";
import { ApiResponse } from "@/src/types/user";
import { AxiosError } from "axios";
import { requestReactivation, resendVerifyByEmail } from "@/src/api/endpoints/user";
import { Loading } from "@/src/components/ui/Loading";

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mounted, setMounted] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [notVerified, setNotVerified] = useState(false);
    const [popup, setPopup] = useState<{ message: string; isOpen: boolean }>({
        message: "",
        isOpen: false,
    });

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const success = searchParams?.get("success");

        if (success === "register") {
            setPopup({
                message: "Cadastro realizado! Verifique seu email para a ativação da conta.",
                isOpen: true,
            });
        }

        if (success === "password-reset") {
            setPopup({
                message: "Senha redefinida com sucesso! Agora você pode entrar com a nova senha.",
                isOpen: true,
            });
        }

        if (success === "password-changed") {
            setPopup({
                message: "Senha alterada com sucesso! Faça login com a nova senha.",
                isOpen: true,
            });
        }

        if (success) {
            setTimeout(() => setPopup((prev) => ({ ...prev, isOpen: false })), 8000);
        }
    }, [searchParams]);

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            await login({ email, password });
            router.push("/");
            return;

        } catch (error) {
            const err = error as AxiosError<ApiResponse>;

            if (err.response?.data) {
                const errors =
                    err.response.data.message ?? Object.values(err.response.data).join(" | ");

                setError(errors);
                setBlocked(false);
                setNotVerified(false);

                if (errors.includes("Usuário bloqueado por excesso de tentativas")) {
                    setBlocked(true);
                }

                if (errors.includes("Usuário ainda não foi verificado. Procure o código no seu email e faça a verificação.")) {
                    setNotVerified(true);
                    setError("Usuário ainda não foi verificado.");
                }

            } else {
                setError("Erro inesperado");
            }

            setLoading(false);
        }
    };

    const handleSignUp = () => router.push("/signup");

    const handleReactivation = async (email: string) => {
        setLoading(true);
        setError("");

        try {
            await requestReactivation(email);
            setPopup({
                message: "E-mail de reativação enviado! Verifique sua caixa de entrada.",
                isOpen: true,
            });
        } catch {
            setError("Erro ao solicitar reativação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async (email: string) => {
        if (!email) {
            setError("Informe o e-mail para reenviar a verificação.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await resendVerifyByEmail(email);
            setPopup({
                message: "E-mail de verificação reenviado! Confira sua caixa de entrada.",
                isOpen: true,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao reenviar verificação.");
        } finally {
            setLoading(false);
        }
    };

    const handleOnPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleLogin();
    };

    if (!mounted) {
        return (
            <main role="main">
                <div className="min-h-screen flex items-center justify-center px-2">
                    <div className="w-full max-w-sm p-6 rounded-2xl shadow-md" />
                </div>
            </main>
        );
    }

    return (
        <main role="main">
            <AuthCard
                headerContent={
                    <header>
                        <Logo className="mb-4" />
                    </header>
                }
            >
                <InputField
                    label="Email institucional"
                    type="email"
                    placeholder="Email institucional"
                    icon={<Mail size={18} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    onPressEnter={handleOnPressEnter}
                />

                <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    onPressEnter={handleOnPressEnter}
                />

                {error &&
                    (blocked ? (
                        <p
                            onClick={() => handleReactivation(email)}
                            className="text-red-600 text-sm cursor-pointer underline hover:text-red-800"
                        >
                            {error} Clique aqui para reativar a conta.
                        </p>
                    ) : notVerified ? (
                        <p
                            onClick={() => handleResendVerification(email)}
                            className="text-red-600 text-sm cursor-pointer underline hover:text-red-800"
                        >
                            {error} Clique aqui para reenviar o e-mail de verificação.
                        </p>
                    ) : (
                        <p className="text-red-600 text-sm">{error}</p>
                    ))}

                <TextLink href="/forgot-password" className="self-end ml-2 dark:text-gray-300">
                    Esqueci minha senha
                </TextLink>

                <Button variant="primary" onClick={handleLogin}>
                    {loading ? "Entrando..." : "Entrar na conta"}
                </Button>

                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-300 w-1/3" />
                    <span className="mx-2 text-gray-500 text-sm">ou</span>
                    <div className="border-t border-gray-300 w-1/3" />
                </div>

                <Button variant="secondary" onClick={handleSignUp}>
                    Criar nova conta
                </Button>

                <TopPopup
                    message="Cadastro realizado! Verifique seu email para a ativação da conta."
                    isOpen={showPopup}
                    onClose={() => setShowPopup(false)}
                />

                <TopPopup
                    message={popup.message}
                    isOpen={popup.isOpen}
                    onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
                />
            </AuthCard>

            <Loading isLoading={loading} />
        </main>
    );
}
