"use client"

import { Mail, User, Phone, IdCard } from "lucide-react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopPopup } from "../../components/ui/TopPopup";
import { AxiosError } from "axios";
import { ApiResponse } from "../../types/user";

export const SignUp = () => {

    const { register } = useAuth();
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        setLoading(true);
        setError("");

        try {
            await register({ name, cpf, email, phone, password });
            router.push("/login?success=register")

        } catch (error: any) {
            const err = error as AxiosError<ApiResponse>

            if (err.response?.data) {
                const errors =
                    err.response.data.message ??
                    Object.values(err.response.data).join(" | ");

                setError(errors);
            } else {
                setError("Erro ao criar conta.");
            }

        } finally {
            setLoading(false);
        }
    }

    const handleLogin = () => {
        router.push("/login");
    }


    return (
        <AuthCard headerContent={<Logo className="mb-4" />}>

            <InputField
                label="Nome Completo"
                type="text"
                placeholder="Digite seu nome..."
                icon={<User size={18} />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={true}
            />

            <InputField
                label="CPF"
                type="text"
                placeholder="000.000.000-00"
                icon={<IdCard size={18} />}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
            />

            <InputField
                label="Email Institucional"
                type="email"
                placeholder="Digite seu email..."
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <InputField
                label="Telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                icon={<Phone size={18} />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />

            <PasswordField
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
                variant="primary"
                onClick={handleSignUp}
            >
                {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <Button
                variant="secondary"
                onClick={handleLogin}
            >
                Entrar em conta existente
            </Button>

            <TopPopup
                message="Cadastro realizado! Verifique seu email para a ativação da conta."
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
        </AuthCard>
    );
}