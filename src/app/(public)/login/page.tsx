"use client"

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
import { requestReactivation } from "@/src/api/endpoints/user";
import { Loading } from "@/src/components/ui/Loading";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { LoginResponse } from "@/src/types/auth";
import { useTheme } from "@/src/context/ThemeContext";

export default function Login() {

    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { theme } = useTheme();

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

    const handleGoogleLogin = async (credentialResponse: any) => {
       
            if (credentialResponse.credential) {
                try {
                    setLoading(true);
                    setError("");

                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/authentication/google`,
                        { token: credentialResponse.credential }
                    );

                    const loginResponse: LoginResponse = response.data;

                    loginWithGoogle(loginResponse);
                    router.push("/");
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

    const handleOnPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key == "Enter"){
            handleLogin()
        }
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
                    required={true}
                    autoComplete="username"
                    onPressEnter={(e) => handleOnPressEnter(e)}
                />

                <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                    autoComplete="current-password"
                    onPressEnter={(e) => handleOnPressEnter(e)}
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

                <TextLink href="/forgot-password" className="self-end ml-2 dark:text-gray-300">Esqueci minha senha</TextLink>

                <Button
                    variant="primary"
                    onClick={handleLogin}
                > {loading ? "Entrando..." : "Entrar na conta"} </Button>

                <div className="flex items-center justify-center my-4">
                <div className="border-t border-gray-300 w-1/3" />
                <span className="mx-2 text-gray-500 text-sm">ou</span>
                <div className="border-t border-gray-300 w-1/3" />
                </div>

                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setError("Erro ao fazer login com Google.")}
                    useOneTap
                    theme={theme === "dark" ? "filled_black" : "outline"}
                />


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

            <Loading isLoading={loading} />
        </main>
    );
}
