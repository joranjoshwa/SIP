import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "../../components/layout/AuthCard";
import { Button } from "../../components/ui/Button";
import { Loading } from "../../components/ui/Loading";
import { Logo } from "../../components/ui/Logo";
import { PasswordField } from "../../components/ui/PasswordField";

export const ChangePassword = () => {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <>
            <AuthCard
                headerContent={<Logo className="mb-4" />}
                title="Alterar Senha"
                subtitle="Digite sua senha atual e escolha uma nova"
            >
                <form className="space-y-4">
                    <PasswordField
                        label="Senha Atual"
                        placeholder="Digite sua senha atual"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <PasswordField
                        label="Nova Senha"
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <PasswordField
                        label="Confirmar Nova Senha"
                        placeholder="Confirme sua nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        variant="primary"
                        className={loading ? "opacity-70" : ""}
                    >
                        {loading ? "Alterando..." : "Alterar Senha"}
                    </Button>

                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </form>
            </AuthCard>

            <Loading isLoading={loading} />
        </>
    );
}