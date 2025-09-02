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

    export const Login = () => {

        const { login } = useAuth();
        const router = useRouter();
        const searchParams = useSearchParams();

        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
        const [showPopup, setShowPopup] = useState(false);

        useEffect(() => {
            if (searchParams.get("success") === "register") {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 8000)
            }
        }, [searchParams]);

        const handleLogin = async () => {
            setLoading(true);
            setError("");

            try {
                await login({ email, password });
                alert("Login realizado com sucesso!");

            } catch (error) {
                const err = error as AxiosError<ApiResponse>;

                if (err.response?.data) {
                    const errors =
                      err.response.data.message ??
                      Object.values(err.response.data).join(" | ");
                
                    setError(errors);
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

        return(
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
                />

                <PasswordField 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}           
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <TextLink href="*/" className="self-end ml-2">Esqueci minha senha</TextLink>

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
                
            </AuthCard>
        );
    }