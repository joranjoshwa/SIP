import { Box, Key, Moon, LogOut, Sun, HandHeart } from "lucide-react";
import { Button } from "./Button";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/src/context/ThemeContext";
import { Role } from "@/src/types/user";

type Action = {
    key: string;
    label: string;
    Icon: React.ElementType;
    onClick?: () => void;
    role?: Role,
};

type Props = {
    userRole?: Role,
}

export const ActionList = ({ userRole }: Props) => {
    const { logout } = useAuth();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const actions: Action[] = [
        {
            key: "history",
            label: "Histórico de itens",
            Icon: Box,
            onClick: () => router.push("/dashboard/request-history"),
            role: "COMMON"
        },
        {
            key: "donation",
            label: "Itens para doação",
            Icon: HandHeart,
            onClick: () => router.push("/dashboard/donation"),
            role: "ADMIN"
        },
        {
            key: "password",
            label: "Alterar senha",
            Icon: Key,
            onClick: () => router.push("/dashboard/change-password"),
        },
        {
            key: "theme",
            label: `Alterar tema`,
            Icon: theme === "dark" ? Moon : Sun,
            onClick: toggleTheme,
        },
        {
            key: "logout",
            label: "Sair da conta",
            Icon: LogOut,
            onClick: () => logout("/login"),
        },
    ];

    return (
        <div className="mt-4 space-y-3">
            {actions.map(({ key, label, Icon, onClick, role }) => {
                if(role && role !== userRole ) return;
                return (
                    <Button
                        key={key}
                        variant="primary"
                        onClick={onClick}
                        className="flex items-center justify-center gap-3 md:w-1/2 md:py-2 md:px-3"
                        aria-label={label}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Button>
                )
            })}
        </div>
    );
};
