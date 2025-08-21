import { Mail } from "lucide-react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";
import { TextLink } from "../../components/ui/TextLink";
import { Button } from "../../components/ui/Button";

export const Login = () => {
    return(
        <AuthCard>
            <Logo className="mb-6" />

            <InputField 
                label="Email institucional"
                type="email"
                placeholder="Digite seu email"
                icon={<Mail size={18} />}
            />

            <PasswordField />

            <TextLink href="" className="self-end">Esqueci minha senha</TextLink>

            <Button variant="primary">Entrar na conta</Button>
            <Button variant="secondary">Criar nova conta</Button>
        </AuthCard>
    );
}