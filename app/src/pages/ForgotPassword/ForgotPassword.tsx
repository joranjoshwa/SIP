import { useState } from "react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <AuthCard
            headerContent={<Logo className="mb-4" />}
            title="Recuperar conta"
            subtitle="Informe seu e-mail para receber o link de redefinição"
        >
            <form className="space-y-4">
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

            </form>



        </AuthCard>
    );
}