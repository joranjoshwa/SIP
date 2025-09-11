import { Box, Key, Moon, LogOut } from "lucide-react";
import { Button } from "./Button";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

type Action = {
    key: string;
    label: string;
    Icon: React.ElementType;
    onClick?: () => void;
};

export const ActionList = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const actions: Action[] = [
        { key: "history", label: "Histórico de itens", Icon: Box },
        { key: "password", label: "Alterar senha", Icon: Key, onClick: () => router.push("change-password") },
        { key: "theme", label: "Alterar tema", Icon: Moon },
        { key: "logout", label: "Sair da conta", Icon: LogOut, onClick: logout },
    ];

    return (
        <div className="mt-4 space-y-3">
            {actions.map(({ key, label, Icon, onClick }) => (
                <Button
                    key={key}
                    variant="primary"
                    onClick={onClick}
                    className="flex items-center justify-center gap-3 md:w-1/2 md:py-2 md:px-3"
                >
                    <Icon size={18} />
                    <span>{label}</span>
                </Button>
            ))}
        </div>
    );
}