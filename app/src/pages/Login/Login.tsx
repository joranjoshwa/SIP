"use client"

import { Mail } from "lucide-react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";
import { TextLink } from "../../components/ui/TextLink";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopPopup } from "../../components/ui/TopPopup";
import { ApiResponse } from "../../types/user";
import { AxiosError } from "axios";
import { requestReactivation } from "../../api/endpoints/user";
import { isTokenValid } from "../../utils/token";

export const Login = () => {

    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [popup, setPopup] = useState<{ message: string; isOpen: boolean }>({
        message: "",
        isOpen: false,
    });

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token && isTokenValid(token)) {
    //         router.replace("/profile");
    //     }
    // }, [router]);

    useEffect(() => {
        const success = searchParams.get("success");

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

        if (success) {
            setTimeout(() => setPopup((prev) => ({ ...prev, isOpen: false })), 8000);
        }
    }, [searchParams]);

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            await login({ email, password });
            router.push("/profile");

        } catch (error) {
            const err = error as AxiosError<ApiResponse>;

            if (err.response?.data) {
                const errors =
                    err.response.data.message ??
                    Object.values(err.response.data).join(" | ");

                setError(errors);

                if (errors.includes("Usuário bloqueado por excesso de tentativas")) {
                    setBlocked(true);
                }


            } else {
                setError("Erro inesperado");
            }

        } finally {
            setLoading(false);
        }
    }

    const handleSignUp = () => {
        router.push("/signup")
    }

    const handleReactivation = async (email: string) => {
        setLoading(true);
        setError("");

        try {
            await requestReactivation(email);
            setPopup({
                message: "E-mail de reativação enviado! Verifique sua caixa de entrada.",
                isOpen: true,
            });

        } catch (error) {
            setError("Erro ao solicitar reativação. Tente novamente.");

        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            headerContent={<Logo className="mb-4" />}
        >
            <InputField
                label="Email institucional"
                type="email"
                placeholder="Email institucional"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
            />

            <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
            />

            {error && (
                blocked ? (
                    <p
                        onClick={() => handleReactivation(email)}
                        className="text-red-600 text-sm cursor-pointer underline hover:text-red-800"
                    >  {error} Clique aqui para reativar a conta.
                    </p>
                ) : (
                    <p className="text-red-600 text-sm">{error}</p>
                )
            )}

            <TextLink href="/forgot-password" className="self-end ml-2">Esqueci minha senha</TextLink>

            <Button
                variant="primary"
                onClick={handleLogin}
            > {loading ? "Entrando..." : "Entrar na conta"} </Button>


            <Button variant="secondary" onClick={handleSignUp}>Criar nova conta</Button>

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
    );
}