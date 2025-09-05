import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";

export const ResetPassword = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <AuthCard
            headerContent={<Logo className="mb-4" />}
            title="Redefinir Senha"
            subtitle="Crie uma nova senha para acessar sua conta"
        >
            <form className="space-y-4">
                <InputField
                    label="Nova senha"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    required
                />

                <InputField
                    label="Confirmar Senha"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    required
                />

                <Button variant="primary" className={loading ? "opacity-70" : ""}>
                    {loading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
            </form>


        </AuthCard>
    );
}