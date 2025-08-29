import { Mail, User, Phone, IdCard } from "lucide-react";
import { AuthCard } from "../../components/layout/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";
import { Button } from "../../components/ui/Button";

export const SignUp = () => {
    return (
        <AuthCard headerContent={<Logo className="mb-4" />}>

            <InputField 
                label="Nome Completo"
                type="text"
                placeholder="Digite seu nome..."
                icon={<User size={18}/>}
            />

            <InputField 
                label="CPF"
                type="text"
                placeholder="000.000.000-00"
                icon={<IdCard size={18} />}
            />

            <InputField 
                label="Email Institucional"
                type="email"
                placeholder="Digite seu email..."
                icon={<Mail size={18}/>}
            />

            <InputField 
                label="Telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                icon={<Phone size={18} />}
            />

            <PasswordField 
                label="Senha"
            />

            <Button
                variant="primary"
            >
                Criar conta
            </Button>

            <Button
                variant="secondary"
            >
                Entrar em conta existente
            </Button>
        </AuthCard>
    );
}