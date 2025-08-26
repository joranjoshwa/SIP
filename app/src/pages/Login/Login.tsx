import { Mail } from "lucide-react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";
import { TextLink } from "../../components/ui/TextLink";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

    export const Login = () => {

        const { login } = useAuth();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const handleLogin = async () => {
            setLoading(true);
            setError("");

            try {
                await login({ email, password });
                alert("Login realizado com sucesso!");

            } catch (error) {
                setError("Email ou senha inválidos!");

            } finally {
                setLoading(false);
            }
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
                <Button variant="secondary">Criar nova conta</Button>
            </AuthCard>
        );
    }