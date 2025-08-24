import { Mail } from "lucide-react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";
import { TextLink } from "../../components/ui/TextLink";
import { Button } from "../../components/ui/Button";

export const Login = () => {
    return(
        <AuthCard 
            headerContent={<Logo className="mb-4" />}
        >
            <InputField 
                label="Email institucional"
                type="email"
                placeholder="Email institucional"
                icon={<Mail size={18} />}
            />

            <PasswordField />

            <TextLink href="*/" className="self-end ml-2">Esqueci minha senha</TextLink>

            <Button variant="primary">Entrar na conta</Button>
            <Button variant="secondary">Criar nova conta</Button>
        </AuthCard>
    );
}