"use client"

import { useEffect, useState } from "react";
import { AuthCard } from "../../components/layout/AuthCard";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useRouter } from "next/navigation";

export const VerifyEmail = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const router = useRouter();

    const handleSendLogin = () => {
        router.push("/login")
    }

    useEffect(() => {
        const token = "ok";
        
        if (!token) {
            setStatus("error")
            return;
        }

        setTimeout(() => {
            if (token === "ok") setStatus("success");
            else setStatus("error");
        }, 3000)
    }, []);

    if (status === "loading") {
        return (
            <AuthCard 
                title="Verificando o seu e-mail..."
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
                title="E-mail verificado com sucesso!"
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
            title="Link inválido ou expirado"
            subtitle="Solicite um novo link para verificar o seu e-mail."
            headerContent={<XCircle className="w-12 h-12 text-red-600" />}
        >
            <Button variant="secondary">
                Reenviar e-mail
            </Button>

        </AuthCard>
    );
    }
    
}